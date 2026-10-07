import { NextResponse } from "next/server";
import { clearAuthCookie, getAuthenticatedUser } from "@/lib/auth";
import User from "@/lib/models/User";
import connectMongoDB from "@/lib/databse/mongodb";

export async function POST(request) {
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
    console.error("=================================");
    console.error("LOGOUT API ERROR");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("=================================");

    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete logout",
      },
      { status: 500 },
    );
  }
}
