import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Return, { RETURN_STATUSES } from "@/lib/models/Return";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import { increaseStock } from "@/lib/inventory/stockService";

const transitions = {
  Requested: ["Approved", "Rejected"],
  Approved: ["Received", "Rejected"],
  Received: ["Completed"],
  Rejected: [],
  Completed: [],
};

export async function PATCH(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.RETURNS_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  const { status } = await request.json();
  if (!mongoose.isValidObjectId(id) || !RETURN_STATUSES.includes(status))
    return NextResponse.json(
      { success: false, message: "Invalid return request" },
      { status: 400 },
    );
  await connectMongoDB();
  const session = await mongoose.startSession();
  let updated;
  try {
    await session.withTransaction(async () => {
      const returned = await Return.findById(id).session(session);
      if (!returned || !transitions[returned.status]?.includes(status))
        throw new Error("Invalid return status transition");
      if (status === "Completed") {
        for (const item of returned.items)
          await increaseStock({
            productId: item.product,
            delta: item.quantity,
            movementType: "RETURN",
            reason: `Completed return ${returned._id}`,
            referenceType: "RETURN",
            referenceId: returned._id,
            performedBy: access.user._id,
            session,
          });
        returned.restockedAt = new Date();
      }
      returned.status = status;
      returned.processedAt = new Date();
      returned.processedBy = access.user._id;
      await returned.save({ session });
      updated = returned;
    });
  } catch (error) {
    if (/transaction|replica set|mongos/i.test(error.message || ""))
      return NextResponse.json(
        {
          success: false,
          message: "Return processing requires MongoDB transaction support",
        },
        { status: 503 },
      );
    return NextResponse.json(
      { success: false, message: error.message || "Unable to process return" },
      { status: 400 },
    );
  } finally {
    await session.endSession();
  }
  return NextResponse.json({ success: true, return: updated });
}
