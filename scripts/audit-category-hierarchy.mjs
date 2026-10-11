import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required.");

try {
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "ims" });
  const db = mongoose.connection.db;
  const categories = db.collection("categories");
  const subcategories = db.collection("subcategories");
  const products = db.collection("products");
  const [categoryCount, subcategoryCount, orphanParents, productCount, uncategorizedProducts, orphanCategories, orphanSubcategories] = await Promise.all([
    categories.countDocuments(),
    categories.countDocuments({ parentCategory: { $type: "objectId" } }),
    categories.aggregate([
      { $match: { parentCategory: { $type: "objectId" } } },
      { $lookup: { from: "categories", localField: "parentCategory", foreignField: "_id", as: "parent" } },
      { $match: { parent: { $size: 0 } } },
      { $count: "count" },
    ]).toArray(),
    products.countDocuments(),
    products.countDocuments({ $or: [{ category: { $exists: false } }, { category: null }] }),
    products.aggregate([
      { $match: { category: { $type: "objectId" } } },
      { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "parent" } },
      { $match: { parent: { $size: 0 } } },
      { $count: "count" },
    ]).toArray(),
    products.aggregate([
      { $match: { subcategory: { $type: "objectId" } } },
      { $lookup: { from: "subcategories", localField: "subcategory", foreignField: "_id", as: "child" } },
      { $match: { child: { $size: 0 } } },
      { $count: "count" },
    ]).toArray(),
  ]);

  console.log(JSON.stringify({
    categories: categoryCount,
    legacyEmbeddedSubcategories: subcategoryCount,
    subcategoriesCollection: await subcategories.countDocuments(),
    orphanParentReferences: orphanParents[0]?.count || 0,
    products: productCount,
    uncategorizedProducts: uncategorizedProducts,
    orphanProductCategoryReferences: orphanCategories[0]?.count || 0,
    orphanProductSubcategoryReferences: orphanSubcategories[0]?.count || 0,
  }, null, 2));
} finally {
  await mongoose.disconnect();
}
