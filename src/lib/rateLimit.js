const attempts = new Map();

export function checkRateLimit(
  key,
  { limit = 10, windowMs = 15 * 60 * 1000 } = {},
) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfter: 0 };
}

export function recordRateLimitFailure(
  key,
  { windowMs = 15 * 60 * 1000 } = {},
) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  current.count += 1;
}

export function clearRateLimit(key) {
  attempts.delete(key);
}
