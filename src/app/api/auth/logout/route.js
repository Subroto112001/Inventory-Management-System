import { logger } from "@/lib/serverLogger";
import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import { clearAuthCookie, getAuthenticatedUser } from "@/lib/auth";
import User from "@/lib/models/User";
import connectMongoDB from "@/lib/databse/mongodb";

async function POSTHandler(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (user) { await connectMongoDB(); await User.updateOne({ _id: user._id }, { $inc: { authVersion: 1 } }); }
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful!",
      },
      { status: 200 },
    );

    clearAuthCookie(response);

    return response;
  } catch (error) {
    logger.error("Logout API failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete logout",
      },
      { status: 500 },
    );
  }
}

export const POST = withApiErrorHandling(POSTHandler, "POST /api/auth/logout");
