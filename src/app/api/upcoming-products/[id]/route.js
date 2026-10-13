import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import { PERMISSIONS, requirePermission } from "@/lib/authorization";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import Brand from "@/lib/models/Brand";
import { readProductRequest, resolveImages } from "@/lib/upcomingProductImages";

async function GETHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.UPCOMING_PRODUCTS_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid product id." }, { status: 400 });
  await connectMongoDB();
  const product = await Product.findOne({ _id: id, lifecycle: "scheduled" }).lean();
  if (!product) return NextResponse.json({ success: false, message: "Scheduled product not found." }, { status: 404 });
  const images = product.images?.length ? [...product.images] : (product.image?.url ? [product.image] : []);
  if (product.image?.url) {
    const primaryIndex = images.findIndex((image) => image.url === product.image.url && (image.public_id || "") === (product.image.public_id || ""));
    if (primaryIndex > 0) images.unshift(images.splice(primaryIndex, 1)[0]);
    else if (primaryIndex < 0) images.unshift(product.image);
  }
  return NextResponse.json({ success: true, product: {
    ...product,
    id: product._id.toString(),
    category: product.category?.toString() || "",
    subcategory: product.subcategory?.toString() || "",
    brand: product.brand?.toString() || "",
    images,
  } });
}

async function PATCHHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.UPCOMING_PRODUCTS_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid product id." }, { status: 400 });
  const { body, files, manifest } = await readProductRequest(request);
  await connectMongoDB();
  const product = await Product.findOne({ _id: id, lifecycle: "scheduled" });
  if (!product) return NextResponse.json({ success: false, message: "Scheduled product not found." }, { status: 404 });
  const previousImages = product.images?.length ? product.images.map((image) => ({ public_id: image.public_id || "", url: image.url })) : (product.image?.url ? [{ public_id: product.image.public_id || "", url: product.image.url }] : []);
  if (manifest !== null) {
    const images = await resolveImages({ manifest, files, previousImages, mainImageIndex: body.mainImageIndex });
    product.images = images;
    product.image = images[0] || null;
  }
  const previousCategoryId = product.category?.toString() || "";
  const previousSubcategoryId = product.subcategory?.toString() || "";
  let selectedCategory = body.category === undefined ? null : null;
  if (body.category !== undefined && body.category) {
    if (!mongoose.isValidObjectId(body.category)) return NextResponse.json({ success: false, message: "Invalid category." }, { status: 400 });
    selectedCategory = await Category.findOne({ _id: body.category, isActive: true }).select("_id").lean();
    if (!selectedCategory) return NextResponse.json({ success: false, message: "Selected category is unavailable." }, { status: 400 });
  } else if (body.category === undefined && product.category) {
    selectedCategory = await Category.findById(product.category).select("_id").lean();
  }
  const nextCategoryId = body.category === undefined ? previousCategoryId : (selectedCategory?._id.toString() || "");
  const nextSubcategoryId = body.subcategory === undefined && body.category === undefined ? previousSubcategoryId : String(body.subcategory || "");
  let selectedSubcategory = null;
  if (body.subcategory === undefined && body.category === undefined && product.subcategory) {
    selectedSubcategory = { _id: product.subcategory };
  } else if (nextSubcategoryId) {
    if (!selectedCategory || !mongoose.isValidObjectId(nextSubcategoryId)) return NextResponse.json({ success: false, message: "Select a valid subcategory for the selected category." }, { status: 400 });
    selectedSubcategory = await Subcategory.findOne({ _id: nextSubcategoryId, category: selectedCategory._id, isActive: true }).select("_id").lean();
    if (!selectedSubcategory) return NextResponse.json({ success: false, message: "Selected subcategory does not belong to the selected category." }, { status: 400 });
  }
  let selectedBrand = null;
  if (body.brand !== undefined && body.brand) {
    if (!mongoose.isValidObjectId(body.brand)) return NextResponse.json({ success: false, message: "Invalid brand." }, { status: 400 });
    selectedBrand = await Brand.findOne({ _id: body.brand, status: "Active" }).select("_id").lean();
    if (!selectedBrand) return NextResponse.json({ success: false, message: "Selected brand is unavailable." }, { status: 400 });
  }
  if (body.productName !== undefined) {
    if (!String(body.productName).trim()) return NextResponse.json({ success: false, message: "Product name is required." }, { status: 400 });
    product.productName = String(body.productName).trim();
  }
  if (body.category !== undefined) product.category = selectedCategory?._id || null;
  if (body.subcategory !== undefined || body.category !== undefined) product.subcategory = selectedSubcategory?._id || null;
  if (body.brand !== undefined) product.brand = selectedBrand?._id || null;
  for (const field of ["unit", "description", "specifications", "price", "wholesalePrice", "discount", "lowStockAlert", "shipping", "paymentOption", "returnPolicy", "featuredOnLaunch"]) {
    if (body[field] !== undefined) product[field] = body[field];
  }
  if (body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) return NextResponse.json({ success: false, message: "Price must be a non-negative number." }, { status: 400 });
  if (body.launchAt !== undefined) {
    const launchDate = new Date(body.launchAt);
    if (!Number.isFinite(launchDate.getTime()) || launchDate <= new Date()) return NextResponse.json({ success: false, message: "Launch date must be in the future." }, { status: 400 });
    product.launchAt = launchDate;
  }
  if (body.preorder) {
    const startsAt = body.preorder.startsAt ? new Date(body.preorder.startsAt) : null;
    const endsAt = body.preorder.endsAt ? new Date(body.preorder.endsAt) : null;
    const expectedShipAt = body.preorder.expectedShipAt ? new Date(body.preorder.expectedShipAt) : null;
    const limit = body.preorder.limit == null || body.preorder.limit === "" ? null : Number(body.preorder.limit);
    if ((startsAt && (!Number.isFinite(startsAt.getTime()) || startsAt >= product.launchAt)) || (endsAt && (!Number.isFinite(endsAt.getTime()) || endsAt < (startsAt || new Date()) || endsAt > product.launchAt)) || (expectedShipAt && !Number.isFinite(expectedShipAt.getTime())) || (limit !== null && (!Number.isInteger(limit) || limit < 1))) return NextResponse.json({ success: false, message: "Invalid pre-order window or quantity limit." }, { status: 400 });
    product.preorder.enabled = body.preorder.enabled === true;
    product.preorder.startsAt = startsAt;
    product.preorder.endsAt = endsAt;
    product.preorder.limit = limit;
    product.preorder.expectedShipAt = expectedShipAt;
    product.preorder.terms = String(body.preorder.terms || "").slice(0, 2000);
  }
  if (body.featuredOnLaunch !== undefined) product.featuredOnLaunch = body.featuredOnLaunch === true;
  if (body.isActive !== undefined) product.isActive = body.isActive === true;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await product.save({ session });
      if (previousCategoryId !== nextCategoryId) {
        if (nextCategoryId) await Category.updateOne({ _id: nextCategoryId }, { $addToSet: { products: product._id } }, { session });
        if (previousCategoryId) await Category.updateOne({ _id: previousCategoryId }, { $pull: { products: product._id } }, { session });
      }
      if (previousSubcategoryId !== nextSubcategoryId) {
        if (nextSubcategoryId) await Subcategory.updateOne({ _id: nextSubcategoryId }, { $addToSet: { products: product._id } }, { session });
        if (previousSubcategoryId) await Subcategory.updateOne({ _id: previousSubcategoryId }, { $pull: { products: product._id } }, { session });
      }
    });
  } finally { await session.endSession(); }
  return NextResponse.json({ success: true, message: "Upcoming product updated successfully." });
}

async function DELETEHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.UPCOMING_PRODUCTS_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid product id." }, { status: 400 });
  await connectMongoDB();
  const product = await Product.findOneAndUpdate({ _id: id, lifecycle: "scheduled" }, { $set: { lifecycle: "inactive", isActive: false } });
  return NextResponse.json({ success: !!product, message: product ? "Product archived." : "Scheduled product not found." }, { status: product ? 200 : 404 });
}

export const PATCH = withApiErrorHandling(PATCHHandler, "PATCH /api/upcoming-products/[id]");
export const DELETE = withApiErrorHandling(DELETEHandler, "DELETE /api/upcoming-products/[id]");
export const GET = withApiErrorHandling(GETHandler, "GET /api/upcoming-products/[id]");
