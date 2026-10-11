import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required.");

const skuIndexName = "productSKU_unique_string";
const legacyIndexName = "productSKU_1";

try {
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "ims" });
  const products = mongoose.connection.collection("products");
  const [missing, invalidFormat, duplicateGroups, indexes] = await Promise.all([
    products.countDocuments({
      $or: [
        { productSKU: { $exists: false } },
        { productSKU: null },
        { productSKU: "" },
      ],
    }),
    products.countDocuments({
      productSKU: { $type: "string", $not: /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/ },
    }),
    products.aggregate([
      { $match: { productSKU: { $type: "string" } } },
      { $group: { _id: { $toUpper: "$productSKU" }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: "groups" },
    ]).toArray(),
    products.indexes(),
  ]);
  const duplicates = duplicateGroups[0]?.groups || 0;

  if (missing || invalidFormat || duplicates) {
    throw new Error(
      `SKU index migration stopped safely: ${missing} records need an SKU, ${invalidFormat} SKUs have invalid formatting, and ${duplicates} duplicate SKU groups need review. No product data was changed.`,
    );
  }

  const skuIndex = indexes.find((index) => index.name === skuIndexName);
  if (skuIndex) {
    const isExpected = skuIndex.unique === true
      && skuIndex.partialFilterExpression?.productSKU?.$type === "string";
    if (!isExpected) throw new Error(`${skuIndexName} exists with unexpected options.`);
  } else {
    await products.createIndex(
      { productSKU: 1 },
      {
        name: skuIndexName,
        unique: true,
        partialFilterExpression: { productSKU: { $type: "string" } },
      },
    );
  }

  const legacyIndex = indexes.find((index) => index.name === legacyIndexName);
  if (legacyIndex) {
    if (legacyIndex.unique !== true || legacyIndex.key?.productSKU !== 1) {
      throw new Error(`${legacyIndexName} exists with unexpected options; it was left unchanged.`);
    }
    await products.dropIndex(legacyIndexName);
  }

  console.log(`SKU index ready: ${skuIndexName}. Product records were preserved.`);
} finally {
  await mongoose.disconnect();
}
