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
import { recordAuditLog } from "@/lib/auditLog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function GETHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.CATEGORIES_READ);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid Category ID." }, { status: 400 });
  try {
    await connectMongoDB();
    const category = await Category.findById(id).lean();
    if (!category || await Category.collection.findOne({ _id: category._id, parentCategory: { $type: "objectId" } })) return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
    return NextResponse.json({ success: true, category: { id: category._id.toString(), categoryName: category.categoryName, categoryCode: category.categoryCode, description: category.description || "", image: category.image || null, isActive: category.isActive } });
  } catch (error) {
    logger.error("Fetch Category API Error:", error);
    return NextResponse.json({ success: false, message: "Unable to load Category." }, { status: 500 });
  }
}

async function PUTHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.CATEGORIES_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid Category ID." }, { status: 400 });
  try {
    const multipart = request.headers.get("content-type")?.includes("multipart/form-data");
    const form = multipart ? await request.formData() : null;
    const body = form ? Object.fromEntries(form.entries()) : await request.json();
    const categoryName = String(body.categoryName || "").trim();
    const categoryCode = String(body.categoryCode || "").trim().toUpperCase();
    const description = String(body.description || "").trim();
    if (!categoryName || !categoryCode) return NextResponse.json({ success: false, message: "Category name and code are required." }, { status: 400 });
    if (categoryName.length > 100 || categoryCode.length > 30 || description.length > 500) return NextResponse.json({ success: false, message: "Category name, code, or description exceeds its allowed length." }, { status: 400 });
    await connectMongoDB();
    const category = await Category.findById(id);
    if (!category || await Category.collection.findOne({ _id: category?._id, parentCategory: { $type: "objectId" } })) return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
    const duplicate = await Category.findOne({ _id: { $ne: id }, $or: [{ categoryCode }, { categoryName: { $regex: `^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } }] }).select("_id");
    if (duplicate) return NextResponse.json({ success: false, message: "A Category with this name or code already exists." }, { status: 409 });
    let image = category.image;
    if (body.removeImage === "true" || body.removeImage === true) image = { public_id: null, url: null };
    const file = form?.get("image");
    if (file && typeof file !== "string" && file.size > 0) {
      if (!/^(image\/(jpeg|png|webp))$/.test(file.type) || file.size > 5 * 1024 * 1024) return NextResponse.json({ success: false, message: "Choose a JPG, PNG, or WEBP image no larger than 5 MB." }, { status: 400 });
      const uploaded = await uploadImageToCloudinary(file, "categories");
      image = { public_id: uploaded.publicId, url: uploaded.url };
    }
    category.categoryName = categoryName;
    category.categoryCode = categoryCode;
    category.description = description;
    category.image = image;
    await category.save();
    await recordAuditLog({ actor: access.user._id, action: "CATEGORY_UPDATED", resource: "Category", resourceId: category._id, metadata: { categoryName, categoryCode } });
    return NextResponse.json({ success: true, message: "Category updated successfully.", category: { id: category._id.toString(), categoryName, categoryCode, description, image, isActive: category.isActive } });
  } catch (error) {
    logger.error("Update Category API Error:", error);
    if (error.code === 11000) return NextResponse.json({ success: false, message: "That Category name or code is already in use." }, { status: 409 });
    if (error.name === "ValidationError") return NextResponse.json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(" ") }, { status: 400 });
    return NextResponse.json({ success: false, message: "Unable to update Category." }, { status: 500 });
  }
}

async function DELETEHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.CATEGORIES_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid Category ID." }, { status: 400 });
  let session;
  try {
    await connectMongoDB();
    if (await Category.collection.countDocuments({ parentCategory: new mongoose.Types.ObjectId(id) })) {
      return NextResponse.json({ success: false, message: "Legacy nested Category records exist. Run the reviewed legacy Subcategory migration before deleting a Category." }, { status: 409 });
    }
    session = await mongoose.startSession();
    let category;
    let childIds = [];
    let affectedProductCount = 0;
    await session.withTransaction(async () => {
      category = await Category.findById(id).session(session);
      if (!category || await Category.collection.findOne({ _id: category?._id, parentCategory: { $type: "objectId" } }, { session })) throw Object.assign(new Error("Category not found."), { statusCode: 404 });
      const children = await Subcategory.find({ category: category._id }).select("_id").session(session).lean();
      childIds = children.map((child) => child._id);
      affectedProductCount = await Product.countDocuments({ $or: [{ category: category._id }, { subcategory: { $in: childIds } }] }).session(session);
      await Product.updateMany({ $or: [{ category: category._id }, { subcategory: { $in: childIds } }] }, { $unset: { category: "", subcategory: "" } }, { session });
      await Subcategory.deleteMany({ category: category._id }, { session });
      await Category.deleteOne({ _id: category._id }, { session });
      await recordAuditLog({ actor: access.user._id, action: "CATEGORY_DELETED", resource: "Category", resourceId: category._id, metadata: { categoryName: category.categoryName, deletedSubcategoryIds: childIds.map(String), affectedProductCount }, session });
    });
    return NextResponse.json({ success: true, message: `Category and ${childIds.length} Subcategory(ies) deleted. ${affectedProductCount} product(s) were preserved without category assignments.`, affectedProductCount });
  } catch (error) {
    logger.error("Delete Category API Error:", error);
    if (error.statusCode === 404) return NextResponse.json({ success: false, message: error.message }, { status: 404 });
    // For standalone MongoDB deployments, preserve products first, then remove
    // subcategories, then Category. Each later step only removes dangling refs.
    if (error.code === 20 || error.codeName === "IllegalOperation" || /transactions are not supported|replica set/i.test(error.message || "")) {
      try {
        const category = await Category.findById(id).lean();
        if (!category) return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
        const children = await Subcategory.find({ category: category._id }).select("_id").lean();
        const childIds = children.map((child) => child._id);
        const filter = { $or: [{ category: category._id }, { subcategory: { $in: childIds } }] };
        const affectedProductCount = await Product.countDocuments(filter);
        await Product.updateMany(filter, { $unset: { category: "", subcategory: "" } });
        await Subcategory.deleteMany({ category: category._id });
        await Category.deleteOne({ _id: category._id });
        try { await recordAuditLog({ actor: access.user._id, action: "CATEGORY_DELETED", resource: "Category", resourceId: category._id, metadata: { categoryName: category.categoryName, deletedSubcategoryIds: childIds.map(String), affectedProductCount, mode: "ordered-fallback" } }); } catch (auditError) { logger.error("Category deletion audit failed:", auditError); }
        return NextResponse.json({ success: true, message: `Category and ${childIds.length} Subcategory(ies) deleted. ${affectedProductCount} product(s) were preserved without category assignments.`, affectedProductCount });
      } catch (fallbackError) {
        logger.error("Ordered Category deletion failed:", fallbackError);
        return NextResponse.json({ success: false, message: "Category deletion is incomplete. Products were not deleted; review the Category and Subcategory records before retrying." }, { status: 503 });
      }
    }
    return NextResponse.json({ success: false, message: "Category deletion could not be completed. No products were deleted." }, { status: 503 });
  } finally {
    await session?.endSession();
  }
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/category/[id]");
export const PUT = withApiErrorHandling(PUTHandler, "PUT /api/category/[id]");
export const DELETE = withApiErrorHandling(DELETEHandler, "DELETE /api/category/[id]");
