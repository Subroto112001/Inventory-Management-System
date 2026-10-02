import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import PurchaseOrder from "@/lib/models/PurchaseOrder";
import Supplier from "@/lib/models/Supplier";
import Product from "@/lib/models/Product";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import { calculateTax, getTaxSettings } from "@/lib/tax";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const access = await requirePermission(request, PERMISSIONS.PROCUREMENT_READ);
  if (!access.ok) return access.response;
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 25, 1),
      100,
    );
    await connectMongoDB();
    const [orders, total] = await Promise.all([
      PurchaseOrder.find()
        .populate("supplier", "name companyName phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PurchaseOrder.countDocuments(),
    ]);
    return NextResponse.json({
      success: true,
      purchaseOrders: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to fetch purchase orders" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const access = await requirePermission(
    request,
    PERMISSIONS.PROCUREMENT_MANAGE,
  );
  if (!access.ok) return access.response;
  try {
    const body = await request.json();
    if (
      !mongoose.isValidObjectId(body.supplierId) ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Supplier and at least one item are required",
        },
        { status: 400 },
      );
    }
    await connectMongoDB();
    const supplier = await Supplier.findOne({
      _id: body.supplierId,
      status: "Active",
    });
    if (!supplier)
      return NextResponse.json(
        { success: false, message: "Active supplier not found" },
        { status: 400 },
      );
    const productIds = body.items.map((item) => item.productId);
    if (productIds.some((id) => !mongoose.isValidObjectId(id)))
      return NextResponse.json(
        { success: false, message: "Invalid product reference" },
        { status: 400 },
      );
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );
    const items = body.items.map((item) => {
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity);
      const unitCost = Number(item.unitCost);
      if (
        !product ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(unitCost) ||
        unitCost < 0
      )
        throw new Error("Invalid purchase item");
      return {
        product: product._id,
        productName: product.productName,
        sku: product.productSKU,
        quantity,
        unitCost,
        receivedQuantity: 0,
      };
    });
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );
    const discount = Math.max(0, Number(body.discount) || 0);
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxSettings = await getTaxSettings();
    const { tax, taxRate } = calculateTax(taxableAmount, taxSettings);
    const purchaseOrder = await PurchaseOrder.create({
      supplier: supplier._id,
      items,
      subtotal,
      discount,
      tax,
      taxRate,
      total: taxableAmount + tax,
      expectedDate: body.expectedDate,
      notes: body.notes,
      createdBy: access.user._id,
    });
    return NextResponse.json({ success: true, purchaseOrder }, { status: 201 });
  } catch (error) {
    const status = /invalid purchase item/i.test(error.message) ? 400 : 500;
    return NextResponse.json(
      {
        success: false,
        message:
          status === 400 ? error.message : "Unable to create purchase order",
      },
      { status },
    );
  }
}
