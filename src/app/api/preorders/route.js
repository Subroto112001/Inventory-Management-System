import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import { calculateTax, getTaxSettings } from "@/lib/tax";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  if (!isCustomer(user)) return NextResponse.json({ success: false, message: "Customer account required." }, { status: 403 });
  let requestKey = "";
  try {
    const body = await request.json();
    const { productId, quantity, idempotencyKey } = body;
    requestKey = String(idempotencyKey || "");
    if (!mongoose.isValidObjectId(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10 || (body.addressId && !mongoose.isValidObjectId(body.addressId)) || !/^[\w-]{8,100}$/.test(String(idempotencyKey || ""))) return NextResponse.json({ success: false, message: "Product, quantity, and idempotency key are required." }, { status: 400 });
    await connectMongoDB();
    const existing = await Order.findOne({ idempotencyKey, customerUser: user._id });
    if (existing) return NextResponse.json({ success: true, order: existing, duplicate: true });
    const address = (body.addressId ? user.addresses.id(body.addressId) : null) || user.addresses?.[0];
    if (!address) return NextResponse.json({ success: false, message: "Select one of your saved delivery addresses." }, { status: 400 });
    const now = new Date();
    const product = await Product.findOne({
      _id: productId, isActive: true, lifecycle: "scheduled", launchAt: { $gt: now }, "preorder.enabled": true,
      $and: [
        { $or: [{ "preorder.startsAt": null }, { "preorder.startsAt": { $exists: false } }, { "preorder.startsAt": { $lte: now } }] },
        { $or: [{ "preorder.endsAt": null }, { "preorder.endsAt": { $exists: false } }, { "preorder.endsAt": { $gte: now } }] },
      ],
    }).lean();
    if (!product) return NextResponse.json({ success: false, message: "Pre-orders are not available for this product." }, { status: 409 });
    if (product.preorder.limit != null && product.preorder.reserved + quantity > product.preorder.limit) return NextResponse.json({ success: false, message: "The available pre-order quantity is insufficient." }, { status: 409 });
    const unitPrice = Math.max(0, Number(product.price) * (1 - Number(product.discount || 0) / 100));
    const subtotal = unitPrice * quantity;
    const taxSettings = await getTaxSettings();
    const tax = calculateTax(subtotal, taxSettings);
    const deliveryCharge = product.shipping?.freeShipping ? 0 : Number(product.shipping?.charge || 0) * quantity;
    const grandTotal = subtotal + (taxSettings.inclusive ? 0 : tax.tax) + deliveryCharge;
    const order = {
      orderNumber: `PRE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      customer: { name: address.fullName, phone: address.phone, address: [address.address, address.area, address.city, address.postalCode, address.country].filter(Boolean).join(", ") },
      shippingAddress: address.toObject ? address.toObject() : address,
      items: [{ product: product._id, name: product.productName, sku: product.productSKU, quantity, price: unitPrice }],
      orderType: "Home Delivery", status: "Pending", orderClass: "preorder", preorderStatus: "Pending confirmation", preorderProduct: product._id, preorderExpectedShipAt: product.preorder.expectedShipAt || null,
      idempotencyKey, customerUser: user._id,
      financials: { subtotal, discount: 0, tax: tax.tax, taxRate: tax.taxRate, taxName: tax.taxName || taxSettings.name, deliveryCharge, grandTotal },
      payment: { method: "Cash", deliveryPaymentType: "COD", paymentStatus: "Pending" },
    };
    const session = await mongoose.startSession();
    let created;
    try {
      await session.withTransaction(async () => {
        const reservation = await Product.updateOne({
          _id: product._id, lifecycle: "scheduled", launchAt: { $gt: now }, isActive: true, "preorder.enabled": true,
          $and: [
            { $or: [{ "preorder.startsAt": null }, { "preorder.startsAt": { $exists: false } }, { "preorder.startsAt": { $lte: now } }] },
            { $or: [{ "preorder.endsAt": null }, { "preorder.endsAt": { $exists: false } }, { "preorder.endsAt": { $gte: now } }] },
            { $or: [{ "preorder.limit": null }, { "preorder.limit": { $exists: false } }, { $expr: { $lte: [{ $add: ["$preorder.reserved", quantity] }, "$preorder.limit"] } }] },
          ],
        }, { $inc: { "preorder.reserved": quantity } }, { session });
        if (!reservation.modifiedCount) throw new Error("PREORDER_UNAVAILABLE");
        [created] = await Order.create([order], { session });
      });
    } finally { await session.endSession(); }
    return NextResponse.json({ success: true, message: "Pre-order placed. Payment is pending until fulfillment.", order: { id: created._id, orderNumber: created.orderNumber, grandTotal } }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      const prior = await Order.findOne({ idempotencyKey: requestKey, customerUser: user._id });
      if (prior) return NextResponse.json({ success: true, order: prior, duplicate: true });
    }
    if (error.message === "PREORDER_UNAVAILABLE") return NextResponse.json({ success: false, message: "Pre-order availability changed. Please refresh and try again." }, { status: 409 });
    if (/transaction|replica set|mongos/i.test(error.message || "")) return NextResponse.json({ success: false, message: "Pre-order creation requires MongoDB transaction support." }, { status: 503 });
    console.error("Pre-order creation failed", error);
    return NextResponse.json({ success: false, message: "Unable to place pre-order." }, { status: 500 });
  }
}
