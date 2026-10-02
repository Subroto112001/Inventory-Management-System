import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import StockMovement from "@/lib/models/StockMovement";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const access = await requirePermission(request, PERMISSIONS.INVENTORY_READ);
  if (!access.ok) return access.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 25, 1),
      100,
    );
    const filter = {};
    const product = searchParams.get("product");
    const movementType = searchParams.get("movementType");
    const warehouse = searchParams.get("warehouse");
    const performedBy = searchParams.get("performedBy");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (product) {
      if (!mongoose.isValidObjectId(product))
        return NextResponse.json(
          { success: false, message: "Invalid product id" },
          { status: 400 },
        );
      filter.product = product;
    }
    if (movementType) {
      if (!StockMovement.schema.path("movementType").enumValues.includes(movementType)) {
        return NextResponse.json(
          { success: false, message: "Invalid movement type" },
          { status: 400 },
        );
      }
      filter.movementType = movementType;
    }
    if (warehouse) {
      if (!mongoose.isValidObjectId(warehouse))
        return NextResponse.json(
          { success: false, message: "Invalid warehouse id" },
          { status: 400 },
        );
      filter.warehouse = warehouse;
    }
    if (performedBy) {
      if (!mongoose.isValidObjectId(performedBy))
        return NextResponse.json(
          { success: false, message: "Invalid performer id" },
          { status: 400 },
        );
      filter.performedBy = performedBy;
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (Number.isNaN(fromDate.getTime())) {
          return NextResponse.json(
            { success: false, message: "Invalid start date" },
            { status: 400 },
          );
        }
        filter.createdAt.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        if (Number.isNaN(toDate.getTime())) {
          return NextResponse.json(
            { success: false, message: "Invalid end date" },
            { status: 400 },
          );
        }
        filter.createdAt.$lte = toDate;
      }
    }

    await connectMongoDB();
    const [movements, total] = await Promise.all([
      StockMovement.find(filter)
        .populate("product", "productName productSKU")
        .populate("performedBy", "firstName lastName email")
        .populate("warehouse", "name warehouseCode")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      StockMovement.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      movements,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Fetch inventory movements error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch inventory history" },
      { status: 500 },
    );
  }
}
