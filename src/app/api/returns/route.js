import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Order from "@/lib/models/Order";
import Return from "@/lib/models/Return";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 25, 1),
    100,
  );
  const filter = isCustomer(user) ? { customer: user._id } : {};
  if (isCustomer(user))
    return NextResponse.json(
      await (async () => {
        const [returns, total] = await Promise.all([
          Return.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
          Return.countDocuments(filter),
        ]);
        return {
          success: true,
          returns,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      })(),
    );
  const access = await requirePermission(request, PERMISSIONS.RETURNS_READ);
  if (!access.ok) return access.response;
  const [returns, total] = await Promise.all([
    Return.find()
      .populate("customer", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Return.countDocuments(),
  ]);
  return NextResponse.json({
    success: true,
    returns,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  if (!isCustomer(user))
    return NextResponse.json(
      { success: false, message: "Customer account required" },
      { status: 403 },
    );
  try {
    const body = await request.json();
    if (
      !mongoose.isValidObjectId(body.orderId) ||
      !body.reason?.trim() ||
      !Array.isArray(body.items) ||
      !body.items.length
    )
      return NextResponse.json(
        {
          success: false,
          message: "Order, reason and return items are required",
        },
        { status: 400 },
      );
    await connectMongoDB();
    const order = await Order.findOne({
      _id: body.orderId,
      customerUser: user._id,
    }).lean();
    if (!order)
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    if (order.status !== "Delivered")
      return NextResponse.json(
        { success: false, message: "Only delivered orders can be returned" },
        { status: 400 },
      );
    const items = body.items.map((requested) => {
      const orderItem = order.items.find(
        (item) => item.product.toString() === String(requested.productId),
      );
      const quantity = Number(requested.quantity);
      if (
        !orderItem ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > orderItem.quantity
      )
        throw new Error("Invalid return quantity");
      return { product: orderItem.product, name: orderItem.name, quantity };
    });
    const returned = await Return.create({
      order: order._id,
      customer: user._id,
      items,
      reason: String(body.reason).trim(),
    });
    return NextResponse.json(
      { success: true, return: returned },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Unable to request return" },
      { status: 400 },
    );
  }
}
