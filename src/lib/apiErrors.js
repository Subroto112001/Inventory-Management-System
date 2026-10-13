import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { logger, withLogContext } from "@/lib/serverLogger";

const SAFE_REQUEST_ID = /^[A-Za-z0-9._-]{8,64}$/;

export function getRequestId(request) {
  const incoming = request?.headers?.get?.("x-request-id") || "";
  return SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
}

export class AppError extends Error {
  constructor(message, { code = "APPLICATION_ERROR", status = 400, details } = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function classifyError(error) {
  if (error?.code === 11000) {
    return { status: 409, code: "DUPLICATE_RECORD", message: "A record with these details already exists." };
  }
  if (error?.name === "ValidationError") {
    const details = Object.entries(error.errors || {}).map(([field, issue]) => ({
      field,
      message: issue?.message || "Invalid value.",
    }));
    return { status: 400, code: "VALIDATION_ERROR", message: "Please check the submitted information.", details };
  }
  if (error?.name === "CastError") {
    return { status: 400, code: "INVALID_IDENTIFIER", message: "The requested item is invalid." };
  }
  if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error?.name)) {
    return { status: 401, code: "UNAUTHENTICATED", message: "Please sign in again." };
  }
  if (error?.status === 401 || error?.statusCode === 401) {
    return { status: 401, code: "UNAUTHENTICATED", message: "Please sign in again." };
  }
  if (error?.status === 403 || error?.statusCode === 403) {
    return { status: 403, code: "FORBIDDEN", message: "You do not have permission to do that." };
  }
  if (error?.status === 404 || error?.statusCode === 404) {
    return { status: 404, code: "NOT_FOUND", message: "The requested item could not be found." };
  }
  if (error?.status === 429 || error?.statusCode === 429) {
    return { status: 429, code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." };
  }
  if (error instanceof AppError) {
    return { status: error.status, code: error.code, message: error.message, details: error.details };
  }
  if (error?.status === 400 || error?.statusCode === 400 || error?.status === 422 || error?.statusCode === 422) {
    return { status: 400, code: "VALIDATION_ERROR", message: error?.message || "Please check the submitted information." };
  }
  if (/MongoServerSelectionError|MongooseServerSelectionError|querySrv|buffering timed out/i.test(`${error?.name} ${error?.message}`)) {
    return { status: 503, code: "DATABASE_UNAVAILABLE", message: "Service is temporarily unavailable. Please try again shortly." };
  }
  return { status: 500, code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." };
}

function errorResponseBody(body, requestId, status) {
  const safe = body && typeof body === "object" && !Array.isArray(body) ? { ...body } : {};
  const statusCode = {
    400: "VALIDATION_ERROR",
    401: "UNAUTHENTICATED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_ERROR",
    429: "RATE_LIMITED",
  }[status];
  const code = safe.error?.code || (status >= 500 ? "INTERNAL_ERROR" : statusCode || "REQUEST_FAILED");
  if (status >= 500) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: { code },
      requestId,
    };
  }
  safe.success = safe.success === undefined ? false : safe.success;
  safe.message = safe.message || "The request could not be completed.";
  safe.error = { code };
  safe.requestId = requestId;
  for (const key of ["stack", "stackTrace", "connectionString", "databaseUri", "internalPath"]) delete safe[key];
  if (Array.isArray(safe.details)) {
    safe.details = safe.details.map((detail) => ({ field: detail?.field, message: detail?.message }));
  }
  return safe;
}

export function withApiErrorHandling(handler, operation) {
  return async function handledApiRequest(request, ...args) {
    const requestId = getRequestId(request);
    const method = request?.method || "UNKNOWN";
    const path = request?.nextUrl?.pathname || new URL(request.url).pathname;
    let response;
    try {
      response = await withLogContext({ requestId, method, path, operation }, () => handler(request, ...args));
    } catch (error) {
      const mapped = classifyError(error);
      logger.error("Unhandled API exception", {
        requestId,
        method,
        path,
        operation,
        error: error instanceof Error ? error : new Error(String(error)),
        code: mapped.code,
      });
      const body = {
        success: false,
        message: mapped.message,
        error: { code: mapped.code },
        requestId,
        ...(mapped.details?.length ? { details: mapped.details } : {}),
      };
      response = NextResponse.json(body, { status: mapped.status });
    }

    const headers = new Headers(response.headers);
    headers.set("x-request-id", requestId);
    if (response.status < 400 || response.status === 204 || response.status === 304) {
      try {
        response.headers.set("x-request-id", requestId);
        return response;
      } catch {
        return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
      }
    }

    let body;
    try {
      body = await response.clone().json();
    } catch {
      body = null;
    }
    const safeBody = errorResponseBody(body, requestId, response.status);
    headers.set("content-type", "application/json; charset=utf-8");
    headers.delete("content-length");
    const setCookies = response.headers.getSetCookie?.() || [];
    headers.delete("set-cookie");
    const safeResponse = NextResponse.json(safeBody, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
    for (const cookie of setCookies) safeResponse.headers.append("set-cookie", cookie);
    return safeResponse;
  };
}
