import { createWithGeneratedCode } from "@/lib/entityCodeServer";

export async function createProductWithUniqueSku(Product, productData, options = {}) {
  const productName = options.productName || productData.productName;
  return createWithGeneratedCode({
    entity: "product",
    Model: Product,
    name: productName,
    data: productData,
    attempts: options.attempts || 8,
  });
}
