import "dotenv/config";
import mongoose from "mongoose";
import Brand from "../src/lib/models/Brand.js";
import Category from "../src/lib/models/Category.js";
import Product from "../src/lib/models/Product.js";
import Subcategory from "../src/lib/models/Subcategory.js";
import { allocateEntityCode } from "../src/lib/entityCodeServer.js";

const entities = [
  { entity: "brand", Model: Brand, nameField: "brandName", codeField: "brandCode" },
  { entity: "category", Model: Category, nameField: "categoryName", codeField: "categoryCode" },
  { entity: "subcategory", Model: Subcategory, nameField: "subcategoryName", codeField: "subcategoryCode" },
  { entity: "product", Model: Product, nameField: "productName", codeField: "productSKU" },
];

async function backfill({ entity, Model, nameField, codeField }) {
  const missing = await Model.find({ $or: [
    { [codeField]: { $exists: false } },
    { [codeField]: null },
    { [codeField]: "" },
  ] }).select(`_id ${nameField}`).lean();

  for (const record of missing) {
    let assigned = false;
    for (let attempt = 0; attempt < 8 && !assigned; attempt += 1) {
      const code = await allocateEntityCode(entity, record[nameField], Model);
      try {
        const result = await Model.collection.updateOne(
          { _id: record._id, $or: [
            { [codeField]: { $exists: false } },
            { [codeField]: null },
            { [codeField]: "" },
          ] },
          { $set: { [codeField]: code } },
        );
        assigned = result.modifiedCount === 1 || result.matchedCount === 0;
      } catch (error) {
        if (error?.code !== 11000) throw error;
      }
    }
    if (!assigned) throw new Error(`Could not backfill ${entity} ${record._id}.`);
  }
  console.info(`${entity}: assigned ${missing.length} missing code(s).`);
}

try {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required.");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || "ims" });
  for (const entity of entities) await backfill(entity);
} catch (error) {
  console.error("Entity code backfill failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
