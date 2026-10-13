import { logger } from "@/lib/serverLogger";
import { withApiErrorHandling } from "@/lib/apiErrors";
import { getAuthenticatedUser } from "@/lib/auth";
import { NextResponse } from "next/server";

async function GETHandler(request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          message: "You are not authorized to access this resource.",
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        message: "User fetched successfully",
        success: true,
        user: user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    logger.error("Get User API Error:", error);

    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 },
    );
  }
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/adduser/me");
