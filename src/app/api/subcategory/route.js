import { logger } from "@/lib/serverLogger";
import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import Product from "@/lib/models/Product";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";
import { createWithGeneratedCode } from "@/lib/entityCodeServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const serialize = (doc) => ({
  id: doc._id.toString(), subcategoryName: doc.subcategoryName, subcategoryCode: doc.subcategoryCode,
  categoryName: doc.subcategoryName, categoryCode: doc.subcategoryCode,
  categoryId: doc.category?._id?.toString() || doc.category?.toString() || "",
  parentCategoryId: doc.category?._id?.toString() || doc.category?.toString() || "",
  parentCategoryName: doc.category?.categoryName || "", parentCategoryImage: doc.category?.image?.url || "",
  description: doc.description || "", image: doc.image?.url || "", imageRecord: doc.image || null,
  isActive: doc.isActive, createdAt: doc.createdAt, updatedAt: doc.updatedAt,
});

async function GETHandler(request) {
  try {
    const publicRead = new URL(request.url).searchParams.get("public") === "1";
    if (!publicRead) {
      const access = await requirePermission(request, PERMISSIONS.CATEGORIES_READ);
      if (!access.ok) return access.response;
    }
    await connectMongoDB();
    const docs = await Subcategory.find(publicRead ? { isActive: true } : {})
      .populate("category", "categoryName image isActive")
      .sort({ subcategoryName: 1, _id: 1 }).lean();
    const counts = await Product.aggregate([{ $match: { subcategory: { $in: docs.map((doc) => doc._id) } } }, { $group: { _id: "$subcategory", count: { $sum: 1 } } }]);
    const countById = new Map(counts.map((item) => [item._id.toString(), item.count]));
    return NextResponse.json({ success: true, subcategories: docs.map((doc) => ({ ...serialize(doc), productCount: countById.get(doc._id.toString()) || 0 })) });
  } catch (error) {
    logger.error("Fetch Subcategories API Error:", error);
    return NextResponse.json({ success: false, message: "Unable to load Subcategories." }, { status: 500 });
  }
}

async function POSTHandler(request) {
  try {
    const access = await requirePermission(request, PERMISSIONS.CATEGORIES_MANAGE);
    if (!access.ok) return access.response;
    const form = await request.formData();
    const subcategoryName = String(form.get("subcategoryName") ?? form.get("categoryName") ?? "").trim();
    const categoryId = String(form.get("category") ?? form.get("parentCategory") ?? "").trim();
    const description = String(form.get("description") || "").trim();
    if (!subcategoryName || !categoryId) return NextResponse.json({ success: false, message: "Subcategory name and Category are required." }, { status: 400 });
    if (subcategoryName.length > 100 || description.length > 500) return NextResponse.json({ success: false, message: "Subcategory name or description exceeds its allowed length." }, { status: 400 });
    if (!mongoose.isValidObjectId(categoryId)) return NextResponse.json({ success: false, message: "Select a valid Category." }, { status: 400 });
    const file = form.get("image");
    if (file && typeof file !== "string" && file.size > 0 && (!/^(image\/(jpeg|png|webp))$/.test(file.type) || file.size > 5 * 1024 * 1024)) return NextResponse.json({ success: false, message: "Choose a JPG, PNG, or WEBP image no larger than 5 MB." }, { status: 400 });
    await connectMongoDB();
    const category = await Category.findOne({ _id: categoryId, isActive: true }).select("_id categoryName");
    if (!category) return NextResponse.json({ success: false, message: "The selected Category does not exist or is inactive." }, { status: 400 });
    const duplicate = await Subcategory.findOne({ category: category._id, subcategoryName: { $regex: `^${subcategoryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } }).select("_id");
    if (duplicate) return NextResponse.json({ success: false, message: "A Subcategory with this name already exists in that Category." }, { status: 409 });
    const uploaded = file && typeof file !== "string" && file.size > 0 ? await uploadImageToCloudinary(file, "categories") : null;
    const doc = await createWithGeneratedCode({ entity: "subcategory", Model: Subcategory, name: subcategoryName, data: { subcategoryName, category: category._id, description, image: uploaded ? { public_id: uploaded.publicId, url: uploaded.url } : { public_id: null, url: null }, products: [], createdBy: access.user._id, isActive: true } });
    return NextResponse.json({ success: true, message: "Subcategory created successfully.", subcategory: { ...serialize({ ...doc.toObject(), category }), productCount: 0 } }, { status: 201 });
  } catch (error) {
    logger.error("Create Subcategory API Error:", error);
    if (error.code === 11000) return NextResponse.json({ success: false, message: "A Subcategory with this name already exists in that Category." }, { status: 409 });
    if (error.name === "ValidationError") return NextResponse.json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(" ") }, { status: 400 });
    return NextResponse.json({ success: false, message: error.message || "Unable to create Subcategory." }, { status: 500 });
  }
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/subcategory");
export const POST = withApiErrorHandling(POSTHandler, "POST /api/subcategory");
