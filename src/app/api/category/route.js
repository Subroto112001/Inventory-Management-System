import { logger } from "@/lib/serverLogger";
import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import Product from "@/lib/models/Product";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const recordType = (url) => new URL(url).searchParams.get("type");

async function GETHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicRead = searchParams.get("public") === "1";
    const type = recordType(request.url);
    if (!publicRead) {
      const access = await requirePermission(request, PERMISSIONS.CATEGORIES_READ);
      if (!access.ok) return access.response;
    }
    await connectMongoDB();

    if (type === "subcategory") {
      const docs = await Subcategory.find(publicRead ? { isActive: true } : {})
        .populate("category", "categoryName image isActive")
        .sort({ subcategoryName: 1, _id: 1 })
        .lean();
      const products = await Product.find({ subcategory: { $in: docs.map((doc) => doc._id) } }).select("subcategory").lean();
      const counts = new Map();
      products.forEach((product) => counts.set(product.subcategory.toString(), (counts.get(product.subcategory.toString()) || 0) + 1));
      return NextResponse.json({ success: true, categories: docs.map((doc) => ({
        id: doc._id.toString(), subcategoryName: doc.subcategoryName, subcategoryCode: doc.subcategoryCode,
        categoryName: doc.subcategoryName, categoryCode: doc.subcategoryCode,
        categoryId: doc.category?._id?.toString() || doc.category?.toString() || "",
        parentCategoryId: doc.category?._id?.toString() || doc.category?.toString() || "",
        parentCategoryName: doc.category?.categoryName || "", parentCategoryImage: doc.category?.image?.url || "",
        description: doc.description || "", image: doc.image?.url || "", isActive: doc.isActive,
        productCount: counts.get(doc._id.toString()) || 0, createdAt: doc.createdAt, updatedAt: doc.updatedAt,
      })) });
    }

    // Read raw documents here so legacy self-referenced records can be excluded
    // even though parentCategory is no longer part of the Category schema.
    const activeOnly = publicRead || searchParams.get("list") === "1";
    const rootFilter = {
      $or: [{ parentCategory: null }, { parentCategory: { $exists: false } }],
      ...(activeOnly ? { isActive: true } : {}),
    };
    const [rawCategories, subcategories] = await Promise.all([
      Category.aggregate([
        { $match: rootFilter },
        { $sort: { categoryName: 1, _id: 1 } },
      ]).exec(),
      Subcategory.find(activeOnly ? { isActive: true } : {}).sort({ subcategoryName: 1, _id: 1 }).lean(),
    ]);
    const categoryIds = rawCategories.map((doc) => doc._id);
    const subcategoryIds = subcategories.map((doc) => doc._id);
    const [products, assignments] = await Promise.all([
      Product.find({ $or: [{ category: { $in: categoryIds } }, { subcategory: { $in: subcategoryIds } }] })
        .select("_id productName productSKU price quantity currentStock lowStockAlert image category subcategory isActive").sort({ createdAt: -1 }).lean(),
      subcategoryIds.length ? Subcategory.find({ _id: { $in: subcategoryIds } }).select("category").lean() : [],
    ]);
    const childCounts = new Map();
    assignments.forEach((item) => childCounts.set(item.category.toString(), (childCounts.get(item.category.toString()) || 0) + 1));
    const rootIds = new Set(categoryIds.map((id) => id.toString()));
    const validChildren = subcategories.filter((child) => rootIds.has(child.category?.toString()));
    const mapped = rawCategories.map((category) => {
      const id = category._id.toString();
      const relatedChildren = validChildren.filter((child) => child.category.toString() === id);
      const relatedProducts = products.filter((product) => product.category?.toString() === id || relatedChildren.some((child) => product.subcategory?.toString() === child._id.toString()));
      return {
        id, categoryName: category.categoryName, categoryCode: category.categoryCode,
        description: category.description || "", image: category.image?.url || "", isActive: category.isActive,
        subcategoryCount: relatedChildren.length, productCount: relatedProducts.length,
        subcategories: relatedChildren.map((child) => ({ id: child._id.toString(), subcategoryName: child.subcategoryName, categoryName: child.subcategoryName, subcategoryCode: child.subcategoryCode })),
        products: relatedProducts.map((product) => ({ id: product._id.toString(), productName: product.productName, productSKU: product.productSKU, price: product.price, quantity: product.quantity ?? 0, currentStock: product.currentStock ?? 0, image: product.image?.url || "", isActive: product.isActive })),
        createdBy: category.createdBy?.toString() || null, createdAt: category.createdAt, updatedAt: category.updatedAt,
      };
    });

    if (searchParams.get("list") === "1") {
      const categoryRows = mapped.map(({ id, categoryName, categoryCode, image }) => ({ id, categoryName, categoryCode, image, parentCategoryId: "" }));
      if (searchParams.get("includeSubcategories") === "1") {
        const childRows = validChildren.map((child) => ({ id: child._id.toString(), categoryName: child.subcategoryName, categoryCode: child.subcategoryCode, image: child.image?.url || "", parentCategoryId: child.category.toString(), parentCategoryName: rawCategories.find((item) => item._id.toString() === child.category.toString())?.categoryName || "" }));
        return NextResponse.json({ success: true, categories: [...categoryRows, ...childRows] });
      }
      return NextResponse.json({ success: true, categories: categoryRows });
    }
    if (publicRead) {
      const rootRows = mapped.map(({ id, categoryName, categoryCode, image, subcategories }) => ({ id, categoryName, name: categoryName, categoryCode, image, parentCategoryId: "", subcategories: subcategories.map(({ id: childId, categoryName: childName }) => ({ id: childId, categoryName: childName })) }));
      const childRows = validChildren.map((child) => ({ id: child._id.toString(), categoryName: child.subcategoryName, name: child.subcategoryName, categoryCode: child.subcategoryCode, image: child.image?.url || "", parentCategoryId: child.category.toString(), parentCategoryName: rawCategories.find((item) => item._id.toString() === child.category.toString())?.categoryName || "", subcategories: [] }));
      return NextResponse.json({ success: true, categories: [...rootRows, ...childRows] });
    }
    return NextResponse.json({ success: true, categories: mapped });
  } catch (error) {
    logger.error("Fetch Categories API Error:", error);
    return NextResponse.json({ success: false, message: "Unable to load Categories." }, { status: 500 });
  }
}

