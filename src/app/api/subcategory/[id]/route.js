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

const serialize = (doc) => ({
  id: doc._id.toString(), subcategoryName: doc.subcategoryName, subcategoryCode: doc.subcategoryCode,
  categoryName: doc.subcategoryName, categoryCode: doc.subcategoryCode,
  categoryId: doc.category?._id?.toString() || doc.category?.toString() || "",
  parentCategoryId: doc.category?._id?.toString() || doc.category?.toString() || "",
  parentCategoryName: doc.category?.categoryName || "", parentCategoryImage: doc.category?.image?.url || "",
  description: doc.description || "", image: doc.image || null, isActive: doc.isActive,
});

async function GETHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.CATEGORIES_READ);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid Subcategory ID." }, { status: 400 });
  try {
    await connectMongoDB();
    const doc = await Subcategory.findById(id).populate("category", "categoryName image isActive").lean();
    if (!doc) return NextResponse.json({ success: false, message: "Subcategory not found." }, { status: 404 });
    if (!doc.category) return NextResponse.json({ success: false, message: "This Subcategory has no valid Category. Repair its relationship before editing." }, { status: 409 });
    return NextResponse.json({ success: true, subcategory: serialize(doc) });
  } catch (error) {
    logger.error("Fetch Subcategory API Error:", error);
    return NextResponse.json({ success: false, message: "Unable to load Subcategory." }, { status: 500 });
  }
}

