import mongoose from "mongoose";

const NUMERIC_FIELDS = [
  "discountValue",
  "maxDiscountAmount",
  "minPurchase",
  "usageLimit",
  "perCustomerLimit",
];

const DATE_FIELDS = ["startDate", "endDate"];

export function normalizeOfferInput(input = {}) {
  const normalized = { ...input };

  if ("productIds" in normalized) {
    normalized.products = Array.isArray(normalized.productIds)
      ? normalized.productIds
      : [];
    delete normalized.productIds;
  }

  for (const field of NUMERIC_FIELDS) {
    if (normalized[field] === "" || normalized[field] === null) {
      delete normalized[field];
    } else if (normalized[field] !== undefined) {
      normalized[field] = Number(normalized[field]);
    }
  }

  for (const field of DATE_FIELDS) {
    if (normalized[field] === "" || normalized[field] === null) {
      delete normalized[field];
    } else if (normalized[field] !== undefined) {
      const date = new Date(normalized[field]);
      if (Number.isNaN(date.getTime())) {
        delete normalized[field];
        continue;
      }

      if (field === "startDate") {
        date.setHours(0, 0, 0, 0);
      } else {
        date.setHours(23, 59, 59, 999);
      }
      normalized[field] = date;
    }
  }

  return normalized;
}

export function serializeOffer(offer) {
  const serialized = offer?.toObject
    ? offer.toObject({ virtuals: true })
    : { ...offer };
  const id = serialized._id?.toString?.() ?? serialized._id ?? serialized.id;
  const products = Array.isArray(serialized.products)
    ? serialized.products
    : [];

  return {
    ...serialized,
    id,
    _id: id,
    products: products.map((productId) => productId?.toString?.() ?? productId),
    productIds: products.map(
      (productId) => productId?.toString?.() ?? productId,
    ),
    createdBy: serialized.createdBy?.toString?.() ?? serialized.createdBy,
  };
}

export function isValidObjectId(value) {
  return mongoose.isValidObjectId(value);
}
