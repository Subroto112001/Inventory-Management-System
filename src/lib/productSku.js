import { randomBytes } from "node:crypto";

const SKU_ATTEMPTS = 5;

export function normalizeSkuComponent(value, fallback = "PRD") {
  const normalized = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 12)
    .replace(/-+$/g, "");
  return normalized || fallback;
}

export function generateProductSku({ productName, categoryCode, brandCode } = {}) {
  const prefix = normalizeSkuComponent(categoryCode || brandCode || productName, "PRD");
  const suffix = randomBytes(6).toString("hex").toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function createProductWithUniqueSku(Product, productData, options = {}) {
  const attempts = options.attempts || SKU_ATTEMPTS;
  const suppliedSku = String(productData.productSKU || "").trim();
  const candidateFormat = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const productSKU = suppliedSku && attempt === 0
      ? suppliedSku.toUpperCase()
      : generateProductSku(options);
    if (!candidateFormat.test(productSKU) || productSKU.length > 40) {
      const error = new Error("SKU must contain only letters, numbers, and hyphens, and be no longer than 40 characters.");
      error.statusCode = 400;
      throw error;
    }

    try {
      return await Product.create({ ...productData, productSKU });
    } catch (error) {
      if (error?.code !== 11000 || (error.keyPattern && !error.keyPattern.productSKU)) throw error;
      // A supplied candidate can collide too; subsequent attempts use fresh server values.
    }
  }

  const error = new Error("Unable to generate a unique SKU. Please try creating the product again.");
  error.statusCode = 503;
  throw error;
}
