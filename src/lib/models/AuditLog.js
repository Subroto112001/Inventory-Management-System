import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const auditLogSchema = new Schema(
  {
    actor: { type: Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true, trim: true, maxlength: 80 },
    resource: { type: String, required: true, trim: true, maxlength: 80 },
    resourceId: { type: Types.ObjectId, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

auditLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);
