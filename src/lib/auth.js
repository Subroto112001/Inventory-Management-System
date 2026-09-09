import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";

const TOKEN_COOKIE = "token";

function getToken(cookieSource) {
  const cookieStore = cookieSource?.cookies ?? cookieSource;
  return cookieStore?.get?.(TOKEN_COOKIE)?.value || null;
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters",
    );
  }
  return secret;
}

export function signAccessToken(user, expiresIn = "1d") {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      department: user.department,
    },
    getJwtSecret(),
    { expiresIn },
  );
}

export function verifyAccessToken(token) {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (
      typeof payload !== "object" ||
      !payload.id ||
      !mongoose.isValidObjectId(payload.id)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(request) {
  const token = getToken(request);
  const payload = verifyAccessToken(token);
  if (!payload) return null;

  await connectMongoDB();
  const user = await User.findById(payload.id).select(
    "-password -refreshToken",
  );
  if (!user || user.accountStatus !== "Active") return null;
  return user;
}

export async function requireAuth(request) {
  const user = await getAuthenticatedUser(request);
  return user;
}

export function clearAuthCookie(response) {
  response.cookies.set(TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
  return response;
}
