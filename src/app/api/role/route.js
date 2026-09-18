import { NextResponse } from "next/server";
import { SYSTEM_ROLES, DEPARTMENTS, ACCOUNT_STATUSES } from "@/lib/models/User";

export async function GET() {
  return NextResponse.json({
    roles: SYSTEM_ROLES,
    departments: DEPARTMENTS,
    statuses: ACCOUNT_STATUSES,
  });
}
