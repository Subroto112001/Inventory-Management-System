import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful!",
      },
      { status: 200 }
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
        message:
          process.env.NODE_ENV === "development"
            ? error?.message || "Logout failed"
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}