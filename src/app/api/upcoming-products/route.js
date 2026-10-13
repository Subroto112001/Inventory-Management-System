import { logger } from "@/lib/serverLogger";
import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import Brand from "@/lib/models/Brand";
import mongoose from "mongoose";
import { increaseStock } from "@/lib/inventory/stockService";
import { PERMISSIONS, requirePermission } from "@/lib/authorization";
import { readProductRequest, resolveImages, validateImageFiles } from "@/lib/upcomingProductImages";
import { createWithGeneratedCode } from "@/lib/entityCodeServer";

export const dynamic = "force-dynamic";

async function GETHandler(request) {
  const publicRead = new URL(request.url).searchParams.get("public") === "1";
  if (!publicRead) {
    const access = await requirePermission(request, PERMISSIONS.UPCOMING_PRODUCTS_MANAGE);
    if (!access.ok) return access.response;
  }
  await connectMongoDB();
  const filter = publicRead
    ? { lifecycle: "scheduled", isActive: true, launchAt: { $gt: new Date() } }
    : { lifecycle: "scheduled" };
  const products = await Product.find(filter).sort({ launchAt: 1 }).limit(100).lean();
  const now = new Date();
  return NextResponse.json({ success: true, products: products.map((p) => {
    const imageRecords = p.images?.length ? [...p.images] : (p.image?.url ? [p.image] : []);
    if (p.image?.url) {
      const mainIndex = imageRecords.findIndex((image) => image.url === p.image.url && (image.public_id || "") === (p.image.public_id || ""));
      if (mainIndex > 0) imageRecords.unshift(imageRecords.splice(mainIndex, 1)[0]);
      else if (mainIndex < 0) imageRecords.unshift(p.image);
    }
    return {
    id: p._id.toString(), name: p.productName, sku: p.productSKU, price: p.price,
    image: p.image?.url || imageRecords[0]?.url || "", images: imageRecords.map((image) => image.url).filter(Boolean), launchAt: p.launchAt,
    preorder: p.preorder,
    preorderAvailable: p.launchAt > now && p.preorder?.enabled === true && (!p.preorder.startsAt || p.preorder.startsAt <= now) && (!p.preorder.endsAt || p.preorder.endsAt >= now) && (p.preorder.limit == null || p.preorder.reserved < p.preorder.limit),
    featuredOnLaunch: p.featuredOnLaunch, isActive: p.isActive,
  }; }) });
}

