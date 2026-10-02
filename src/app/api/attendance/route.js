import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Attendance from "@/lib/models/Attendance";
import User from "@/lib/models/User";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

export const dynamic = "force-dynamic";

function dayStart(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request) {
  const access = await requirePermission(request, PERMISSIONS.ATTENDANCE_READ);
  if (!access.ok) return access.response;
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 50, 1),
      100,
    );
    const dateValue = searchParams.get("date");
    const filter = {};
    if (dateValue) {
      const date = dayStart(dateValue);
      if (!date)
        return NextResponse.json(
          { success: false, message: "Invalid date" },
          { status: 400 },
        );
      filter.date = date;
    }
    if (searchParams.get("employee")) {
      if (!mongoose.isValidObjectId(searchParams.get("employee")))
        return NextResponse.json(
          { success: false, message: "Invalid employee id" },
          { status: 400 },
        );
      filter.employee = searchParams.get("employee");
    }
    await connectMongoDB();
    const [attendance, total] = await Promise.all([
      Attendance.find(filter)
        .populate("employee", "firstName lastName email department role")
        .sort({ date: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Attendance.countDocuments(filter),
    ]);
    return NextResponse.json({
      success: true,
      attendance,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to fetch attendance" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const access = await requirePermission(
    request,
    PERMISSIONS.ATTENDANCE_MANAGE,
  );
  if (!access.ok) return access.response;
  try {
    const body = await request.json();
    const date = dayStart(body.date);
    if (
      !mongoose.isValidObjectId(body.employee) ||
      !date ||
      !["Present", "Late", "Absent"].includes(body.status)
    )
      return NextResponse.json(
        {
          success: false,
          message: "Employee, date and valid status are required",
        },
        { status: 400 },
      );
    await connectMongoDB();
    const employee = await User.findOne({
      _id: body.employee,
      role: { $ne: "Customer" },
    }).select("_id");
    if (!employee)
      return NextResponse.json(
        { success: false, message: "Staff employee not found" },
        { status: 400 },
      );
    const attendance = await Attendance.findOneAndUpdate(
      { employee: employee._id, date },
      {
        employee: employee._id,
        date,
        checkIn: body.checkIn || undefined,
        checkOut: body.checkOut || undefined,
        status: body.status,
        notes: body.notes,
        recordedBy: access.user._id,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    return NextResponse.json({ success: true, attendance }, { status: 201 });
  } catch (error) {
    if (error.name === "ValidationError")
      return NextResponse.json(
        {
          success: false,
          message: Object.values(error.errors)
            .map((item) => item.message)
            .join(", "),
        },
        { status: 400 },
      );
    return NextResponse.json(
      { success: false, message: "Unable to save attendance" },
      { status: 500 },
    );
  }
}
