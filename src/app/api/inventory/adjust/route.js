import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import { adjustStock } from "@/lib/inventory/stockService";
import { STOCK_MOVEMENT_TYPES } from "@/lib/models/StockMovement";

const MANUAL_MOVEMENT_TYPES = new Set([
  "ADJUSTMENT",
  "DAMAGE",
  "RETURN",
  "RESTOCK",
  "PURCHASE",
]);

export async function POST(request) {
  const access = await requirePermission(request, PERMISSIONS.INVENTORY_ADJUST);
  if (!access.ok) return access.response;

  try {
    const body = await request.json();
    const {
      productId,
      adjustmentQuantity,
      movementType = "ADJUSTMENT",
      reason,
      warehouseId,
    } = body;

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product id" },
        { status: 400 },
      );
    }
    if (
      !MANUAL_MOVEMENT_TYPES.has(movementType) ||
      !STOCK_MOVEMENT_TYPES.includes(movementType)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid manual movement type" },
        { status: 400 },
      );
    }
    if (!reason?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "A reason is required for stock adjustments",
        },
        { status: 400 },
      );
    }
    if (warehouseId && !mongoose.isValidObjectId(warehouseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid warehouse id" },
        { status: 400 },
      );
    }

    const result = await adjustStock({
      productId,
      delta: adjustmentQuantity,
      movementType,
      reason,
      warehouseId,
      performedBy: access.user._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Stock updated successfully",
        product: {
          id: result.product._id.toString(),
          currentStock: result.product.currentStock,
        },
        movement: result.movement,
      },
      { status: 200 },
    );
  } catch (error) {
    const status = /not found/i.test(error.message)
      ? 404
      : /insufficient stock/i.test(error.message)
        ? 409
        : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Unable to update stock" },
      { status },
    );
  }
}
