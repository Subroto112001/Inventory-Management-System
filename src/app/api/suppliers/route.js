import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Supplier from "@/lib/models/Supplier";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

export const dynamic = "force-dynamic";

function validate(body) {
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  if (!name || !phone) return "Supplier name and phone are required";
  if (body.email && !/^\S+@\S+\.\S+$/.test(String(body.email)))
    return "Invalid supplier email";
  return null;
}

export async function GET(request) {
  const access = await requirePermission(request, PERMISSIONS.SUPPLIERS_READ);
  if (!access.ok) return access.response;
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 25, 1),
      100,
    );
    await connectMongoDB();
    const filter = {};
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    const [suppliers, total] = await Promise.all([
      Supplier.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Supplier.countDocuments(filter),
    ]);
    return NextResponse.json({
      success: true,
      suppliers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to fetch suppliers" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const access = await requirePermission(request, PERMISSIONS.SUPPLIERS_CREATE);
  if (!access.ok) return access.response;
  try {
    const body = await request.json();
    const validationError = validate(body);
    if (validationError)
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 },
      );
    await connectMongoDB();
    const supplier = await Supplier.create({
      ...body,
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      createdBy: access.user._id,
    });
    return NextResponse.json({ success: true, supplier }, { status: 201 });
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
      { success: false, message: "Unable to create supplier" },
      { status: 500 },
    );
  }
}
