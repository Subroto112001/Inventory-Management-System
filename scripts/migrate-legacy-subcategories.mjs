import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required.");
const apply = process.argv.includes("--apply");

try {
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "ims" });
  const db = mongoose.connection.db;
  const categories = db.collection("categories");
  const subcategories = db.collection("subcategories");
  const products = db.collection("products");
  const legacy = await categories.find({ parentCategory: { $type: "objectId" } }).toArray();
  const plan = [];

  for (const item of legacy) {
    const parent = await categories.findOne({ _id: item.parentCategory, $or: [{ parentCategory: null }, { parentCategory: { $exists: false } }] });
    if (!parent) {
      plan.push({ id: item._id.toString(), name: item.categoryName, action: "preserve", reason: "Referenced Category is missing or itself nested." });
      continue;
    }
    const [directCategory, assignedChild, existing, duplicateSibling, duplicateCode] = await Promise.all([
      products.find({ category: item._id, subcategory: { $type: "objectId", $ne: item._id } }).toArray(),
      products.find({ subcategory: item._id, category: { $type: "objectId", $nin: [parent._id, item._id] } }).toArray(),
      subcategories.findOne({ _id: item._id }),
      subcategories.findOne({ _id: { $ne: item._id }, category: parent._id, subcategoryName: { $regex: `^${String(item.categoryName || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } }),
      Promise.all([
        categories.findOne({ _id: { $ne: item._id }, categoryCode: item.categoryCode }),
        subcategories.findOne({ _id: { $ne: item._id }, subcategoryCode: item.categoryCode }),
      ]).then((matches) => matches.some(Boolean)),
    ]);
    if (directCategory.length || assignedChild.length || duplicateSibling || duplicateCode) {
      const reason = directCategory.length || assignedChild.length
        ? `Ambiguous product assignments (${directCategory.length + assignedChild.length}); resolve manually.`
        : duplicateSibling ? "A Subcategory with the same name already exists for this Category."
          : "A Category or Subcategory with the same code already exists.";
      plan.push({ id: item._id.toString(), name: item.categoryName, action: "preserve", reason });
      continue;
    }
    plan.push({ id: item._id.toString(), name: item.categoryName, category: parent.categoryName, action: existing ? "verify-and-remove-legacy-duplicate" : "move" });
  }

  console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", legacyRecordsFound: legacy.length, planned: plan, note: apply ? "Only unambiguous records are changed, in one MongoDB transaction." : "No data changed. Re-run with --apply after reviewing this plan." }, null, 2));
  if (!apply) process.exitCode = plan.some((item) => item.action === "preserve") ? 2 : 0;
  else {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        for (const row of plan.filter((item) => item.action === "move" || item.action === "verify-and-remove-legacy-duplicate")) {
          const item = legacy.find((record) => record._id.toString() === row.id);
          const payload = {
            _id: item._id,
            subcategoryName: item.categoryName,
            subcategoryCode: item.categoryCode,
            category: item.parentCategory,
            description: item.description || "",
            image: item.image || { public_id: null, url: null },
            products: item.products || [],
            createdBy: item.createdBy || null,
            isActive: item.isActive !== false,
            createdAt: item.createdAt || new Date(),
            updatedAt: new Date(),
          };
          const existing = await subcategories.findOne({ _id: item._id }, { session });
          if (existing && (existing.category?.toString() !== item.parentCategory.toString() || existing.subcategoryName !== item.categoryName)) throw new Error(`Existing Subcategory ${row.id} conflicts with its legacy Category record.`);
          if (!existing) await subcategories.insertOne(payload, { session });
          const productsWithOldCategory = await products.find({ category: item._id }, { session }).toArray();
          for (const product of productsWithOldCategory) {
            if (product.subcategory && product.subcategory.toString() !== item._id.toString()) throw new Error(`Product ${product._id} has an ambiguous legacy Category assignment.`);
            await products.updateOne({ _id: product._id }, { $set: { category: item.parentCategory, subcategory: item._id } }, { session });
          }
          await products.updateMany({ subcategory: item._id, $or: [{ category: null }, { category: { $exists: false } }] }, { $set: { category: item.parentCategory } }, { session });
          await categories.deleteOne({ _id: item._id, parentCategory: item.parentCategory }, { session });
        }
      });
    } finally {
      await session.endSession();
    }
    console.log("Migration completed. Preserved ambiguous/orphan records were not changed.");
  }
} finally {
  await mongoose.disconnect();
}
