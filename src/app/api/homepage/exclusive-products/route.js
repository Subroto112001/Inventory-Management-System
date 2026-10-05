import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import ExclusiveProduct from "@/lib/models/ExclusiveProduct";
import Product from "@/lib/models/Product";
import { PERMISSIONS, requirePermission } from "@/lib/authorization";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const parseRequestObject = async (request) => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
};

const serializePublicProduct = (product) => ({
  id: product._id.toString(),
  name: product.productName,
  productName: product.productName,
  sku: product.productSKU,
  price: product.price,
  discount: product.discount || 0,
  image: product.image?.url || "",
  category: product.category?.categoryName || "",
  brand: product.brand?.brandName || "",
  availability: product.currentStock > 0 ? "In Stock" : "Out of Stock",
  inStock: product.currentStock > 0,
  isActive: product.isActive,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminRequest = searchParams.get("admin") === "1";
    const publicRead =
      searchParams.get("public") === "1" || searchParams.get("active") === "1";

    if (adminRequest) {
      const access = await requirePermission(
        request,
        PERMISSIONS.HOMEPAGE_MANAGE,
      );
      if (!access.ok) return access.response;
    }

    await connectMongoDB();
    const filter = publicRead ? { isActive: true } : {};

    const assignments = await ExclusiveProduct.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate({
        path: "productId",
        populate: [
          { path: "brand", select: "brandName" },
          { path: "category", select: "categoryName" },
        ],
      })
      .lean();

    const items = assignments
      .map((assignment) => {
        const product = assignment.productId;
        if (!product || !product.isActive) return null;

        return {
          id: assignment._id.toString(),
          productId: product._id.toString(),
          displayOrder: assignment.displayOrder ?? 0,
          isActive: assignment.isActive,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt,
          product: serializePublicProduct(product),
        };
      })
      .filter(Boolean);

    return NextResponse.json({ success: true, items, total: items.length });
  } catch (error) {
    console.error("Exclusive products fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load exclusive products" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const access = await requirePermission(
      request,
      PERMISSIONS.HOMEPAGE_MANAGE,
    );
    if (!access.ok) return access.response;

    const payload = await parseRequestObject(request);
    const productId = String(payload.productId || payload.id || "").trim();
    const displayOrder = Number(payload.displayOrder ?? 0);

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: "A valid product id is required" },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const product = await Product.findById(productId).lean();
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Product not found or unavailable" },
        { status: 404 },
      );
    }

    const exists = await ExclusiveProduct.findOne({ productId });
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "This product is already listed as exclusive",
        },
        { status: 409 },
      );
    }

    const assignment = await ExclusiveProduct.create({
      productId,
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
      isActive:
        payload.isActive === undefined
          ? true
          : payload.isActive === true || payload.isActive === "true",
    });

    return NextResponse.json(
      {
        success: true,
        item: {
          id: assignment._id.toString(),
          productId,
          displayOrder: assignment.displayOrder,
          isActive: assignment.isActive,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create exclusive product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to add exclusive product",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const access = await requirePermission(
      request,
      PERMISSIONS.HOMEPAGE_MANAGE,
    );
    if (!access.ok) return access.response;

    const payload = await parseRequestObject(request);
    const assignmentId = String(payload.id || payload._id || "").trim();

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, message: "Assignment id is required" },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const assignment = await ExclusiveProduct.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Exclusive product assignment not found" },
        { status: 404 },
      );
    }

    if (payload.productId) {
      const productId = String(payload.productId).trim();
      if (!mongoose.isValidObjectId(productId)) {
        return NextResponse.json(
          { success: false, message: "Invalid product id" },
          { status: 400 },
        );
      }

      const existing = await ExclusiveProduct.findOne({
        productId,
        _id: { $ne: assignmentId },
      });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "That product is already assigned as exclusive",
          },
          { status: 409 },
        );
      }

      const product = await Product.findById(productId).lean();
      if (!product || !product.isActive) {
        return NextResponse.json(
          { success: false, message: "Product not found or unavailable" },
          { status: 404 },
        );
      }

      assignment.productId = productId;
    }

    if (payload.displayOrder !== undefined) {
      assignment.displayOrder = Number(payload.displayOrder) || 0;
    }

    if (payload.isActive !== undefined) {
      assignment.isActive =
        payload.isActive === true || payload.isActive === "true";
    }

    await assignment.save();

    return NextResponse.json({
      success: true,
      item: {
        id: assignment._id.toString(),
        productId: assignment.productId.toString(),
        displayOrder: assignment.displayOrder,
        isActive: assignment.isActive,
      },
    });
  } catch (error) {
    console.error("Update exclusive product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to update exclusive product",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const access = await requirePermission(
      request,
      PERMISSIONS.HOMEPAGE_MANAGE,
    );
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const payload = await parseRequestObject(request).catch(() => ({}));
      const assignmentId = String(payload.id || payload._id || "").trim();
      if (!assignmentId) {
        return NextResponse.json(
          { success: false, message: "Assignment id is required" },
          { status: 400 },
        );
      }

      const deleted = await ExclusiveProduct.findByIdAndDelete(assignmentId);
      return NextResponse.json({
        success: !!deleted,
        message: deleted
          ? "Exclusive product removed"
          : "Exclusive product not found",
      });
    }

    const deleted = await ExclusiveProduct.findByIdAndDelete(id);
    return NextResponse.json({
      success: !!deleted,
      message: deleted
        ? "Exclusive product removed"
        : "Exclusive product not found",
    });
  } catch (error) {
    console.error("Delete exclusive product error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to remove exclusive product" },
      { status: 500 },
    );
  }
}
