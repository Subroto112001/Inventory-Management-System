import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import { SYSTEM_ROLES, DEPARTMENTS, ACCOUNT_STATUSES } from "@/lib/models/User";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

async function GETHandler(request) {
  const access = await requirePermission(request, PERMISSIONS.USERS_MANAGE);
  if (!access.ok) return access.response;

  return NextResponse.json({
    roles: SYSTEM_ROLES,
    departments: DEPARTMENTS,
    statuses: ACCOUNT_STATUSES,
  });
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/role");