async function POSTHandler(request) {
  try {
    const access = await requirePermission(request, PERMISSIONS.CATEGORIES_MANAGE);
    if (!access.ok) return access.response;
    if (recordType(request.url) === "subcategory") return NextResponse.json({ success: false, message: "Create Subcategories through /api/subcategory." }, { status: 400 });
    const formData = await request.formData();
    const categoryName = String(formData.get("categoryName") || "").trim();
    const categoryCode = String(formData.get("categoryCode") || "").trim().toUpperCase();
    const description = String(formData.get("description") || "").trim();
    if (formData.get("parentCategory")) return NextResponse.json({ success: false, message: "Create subcategories from Subcategory Management." }, { status: 400 });
    if (!categoryName || !categoryCode) return NextResponse.json({ success: false, message: "Category name and category code are required." }, { status: 400 });
    if (categoryName.length > 100 || categoryCode.length > 30 || description.length > 500) return NextResponse.json({ success: false, message: "Category name, code, or description exceeds its allowed length." }, { status: 400 });
    const image = formData.get("image");
    if (image && typeof image !== "string" && image.size > 0 && (!/^(image\/(jpeg|png|webp))$/.test(image.type) || image.size > 5 * 1024 * 1024)) return NextResponse.json({ success: false, message: "Choose a JPG, PNG, or WEBP image no larger than 5 MB." }, { status: 400 });
    await connectMongoDB();
    const duplicate = await Category.findOne({ $or: [{ categoryCode }, { categoryName: { $regex: `^${escapeRegex(categoryName)}$`, $options: "i" } }] }).select("_id");
    if (duplicate) return NextResponse.json({ success: false, message: "A Category with this name or code already exists." }, { status: 409 });
    const uploaded = image && typeof image !== "string" && image.size > 0 ? await uploadImageToCloudinary(image, "categories") : null;
    const category = await Category.create({ categoryName, categoryCode, description, image: uploaded ? { public_id: uploaded.publicId, url: uploaded.url } : { public_id: null, url: null }, products: [], createdBy: access.user._id, isActive: true });
    return NextResponse.json({ success: true, message: "Category created successfully.", category: { id: category._id.toString(), categoryName: category.categoryName, categoryCode: category.categoryCode, description: category.description, image: category.image, productCount: 0, subcategoryCount: 0, isActive: category.isActive, createdAt: category.createdAt, updatedAt: category.updatedAt } }, { status: 201 });
  } catch (error) {
    logger.error("Create Category API Error:", error);
    if (error.code === 11000) return NextResponse.json({ success: false, message: "A Category with this name or code already exists." }, { status: 409 });
    if (error.name === "ValidationError") return NextResponse.json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(" ") }, { status: 400 });
    return NextResponse.json({ success: false, message: error.message || "Unable to create Category." }, { status: error.statusCode === 403 ? 502 : 500 });
  }
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/category");
export const POST = withApiErrorHandling(POSTHandler, "POST /api/category");
