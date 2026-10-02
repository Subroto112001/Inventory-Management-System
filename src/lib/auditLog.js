import AuditLog from "@/lib/models/AuditLog";

export async function recordAuditLog({
  actor,
  action,
  resource,
  resourceId,
  metadata,
  session,
}) {
  if (!actor || !resourceId) return;
  await AuditLog.create(
    [{ actor, action, resource, resourceId, metadata }],
    session ? { session } : undefined,
  );
}