async function POSTHandler(request) {
  const access = await requirePermission(request, PERMISSIONS.UPCOMING_PRODUCTS_MANAGE);
  if (!access.ok) return access.response;
  try {
    const { body, files, manifest } = await readProductRequest(request);
    const launchAt = new Date(body.launchAt);
    const startsAt = body.preorder?.startsAt ? new Date(body.preorder.startsAt) : null;
    const endsAt = body.preorder?.endsAt ? new Date(body.preorder.endsAt) : null;
    const expectedShipAt = body.preorder?.expectedShipAt ? new Date(body.preorder.expectedShipAt) : null;
    const now = new Date();
    if (!String(body.productName || "").trim() || !Number.isFinite(Number(body.price)) || !Number.isFinite(launchAt.getTime()) || launchAt <= now)
      return NextResponse.json({ success: false, message: "Name, non-negative price, and a future launch date are required." }, { status: 400 });
    if (Number(body.price) < 0 || (startsAt && (!Number.isFinite(startsAt.getTime()) || startsAt >= launchAt)) || (endsAt && (!Number.isFinite(endsAt.getTime()) || endsAt < (startsAt || now) || endsAt > launchAt)) || (expectedShipAt && !Number.isFinite(expectedShipAt.getTime())))
      return NextResponse.json({ success: false, message: "Pre-order dates must fall before launch and in chronological order." }, { status: 400 });
    const max = body.preorder?.limit === "" || body.preorder?.limit == null ? null : Number(body.preorder.limit);
    if (max !== null && (!Number.isInteger(max) || max < 1)) return NextResponse.json({ success: false, message: "Pre-order limit must be a positive whole number." }, { status: 400 });
    await connectMongoDB();
    let category = null;
    let subcategory = null;
    let brand = null;
    if (body.category) {
      if (!mongoose.isValidObjectId(body.category)) return NextResponse.json({ success: false, message: "Invalid category." }, { status: 400 });
      category = await Category.findOne({ _id: body.category, isActive: true }).select("_id").lean();
      if (!category) return NextResponse.json({ success: false, message: "Selected category is unavailable." }, { status: 400 });
    }
    if (body.subcategory) {
      if (!mongoose.isValidObjectId(body.subcategory)) return NextResponse.json({ success: false, message: "Invalid subcategory." }, { status: 400 });
      subcategory = await Subcategory.findOne({ _id: body.subcategory, isActive: true }).select("_id category").lean();
      if (!subcategory || (category && String(subcategory.category) !== String(category._id))) return NextResponse.json({ success: false, message: "Selected subcategory does not belong to the selected category." }, { status: 400 });
      if (!category) category = await Category.findOne({ _id: subcategory.category, isActive: true }).select("_id").lean();
      if (!category) return NextResponse.json({ success: false, message: "Subcategory parent category is unavailable." }, { status: 400 });
    }
    if (body.brand) {
      if (!mongoose.isValidObjectId(body.brand)) return NextResponse.json({ success: false, message: "Invalid brand." }, { status: 400 });
      brand = await Brand.findOne({ _id: body.brand, status: "Active" }).select("_id").lean();
      if (!brand) return NextResponse.json({ success: false, message: "Selected brand is unavailable." }, { status: 400 });
    }
    if (Array.isArray(body.images) && body.images.length > 4) return NextResponse.json({ success: false, message: "A product can have at most four images." }, { status: 400 });
    validateImageFiles(files);
    const legacyImages = Array.isArray(body.images) ? body.images.filter((x) => typeof x?.url === "string" && x.url.trim()).slice(0, 4) : [];
    const images = await resolveImages({ manifest, files, legacyImages, mainImageIndex: body.mainImageIndex });
    const initialStock = Number(body.initialStock || 0);
    if (!Number.isInteger(initialStock) || initialStock < 0) return NextResponse.json({ success: false, message: "Initial stock must be a non-negative whole number." }, { status: 400 });
    const product = await createWithGeneratedCode({ entity: "product", Model: Product, name: String(body.productName).trim(), data: {
      productName: String(body.productName).trim(),
      description: body.description || "", price: Number(body.price), discount: Number(body.discount || 0),
      image: images[0] || (body.image?.url ? body.image : undefined), images,
      category: category?._id || null, subcategory: subcategory?._id || null, brand: brand?._id || null,
      specifications: body.specifications || [], unit: body.unit || "", shipping: body.shipping || {},
      wholesalePrice: body.wholesalePrice === "" || body.wholesalePrice == null ? undefined : Number(body.wholesalePrice),
      paymentOption: body.paymentOption || "COD_ONLY", returnPolicy: body.returnPolicy || {},
      initialStock, currentStock: 0, quantity: Number(body.quantity ?? initialStock), lowStockAlert: Number(body.lowStockAlert || 0),
      createdBy: access.user._id, isActive: true, lifecycle: "scheduled", launchAt,
      featuredOnLaunch: body.featuredOnLaunch === true,
      preorder: {
        enabled: body.preorder?.enabled === true, startsAt, endsAt, limit: max, reserved: 0,
        expectedShipAt,
        terms: String(body.preorder?.terms || "").slice(0, 2000),
      },
    } });
    try {
      if (category) await Category.updateOne({ _id: category._id, isActive: true }, { $addToSet: { products: product._id } });
      if (subcategory) await Subcategory.updateOne({ _id: subcategory._id, isActive: true }, { $addToSet: { products: product._id } });
    } catch (relationError) {
      await Product.deleteOne({ _id: product._id });
      if (category) await Category.updateOne({ _id: category._id }, { $pull: { products: product._id } });
      if (subcategory) await Subcategory.updateOne({ _id: subcategory._id }, { $pull: { products: product._id } });
      throw relationError;
    }
    if (initialStock > 0) {
      try {
        await increaseStock({ productId: product._id, delta: initialStock, movementType: "INITIAL_STOCK", reason: "Initial stock on upcoming product creation", referenceType: "PRODUCT", referenceId: product._id, performedBy: access.user._id });
      } catch (stockError) {
        await Product.deleteOne({ _id: product._id });
        if (category) await Category.updateOne({ _id: category._id }, { $pull: { products: product._id } });
        if (subcategory) await Subcategory.updateOne({ _id: subcategory._id }, { $pull: { products: product._id } });
        throw stockError;
      }
    }
    return NextResponse.json({ success: true, product: { id: product._id.toString(), name: product.productName } }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ success: false, message: "That SKU is already in use." }, { status: 409 });
    if (error.name === "ValidationError" || error.name === "CastError") return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    logger.error("Create upcoming product failed", error);
    return NextResponse.json({ success: false, message: error.statusCode ? error.message : "Unable to create upcoming product." }, { status: error.statusCode || 500 });
  }
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/upcoming-products");
export const POST = withApiErrorHandling(POSTHandler, "POST /api/upcoming-products");