async function PUTHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.CATEGORIES_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid Subcategory ID." }, { status: 400 });
  try {
    const multipart = request.headers.get("content-type")?.includes("multipart/form-data");
    const form = multipart ? await request.formData() : null;
    const body = form ? Object.fromEntries(form.entries()) : await request.json();
    const subcategoryName = String(body.subcategoryName ?? body.categoryName ?? "").trim();
    const subcategoryCode = String(body.subcategoryCode ?? body.categoryCode ?? "").trim().toUpperCase();
    const categoryId = String(body.category ?? body.parentCategory ?? "").trim();
    const description = String(body.description || "").trim();
    if (!subcategoryName || !subcategoryCode || !categoryId) return NextResponse.json({ success: false, message: "Subcategory name, code, and Category are required." }, { status: 400 });
    if (subcategoryName.length > 100 || subcategoryCode.length > 30 || description.length > 500) return NextResponse.json({ success: false, message: "Subcategory name, code, or description exceeds its allowed length." }, { status: 400 });
    if (!mongoose.isValidObjectId(categoryId)) return NextResponse.json({ success: false, message: "Select a valid Category." }, { status: 400 });
    await connectMongoDB();
    const doc = await Subcategory.findById(id);
    if (!doc) return NextResponse.json({ success: false, message: "Subcategory not found." }, { status: 404 });
    const category = await Category.findOne({ _id: categoryId, isActive: true }).select("_id categoryName image");
    if (!category) return NextResponse.json({ success: false, message: "The selected Category does not exist or is inactive." }, { status: 400 });
    const duplicate = await Subcategory.findOne({ _id: { $ne: id }, category: category._id, subcategoryName: { $regex: `^${subcategoryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } }).select("_id");
    if (duplicate) return NextResponse.json({ success: false, message: "A Subcategory with this name already exists in that Category." }, { status: 409 });
    const duplicateCode = await Promise.all([Category.exists({ categoryCode: subcategoryCode }), Subcategory.exists({ _id: { $ne: id }, subcategoryCode })]);
    if (duplicateCode.some(Boolean)) return NextResponse.json({ success: false, message: "A Category or Subcategory with this code already exists." }, { status: 409 });
    let image = doc.image;
    if (body.removeImage === "true" || body.removeImage === true) image = { public_id: null, url: null };
    const file = form?.get("image");
    if (file && typeof file !== "string" && file.size > 0) {
      if (!/^(image\/(jpeg|png|webp))$/.test(file.type) || file.size > 5 * 1024 * 1024) return NextResponse.json({ success: false, message: "Choose a JPG, PNG, or WEBP image no larger than 5 MB." }, { status: 400 });
      const uploaded = await uploadImageToCloudinary(file, "categories");
      image = { public_id: uploaded.publicId, url: uploaded.url };
    }
    const oldCategoryId = doc.category.toString();
    const assigned = await Product.find({ subcategory: doc._id }).select("_id").lean();
    const assignedIds = assigned.map((item) => item._id);
    doc.subcategoryName = subcategoryName;
    doc.subcategoryCode = subcategoryCode;
    doc.category = category._id;
    doc.description = description;
    doc.image = image;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await doc.save({ session });
        if (oldCategoryId !== category._id.toString()) {
          await Product.updateMany({ subcategory: doc._id }, { $set: { category: category._id } }, { session });
          await Category.updateOne({ _id: oldCategoryId }, { $pull: { products: { $in: assignedIds } } }, { session });
          await Category.updateOne({ _id: category._id }, { $addToSet: { products: { $each: assignedIds } } }, { session });
        }
        await recordAuditLog({ actor: access.user._id, action: "SUBCATEGORY_UPDATED", resource: "Subcategory", resourceId: doc._id, metadata: { subcategoryName, categoryId: category._id.toString() }, session });
      });
    } finally {
      await session.endSession();
    }
    return NextResponse.json({ success: true, message: "Subcategory updated successfully.", subcategory: serialize({ ...doc.toObject(), category }) });
  } catch (error) {
    logger.error("Update Subcategory API Error:", error);
    if (error.code === 11000) return NextResponse.json({ success: false, message: "A Subcategory with this name already exists in that Category." }, { status: 409 });
    if (error.name === "ValidationError") return NextResponse.json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(" ") }, { status: 400 });
    return NextResponse.json({ success: false, message: "Unable to update Subcategory." }, { status: 500 });
  }
}

async function DELETEHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.CATEGORIES_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid Subcategory ID." }, { status: 400 });
  let session;
  try {
    await connectMongoDB();
    session = await mongoose.startSession();
    let doc;
    let count = 0;
    await session.withTransaction(async () => {
      doc = await Subcategory.findById(id).session(session);
      if (!doc) throw Object.assign(new Error("Subcategory not found."), { statusCode: 404 });
      if (!await Category.exists({ _id: doc.category }).session(session)) throw Object.assign(new Error("The Subcategoryâ€™s Category is missing; repair that relationship before deleting."), { statusCode: 409 });
      count = await Product.countDocuments({ subcategory: doc._id }).session(session);
      await Product.updateMany({ subcategory: doc._id }, { $unset: { subcategory: "" } }, { session });
      await Subcategory.deleteOne({ _id: doc._id }, { session });
      await recordAuditLog({ actor: access.user._id, action: "SUBCATEGORY_DELETED", resource: "Subcategory", resourceId: doc._id, metadata: { subcategoryName: doc.subcategoryName, affectedProductCount: count }, session });
    });
    return NextResponse.json({ success: true, message: `Subcategory deleted. ${count} product(s) remain assigned to their Category.`, affectedProductCount: count });
  } catch (error) {
    logger.error("Delete Subcategory API Error:", error);
    if (error.statusCode) return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    if (error.code === 20 || error.codeName === "IllegalOperation" || /transactions are not supported|replica set/i.test(error.message || "")) {
      try {
        const doc = await Subcategory.findById(id).lean();
        if (!doc) return NextResponse.json({ success: false, message: "Subcategory not found." }, { status: 404 });
        if (!await Category.exists({ _id: doc.category })) return NextResponse.json({ success: false, message: "The Subcategoryâ€™s Category is missing; repair that relationship before deleting." }, { status: 409 });
        const count = await Product.countDocuments({ subcategory: doc._id });
        await Product.updateMany({ subcategory: doc._id }, { $unset: { subcategory: "" } });
        await Subcategory.deleteOne({ _id: doc._id });
        try { await recordAuditLog({ actor: access.user._id, action: "SUBCATEGORY_DELETED", resource: "Subcategory", resourceId: doc._id, metadata: { subcategoryName: doc.subcategoryName, affectedProductCount: count, mode: "ordered-fallback" } }); } catch (auditError) { logger.error("Subcategory deletion audit failed:", auditError); }
        return NextResponse.json({ success: true, message: `Subcategory deleted. ${count} product(s) remain assigned to their Category.`, affectedProductCount: count });
      } catch (fallbackError) {
        logger.error("Ordered Subcategory deletion failed:", fallbackError);
        return NextResponse.json({ success: false, message: "Subcategory deletion is incomplete. Products were not deleted; review the records before retrying." }, { status: 503 });
      }
    }
    return NextResponse.json({ success: false, message: "Unable to delete Subcategory. No products were deleted." }, { status: 503 });
  } finally {
    await session?.endSession();
  }
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/subcategory/[id]");
export const PUT = withApiErrorHandling(PUTHandler, "PUT /api/subcategory/[id]");
export const DELETE = withApiErrorHandling(DELETEHandler, "DELETE /api/subcategory/[id]");
