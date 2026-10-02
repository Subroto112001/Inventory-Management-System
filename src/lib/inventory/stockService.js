import mongoose from "mongoose";
import Product from "@/lib/models/Product";
import StockMovement, {
  STOCK_MOVEMENT_TYPES,
} from "@/lib/models/StockMovement";
import { recordAuditLog } from "@/lib/auditLog";

const INBOUND_TYPES = new Set([
  "INITIAL_STOCK",
  "PURCHASE",
  "RETURN",
  "TRANSFER_IN",
  "RESTOCK",
]);
const OUTBOUND_TYPES = new Set(["SALE", "TRANSFER_OUT", "DAMAGE"]);

function assertObjectId(value, fieldName) {
  if (!value || !mongoose.isValidObjectId(value)) {
    throw new Error(`Invalid ${fieldName}`);
  }
}

function normalizeDelta(delta) {
  const value = Number(delta);
  if (!Number.isInteger(value) || value === 0) {
    throw new Error("Stock adjustment must be a non-zero whole number");
  }
  return value;
}

function directionFor(movementType, delta) {
  if (!STOCK_MOVEMENT_TYPES.includes(movementType)) {
    throw new Error("Invalid stock movement type");
  }
  if (
    INBOUND_TYPES.has(movementType) &&
    delta < 0 &&
    movementType !== "ADJUSTMENT"
  ) {
    throw new Error(`${movementType} movements must increase stock`);
  }
  if (OUTBOUND_TYPES.has(movementType) && delta > 0) {
    throw new Error(`${movementType} movements must decrease stock`);
  }
  return delta > 0 ? "IN" : "OUT";
}

function normalizeOptionalText(value, fieldName, maxLength) {
  if (value === undefined || value === null || value === "") return undefined;
  const normalized = String(value).trim();
  if (!normalized || normalized.length > maxLength) {
    throw new Error(`${fieldName} is invalid`);
  }
  return normalized;
}

export async function changeStock({
  productId,
  delta,
  movementType,
  reason,
  referenceType,
  referenceId,
  warehouseId,
  performedBy,
  session,
}) {
  assertObjectId(productId, "product id");
  assertObjectId(performedBy, "performer");
  if (warehouseId) assertObjectId(warehouseId, "warehouse id");
  if (referenceId) assertObjectId(referenceId, "reference id");

  const normalizedDelta = normalizeDelta(delta);
  const direction = directionFor(movementType, normalizedDelta);
  const normalizedReason = normalizeOptionalText(reason, "Reason", 500);
  const normalizedReferenceType = normalizeOptionalText(
    referenceType,
    "Reference type",
    50,
  );
  const filter = { _id: productId };
  if (normalizedDelta < 0) {
    filter.currentStock = { $gte: Math.abs(normalizedDelta) };
  }

  const updatedProduct = await Product.findOneAndUpdate(
    filter,
    { $inc: { currentStock: normalizedDelta } },
    { new: true, session },
  ).lean();

  if (!updatedProduct) {
    const exists = await Product.exists({ _id: productId }).session(
      session || null,
    );
    throw new Error(exists ? "Insufficient stock" : "Product not found");
  }

  const quantityAfter = updatedProduct.currentStock;
  const quantityBefore = quantityAfter - normalizedDelta;
  const movement = await StockMovement.create(
    [
      {
        product: updatedProduct._id,
        movementType,
        quantity: Math.abs(normalizedDelta),
        direction,
        quantityBefore,
        quantityAfter,
        reason: normalizedReason,
        referenceType: normalizedReferenceType,
        referenceId,
        warehouse: warehouseId,
        performedBy,
      },
    ],
    { session },
  );
  await recordAuditLog({
    actor: performedBy,
    action: `STOCK_${movementType}`,
    resource: "Product",
    resourceId: updatedProduct._id,
    metadata: {
      quantity: Math.abs(normalizedDelta),
      quantityBefore,
      quantityAfter,
    },
    session,
  });

  return { product: updatedProduct, movement: movement[0] };
}

export function increaseStock(options) {
  return changeStock({ ...options, delta: Math.abs(Number(options.delta)) });
}

export function decreaseStock(options) {
  return changeStock({ ...options, delta: -Math.abs(Number(options.delta)) });
}

export function adjustStock(options) {
  return changeStock(options);
}
