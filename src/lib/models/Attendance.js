import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const attendanceSchema = new Schema(
  {
    employee: { type: Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    checkIn: Date,
    checkOut: Date,
    status: {
      type: String,
      enum: ["Present", "Late", "Absent"],
      required: true,
    },
    notes: { type: String, trim: true, maxlength: 500 },
    recordedBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: -1, status: 1 });

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);
