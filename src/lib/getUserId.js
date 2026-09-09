import { verifyAccessToken } from "@/lib/auth";

export function getUserId(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  const payload = verifyAccessToken(token);
  return payload?.id || null;
}
