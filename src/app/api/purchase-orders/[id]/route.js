import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import PurchaseOrder, {
  PURCHASE_ORDER_STATUSES,
} from "@/lib/models/PurchaseOrder";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

const transitions = {
  Draft: ["Submitted", "Cancelled"],
  Submitted: ["Approved", "Cancelled"],
  Approved: ["Cancelled"],
  "Partially Received": [],
  Received: [],
  Cancelled: [],
};

export async function GET(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.PROCUREMENT_READ);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invalid purchase order id" },
      { status: 400 },
    );
  await connectMongoDB();
  const purchaseOrder = await PurchaseOrder.findById(id)
    .populate("supplier", "name companyName phone email")
    .lean();
  if (!purchaseOrder)
    return NextResponse.json(
      { success: false, message: "Purchase order not found" },
      { status: 404 },
    );
  return NextResponse.json({ success: true, purchaseOrder });
}

export async function PATCH(request, { params }) {
  const access = await requirePermission(
    request,
    PERMISSIONS.PROCUREMENT_MANAGE,
  );
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invalid purchase order id" },
      { status: 400 },
    );
  const { status } = await request.json();
  if (!PURCHASE_ORDER_STATUSES.includes(status))
    return NextResponse.json(
      { success: false, message: "Invalid purchase order status" },
      { status: 400 },
    );
  await connectMongoDB();
  const existing = await PurchaseOrder.findById(id).lean();
  if (!existing)
    return NextResponse.json(
      { success: false, message: "Purchase order not found" },
      { status: 404 },
    );
  if (!transitions[existing.status]?.includes(status))
    return NextResponse.json(
      { success: false, message: "Invalid purchase order status transition" },
      { status: 400 },
    );
  const update = { status };
  if (status === "Approved") update.approvedBy = access.user._id;
  const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, update, {
    new: true,
  });
  return NextResponse.json({ success: true, purchaseOrder });
}
