import AuditLog from "../models/auditLogModel.js";

/**
 * Writes an admin/audit trail event.
 *
 * Intentionally "best effort": callers should not block the main request on
 * audit failures.
 */
export const logAudit = async ({
  actorId,
  actorRole,
  action,
  entityType,
  entityId,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      metadata,
    });
  } catch (err) {
    // Best-effort auditing: never block the main request.
    console.error("Audit log failed:", err?.message || err);
  }
};


