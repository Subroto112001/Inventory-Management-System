import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import Offer from "@/lib/models/Offer";
import Order from "@/lib/models/Order";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import { calculateTax, getTaxSettings } from "@/lib/tax";
import { calculatePayableTotal, calculateShipping, roundMoney } from "@/lib/checkoutCalculations";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  if (!isCustomer(user))
    return NextResponse.json({ message: "Customer account required" }, { status: 403 });

  try {
    const body = await request.json();
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50)
      return NextResponse.json({ message: "Cart is empty or invalid" }, { status: 400 });

    const quantities = new Map();
    for (const item of body.items) {
      const id = item.id || item.productId;
      if (!mongoose.isValidObjectId(id))
        return NextResponse.json({ message: "Invalid product id" }, { status: 400 });
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1)
        return NextResponse.json({ message: "Quantity must be a positive whole number" }, { status: 400 });
      quantities.set(String(id), (quantities.get(String(id)) || 0) + quantity);
    }

    await connectMongoDB();
    const rows = await Product.find({ _id: { $in: [...quantities.keys()] }, isActive: true })
      .populate("category", "categoryName")
      .lean();
    const byId = new Map(rows.map((product) => [product._id.toString(), product]));
    const lines = [];
    let subtotal = 0;

    for (const [id, quantity] of quantities) {
      const product = byId.get(id);
      if (!product)
        return NextResponse.json({ message: "A product is unavailable" }, { status: 409 });
      if (quantity > 10)
        return NextResponse.json({ message: "Quantity must be from 1 to 10 per product" }, { status: 400 });
      if (Number(product.currentStock || 0) < quantity)
        return NextResponse.json({ message: `${product.productName} has insufficient stock` }, { status: 409 });
      const paymentOption = product.paymentOption || "COD_ONLY";
      if (paymentOption === "ONLINE_ONLY")
        return NextResponse.json({ message: `${product.productName} only allows Online Payment, which is not available yet. Remove it or contact the store.` }, { status: 409 });

      const unitPrice = Math.max(0, Number(product.price) * (1 - Number(product.discount || 0) / 100));
      subtotal += unitPrice * quantity;
      lines.push({
        id,
        product,
        unitPrice,
        quantity,
        name: product.productName,
        sku: product.productSKU,
        category: product.category?.categoryName || "",
        image: product.image?.url || product.images?.[0]?.url || "",
        stock: product.currentStock,
        discount: Number(product.discount || 0),
        paymentOption,
      });
    }

    let discount = 0;
    let offer = null;
    const coupon = String(body.couponCode || "").trim().toUpperCase();
    if (coupon) {
      offer = await Offer.findOne({ offerCode: coupon }).lean();
      const now = new Date();
      if (!offer || !offer.isActive || now < offer.startDate || now > offer.endDate ||
          (offer.usageLimit && offer.usageCount >= offer.usageLimit) || subtotal < (offer.minPurchase || 0))
        return NextResponse.json({ message: "This coupon is invalid or unavailable" }, { status: 400 });
      if (offer.applyTo === "Specific Products" && lines.some((line) => !offer.products.some((id) => id.toString() === line.id)))
        return NextResponse.json({ message: "This coupon does not apply to every cart item" }, { status: 400 });
      if (offer.perCustomerLimit && await Order.countDocuments({ customerUser: user._id, "financials.promotionCode": coupon }) >= offer.perCustomerLimit)
        return NextResponse.json({ message: "This coupon has reached its usage limit" }, { status: 400 });
      discount = Math.min(
        offer.discountType === "Percentage" ? subtotal * offer.discountValue / 100 : offer.discountValue,
        offer.maxDiscountAmount || Number.MAX_SAFE_INTEGER,
        subtotal,
      );
    }

    const taxSettings = await getTaxSettings();
    const tax = calculateTax(Math.max(0, subtotal - discount), taxSettings);
    const shipping = calculateShipping(lines.map(({ product, quantity, unitPrice }) => ({ product, quantity, unitPrice })));
    const totals = calculatePayableTotal({ subtotal, discount, tax: tax.tax, shipping, taxInclusive: taxSettings.inclusive });

    return NextResponse.json({
      success: true,
      items: lines.map(({ product, ...line }) => ({ ...line, product: undefined, price: roundMoney(line.unitPrice) })),
      ...totals,
      taxName: tax.taxName || taxSettings.name || "Tax",
      couponCode: offer?.offerCode || "",
      paymentMethods: ["Cash"],
    });
  } catch (error) {
    console.error("Checkout quote error", error);
    return NextResponse.json({ message: "Unable to calculate checkout totals" }, { status: 500 });
  }
}
