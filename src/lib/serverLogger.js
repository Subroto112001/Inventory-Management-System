import { AsyncLocalStorage } from "node:async_hooks";

const requestContext = new AsyncLocalStorage();
const SECRET_PATTERNS = [
  /(mongodb(?:\+srv)?:\/\/)[^\s"'<>]+/gi,
  /(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi,
  /((?:password|token|secret|api[_-]?key|authorization)\s*[:=]\s*)[^\s,;]+/gi,
];

export function withLogContext(context, callback) {
  return requestContext.run(context, callback);
}

export function redactLogValue(value) {
  let text = String(value ?? "");
  for (const pattern of SECRET_PATTERNS) text = text.replace(pattern, "$1[REDACTED]");
  return text;
}

function safeValue(value) {
  if (value instanceof Error) {
    return { name: value.name, message: redactLogValue(value.message), stack: redactLogValue(value.stack || "") };
  }
  if (typeof value === "string") return redactLogValue(value);
  if (Array.isArray(value)) return value.map(safeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !/password|token|secret|api.?key|cookie|authorization/i.test(key))
      .map(([key, nested]) => [key, safeValue(nested)]));
  }
  return value;
}

function write(level, message, context = {}) {
  const safeContext = safeValue({ ...requestContext.getStore(), ...context });
  const entry = { timestamp: new Date().toISOString(), level, message: redactLogValue(message), ...safeContext };
  const output = JSON.stringify(entry);
  if (level === "error") console.error(output);
  else if (level === "warn") console.warn(output);
  else console.info(output);
}

export const logger = {
  debug: (message, context) => {
    if (process.env.NODE_ENV === "development") write("debug", message, context);
  },
  info: (message, ...details) => write("info", message, details.length ? { diagnostics: details } : {}),
  warn: (message, ...details) => write("warn", message, details.length ? { diagnostics: details } : {}),
  error: (message, ...details) => write("error", message, details.length ? { diagnostics: details } : {}),
};
