import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Supplier from "@/lib/models/Supplier";
import PurchaseOrder from "@/lib/models/PurchaseOrder";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

export async function GET(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.SUPPLIERS_READ);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invalid supplier id" },
      { status: 400 },
    );
  await connectMongoDB();
  const supplier = await Supplier.findById(id).lean();
  if (!supplier)
    return NextResponse.json(
      { success: false, message: "Supplier not found" },
      { status: 404 },
    );
  return NextResponse.json({ success: true, supplier });
}

export async function PATCH(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.SUPPLIERS_UPDATE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invalid supplier id" },
      { status: 400 },
    );
  const body = await request.json();
  if (body.name !== undefined || body.phone !== undefined) {
    const error =
      !String(body.name || "").trim() || !String(body.phone || "").trim()
        ? "Supplier name and phone are required"
        : null;
    if (error)
      return NextResponse.json(
        { success: false, message: error },
        { status: 400 },
      );
  }
  await connectMongoDB();
  const allowedFields = [
    "name",
    "companyName",
    "email",
    "phone",
    "address",
    "city",
    "country",
    "contactPerson",
    "status",
    "notes",
  ];
  const update = Object.fromEntries(
    allowedFields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );
  const supplier = await Supplier.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();
  if (!supplier)
    return NextResponse.json(
      { success: false, message: "Supplier not found" },
      { status: 404 },
    );
  return NextResponse.json({ success: true, supplier });
}

export async function DELETE(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.SUPPLIERS_UPDATE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invalid supplier id" },
      { status: 400 },
    );
  await connectMongoDB();
  if (await PurchaseOrder.exists({ supplier: id }))
    return NextResponse.json(
      {
        success: false,
        message:
          "Supplier is referenced by purchase history; deactivate it instead",
      },
      { status: 409 },
    );
  const supplier = await Supplier.findByIdAndDelete(id);
  if (!supplier)
    return NextResponse.json(
      { success: false, message: "Supplier not found" },
      { status: 404 },
    );
  return NextResponse.json({ success: true, message: "Supplier deleted" });
}
