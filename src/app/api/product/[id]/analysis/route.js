import { logger } from "@/lib/serverLogger";
import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import ProductAnalysis from "@/lib/models/ProductAnalysis";
import { PERMISSIONS, requirePermission } from "@/lib/authorization";
import { buildProductInfographic, getProductImageUrls, normalizeAnalysisPayload } from "@/lib/productAnalysis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const responseAnalysis = (analysis) => ({
  id: analysis._id.toString(),
  productId: analysis.product.toString(),
  sourceImage: analysis.sourceImage,
  summary: analysis.summary,
  annotations: analysis.annotations,
  infographicSvg: analysis.infographicSvg || "",
  status: analysis.status,
  publishedAt: analysis.publishedAt,
  updatedAt: analysis.updatedAt,
});

async function getProduct(id, publicRead = false) {
  return Product.findOne({
    _id: id,
    ...(publicRead ? { isActive: true } : {}),
  })
    .populate("brand", "brandName")
    .populate("category", "categoryName")
    .lean();
}

async function GETHandler(request, { params }) {
  try {
    const publicRead = new URL(request.url).searchParams.get("public") === "1";
    if (!publicRead) {
      const access = await requirePermission(request, PERMISSIONS.PRODUCTS_READ);
      if (!access.ok) return access.response;
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
    }
    await connectMongoDB();
    const product = await getProduct(id, publicRead);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    const analysis = await ProductAnalysis.findOne({
      product: id,
      ...(publicRead ? { status: "published" } : {}),
    }).lean();
    if (!analysis || (publicRead && !analysis.infographicSvg)) {
      return NextResponse.json({ success: true, analysis: null });
    }
    return NextResponse.json({ success: true, analysis: responseAnalysis(analysis) });
  } catch (error) {
    logger.error("Product analysis fetch error:", error);
    return NextResponse.json({ success: false, message: "Unable to load product analysis" }, { status: 500 });
  }
}

async function PUTHandler(request, { params }) {
  try {
    const access = await requirePermission(request, PERMISSIONS.PRODUCTS_UPDATE);
    if (!access.ok) return access.response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
    }
    const payload = await request.json();
    await connectMongoDB();
    const product = await getProduct(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    const normalized = normalizeAnalysisPayload(payload, product);
    if (normalized.error) {
      return NextResponse.json({ success: false, message: normalized.error }, { status: 400 });
    }

    const analysis = await ProductAnalysis.findOneAndUpdate(
      { product: id },
      {
        $set: {
          ...normalized.value,
          status: "draft",
          publishedAt: null,
          infographicSvg: "",
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return NextResponse.json({ success: true, analysis: responseAnalysis(analysis) });
  } catch (error) {
    logger.error("Product analysis draft save error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "An analysis already exists for this product. Reload and try again." }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message || "Unable to save analysis draft" }, { status: 500 });
  }
}

async function POSTHandler(request, { params }) {
  try {
    const access = await requirePermission(request, PERMISSIONS.PRODUCTS_UPDATE);
    if (!access.ok) return access.response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
    }
    await connectMongoDB();
    const [product, analysis] = await Promise.all([
      getProduct(id),
      ProductAnalysis.findOne({ product: id }),
    ]);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    if (!analysis) {
      return NextResponse.json({ success: false, message: "Save an analysis draft before generating its infographic" }, { status: 409 });
    }
    if (!getProductImageUrls(product).includes(analysis.sourceImage)) {
      return NextResponse.json({ success: false, message: "The selected source image is no longer part of this product" }, { status: 400 });
    }
    analysis.infographicSvg = buildProductInfographic({
      product,
      sourceImage: analysis.sourceImage,
      summary: analysis.summary,
      annotations: analysis.annotations,
    });
    analysis.status = "draft";
    analysis.publishedAt = null;
    await analysis.save();
    return NextResponse.json({ success: true, analysis: responseAnalysis(analysis) });
  } catch (error) {
    logger.error("Product infographic generation error:", error);
    return NextResponse.json({ success: false, message: error.message || "Unable to generate infographic" }, { status: 500 });
  }
}

async function PATCHHandler(request, { params }) {
  try {
    const access = await requirePermission(request, PERMISSIONS.PRODUCTS_UPDATE);
    if (!access.ok) return access.response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
    }
    const { status } = await request.json();
    if (!["draft", "published"].includes(status)) {
      return NextResponse.json({ success: false, message: "Status must be draft or published" }, { status: 400 });
    }
    await connectMongoDB();
    const analysis = await ProductAnalysis.findOne({ product: id });
    if (!analysis) {
      return NextResponse.json({ success: false, message: "Save an analysis draft first" }, { status: 404 });
    }
    if (status === "published") {
      if (!analysis.summary || !analysis.annotations.length || !analysis.annotations.every((item) => item.verified)) {
        return NextResponse.json({ success: false, message: "Add a summary and verify every annotation before publishing" }, { status: 400 });
      }
      if (!analysis.infographicSvg) {
        return NextResponse.json({ success: false, message: "Generate the infographic before publishing" }, { status: 409 });
      }
      analysis.publishedAt = new Date();
    } else {
      analysis.publishedAt = null;
    }
    analysis.status = status;
    await analysis.save();
    return NextResponse.json({ success: true, analysis: responseAnalysis(analysis) });
  } catch (error) {
    logger.error("Product analysis publication error:", error);
    return NextResponse.json({ success: false, message: "Unable to update product analysis status" }, { status: 500 });
  }
}

async function DELETEHandler(request, { params }) {
  try {
    const access = await requirePermission(request, PERMISSIONS.PRODUCTS_UPDATE);
    if (!access.ok) return access.response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
    }
    await connectMongoDB();
    const deleted = await ProductAnalysis.findOneAndDelete({ product: id });
    return NextResponse.json({ success: true, removed: Boolean(deleted) });
  } catch (error) {
    logger.error("Product analysis removal error:", error);
    return NextResponse.json({ success: false, message: "Unable to remove product analysis" }, { status: 500 });
  }
}

export const GET = withApiErrorHandling(GETHandler, "GET /api/product/[id]/analysis");
export const PUT = withApiErrorHandling(PUTHandler, "PUT /api/product/[id]/analysis");
export const POST = withApiErrorHandling(POSTHandler, "POST /api/product/[id]/analysis");
export const PATCH = withApiErrorHandling(PATCHHandler, "PATCH /api/product/[id]/analysis");
export const DELETE = withApiErrorHandling(DELETEHandler, "DELETE /api/product/[id]/analysis");
