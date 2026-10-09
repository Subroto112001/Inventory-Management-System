import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Order from "@/lib/models/Order";
import Return from "@/lib/models/Return";
import Product from "@/lib/models/Product";
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
    const requestedQuantities = new Map();
    for (const requested of body.items) {
      if (!mongoose.isValidObjectId(requested.productId)) throw new Error("Invalid return product");
      const quantity = Number(requested.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Invalid return quantity");
      const key = String(requested.productId);
      requestedQuantities.set(key, (requestedQuantities.get(key) || 0) + quantity);
    }
    const products = await Product.find({ _id: { $in: [...requestedQuantities.keys()] } }).select("returnPolicy").lean();
    const policyById = new Map(products.map((product) => [product._id.toString(), product.returnPolicy || null]));
    const deliveredAt = order.deliveredAt || order.updatedAt;
    const items = [...requestedQuantities.entries()].map(([productId, quantity]) => {
      const orderItem = order.items.find((item) => item.product.toString() === productId);
      if (!orderItem || quantity > orderItem.quantity) throw new Error("Invalid return quantity");
      const policy = policyById.get(productId);
      if (policy?.eligible === false) throw new Error(`${orderItem.name} is not eligible for return`);
      if (policy?.eligible === true && Number.isInteger(policy.windowDays) && policy.windowDays > 0 && Date.now() > new Date(deliveredAt).getTime() + policy.windowDays * 24 * 60 * 60 * 1000) throw new Error(`${orderItem.name} is outside its ${policy.windowDays}-day return window`);
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
    const message = error.message || "";
    const isValidationError =
      message === "Invalid return product" ||
      message === "Invalid return quantity" ||
      message.includes("is not eligible for return") ||
      message.includes("is outside its ");
    return NextResponse.json(
      {
        success: false,
        message: isValidationError ? message : "Unable to request return",
      },
      { status: isValidationError ? 400 : 500 },
    );
  }
}
