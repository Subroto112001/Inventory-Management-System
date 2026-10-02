import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import PurchaseOrder from "@/lib/models/PurchaseOrder";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import { increaseStock } from "@/lib/inventory/stockService";

export async function POST(request, { params }) {
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
  const body = await request.json();
  if (!Array.isArray(body.items) || body.items.length === 0)
    return NextResponse.json(
      { success: false, message: "Receiving items are required" },
      { status: 400 },
    );
  await connectMongoDB();
  const session = await mongoose.startSession();
  let updatedOrder;
  try {
    await session.withTransaction(async () => {
      const order = await PurchaseOrder.findById(id).session(session);
      if (!order || !["Approved", "Partially Received"].includes(order.status))
        throw new Error("Purchase order is not receivable");
      for (const received of body.items) {
        if (
          !mongoose.isValidObjectId(received.productId) ||
          !Number.isInteger(Number(received.quantity)) ||
          Number(received.quantity) < 1
        )
          throw new Error("Invalid receiving quantity");
        const item = order.items.find(
          (line) => line.product.toString() === received.productId,
        );
        if (!item)
          throw new Error("Product is not part of this purchase order");
        const quantity = Number(received.quantity);
        if (item.receivedQuantity + quantity > item.quantity)
          throw new Error("Received quantity exceeds ordered quantity");
        await increaseStock({
          productId: item.product,
          delta: quantity,
          movementType: "PURCHASE",
          reason: `Receiving ${order.purchaseOrderNumber}`,
          referenceType: "PURCHASE_ORDER",
          referenceId: order._id,
          performedBy: access.user._id,
          session,
        });
        item.receivedQuantity += quantity;
      }
      const fullyReceived = order.items.every(
        (item) => item.receivedQuantity === item.quantity,
      );
      const anyReceived = order.items.some((item) => item.receivedQuantity > 0);
      order.status = fullyReceived
        ? "Received"
        : anyReceived
          ? "Partially Received"
          : order.status;
      await order.save({ session });
      updatedOrder = order;
    });
  } catch (error) {
    if (/transaction|replica set|mongos/i.test(error.message || ""))
      return NextResponse.json(
        {
          success: false,
          message: "Receiving requires MongoDB transaction support",
        },
        { status: 503 },
      );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to receive purchase order",
      },
      { status: 400 },
    );
  } finally {
    await session.endSession();
  }
  return NextResponse.json({ success: true, purchaseOrder: updatedOrder });
}
