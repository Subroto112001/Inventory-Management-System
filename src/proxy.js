import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const SAFE_REQUEST_ID = /^[A-Za-z0-9._-]{8,64}$/;

export function proxy(request) {
  const incoming = request.headers.get("x-request-id") || "";
  const requestId = SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = { matcher: ["/api/:path*"] };
