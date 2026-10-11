import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required.");

try {
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "ims" });
  const products = mongoose.connection.collection("products");
  const [total, missing, invalidFormat, duplicateGroups, indexes] = await Promise.all([
    products.countDocuments(),
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

  console.log(JSON.stringify({
    totalProducts: total,
    missingSkuCount: missing,
    invalidSkuFormatCount: invalidFormat,
    duplicateSkuGroups: duplicateGroups[0]?.groups || 0,
    skuIndexes: indexes
      .filter((index) => index.key?.productSKU)
      .map(({ name, key, unique, partialFilterExpression }) => ({
        name,
        key,
        unique: Boolean(unique),
        partialFilterExpression: partialFilterExpression || null,
      })),
  }, null, 2));
} finally {
  await mongoose.disconnect();
}
