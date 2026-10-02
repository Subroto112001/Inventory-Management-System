import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Order, { ORDER_STATUS_TRANSITIONS } from "@/lib/models/Order";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/authorization";
import { increaseStock } from "@/lib/inventory/stockService";

export const dynamic = "force-dynamic";

function denied(status, message) {
  return NextResponse.json({ success: false, message }, { status });
}

async function loadAccess(request, id) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: denied(401, "Authentication required") };
  if (!mongoose.isValidObjectId(id))
    return { response: denied(404, "Order not found") };
  const order = await Order.findOne({
    _id: id,
    ...(isCustomer(user) ? { customerUser: user._id } : {}),
  }).lean();
  if (!order) return { response: denied(404, "Order not found") };
  return { user, order };
}

export async function GET(request, { params }) {
  const { id } = await params;
  const access = await loadAccess(request, id);
  if (access.response) return access.response;
  if (
    !isCustomer(access.user) &&
    !hasPermission(access.user, PERMISSIONS.ORDERS_READ)
  )
    return denied(403, "You do not have permission to view orders");
  return NextResponse.json({ success: true, order: access.order });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const access = await loadAccess(request, id);
  if (access.response) return access.response;

  const body = await request.json();
  const requestedStatus = String(body.status || "").trim();
  const isCancellation = requestedStatus === "Cancelled";
  if (
    !requestedStatus ||
    !ORDER_STATUS_TRANSITIONS[access.order.status]?.includes(requestedStatus)
  ) {
    return denied(400, "Invalid order status transition");
  }
  if (
    !isCustomer(access.user) &&
    !hasPermission(access.user, PERMISSIONS.ORDERS_UPDATE)
  ) {
    return denied(403, "You do not have permission to update orders");
  }
  if (isCustomer(access.user) && !isCancellation)
    return denied(
      403,
      "Customers may only cancel their own cancellable orders",
    );

  await connectMongoDB();
  const session = await mongoose.startSession();
  let updatedOrder;
  try {
    await session.withTransaction(async () => {
      const updated = await Order.findOneAndUpdate(
        { _id: id, status: access.order.status },
        { $set: { status: requestedStatus } },
        { new: true, session },
      );
      if (!updated) throw new Error("Order changed before it could be updated");
      updatedOrder = updated;
      if (isCancellation) {
        for (const item of access.order.items) {
          await increaseStock({
            productId: item.product,
            delta: item.quantity,
            movementType: "RETURN",
            reason: `Cancelled order ${access.order.orderNumber}`,
            referenceType: "ORDER",
            referenceId: access.order._id,
            performedBy: access.user._id,
            session,
          });
        }
      }
    });
  } catch (error) {
    if (/transaction|replica set|mongos/i.test(error.message || ""))
      return denied(503, "Order updates require MongoDB transaction support");
    if (/insufficient stock/i.test(error.message || ""))
      return denied(409, "Unable to restore order stock");
    return denied(409, "Order could not be updated");
  } finally {
    await session.endSession();
  }
  return NextResponse.json({
    success: true,
    message: "Order updated successfully",
    order: updatedOrder,
  });
}
