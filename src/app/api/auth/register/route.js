import { NextResponse } from "next/server";
export async function POST(request) {
  return NextResponse.json(
    {
      message:
        "Public registration is disabled. Contact a system administrator for an invitation.",
    },
    { status: 403 },
  );
}
