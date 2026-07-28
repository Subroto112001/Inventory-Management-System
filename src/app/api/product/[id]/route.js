import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        product: {
          id: product._id.toString(),
          productName: product.productName,
          productSKU: product.productSKU,
          brandName: product.brandName || "",
          description: product.description || "",
          unit: product.unit || "",
          price: product.price,
          wholesalePrice: product.wholesalePrice ?? "",
          discount: product.discount ?? 0,
          quantity: product.quantity ?? 0,
          initialStock: product.initialStock ?? 0,
          currentStock: product.currentStock ?? 0,
          lowStockAlert: product.lowStockAlert ?? 0,
          image: product.image?.url || "",
          isActive: product.isActive,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Product API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      productName,
      productSKU,
      price,
      brandName,
      unit,
      quantity,
      description,
      wholesalePrice,
      discount,
      initialStock,
      lowStockAlert,
    } = body;

    if (!productName || !productSKU || price === undefined || price === "") {
      return NextResponse.json(
        { message: "Product name, SKU, and price are required!" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // SKU পরিবর্তন হলে, অন্য প্রোডাক্টের সাথে duplicate কিনা চেক
    const normalizedSKU = productSKU.toUpperCase();
    if (normalizedSKU !== existingProduct.productSKU) {
      const skuTaken = await Product.findOne({
        productSKU: normalizedSKU,
        _id: { $ne: id },
      });
      if (skuTaken) {
        return NextResponse.json(
          { message: "A product with this SKU already exists!" },
          { status: 409 },
        );
      }
    }

    existingProduct.productName = productName;
    existingProduct.productSKU = normalizedSKU;
    existingProduct.price = Number(price);
    existingProduct.brandName = brandName;
    existingProduct.unit = unit;
    existingProduct.quantity = Number(quantity) || 0;
    existingProduct.description = description;
    existingProduct.wholesalePrice =
      wholesalePrice === "" ? undefined : Number(wholesalePrice);
    existingProduct.discount = Number(discount) || 0;
    existingProduct.initialStock = Number(initialStock) || 0;
    existingProduct.lowStockAlert = Number(lowStockAlert) || 0;
    // note: currentStock ইচ্ছাকৃতভাবে এখানে টাচ করা হয়নি —
    // এটা initialStock এডিট করলে বদলানো উচিত না, বরং stock adjustment API দিয়ে বদলানো উচিত

    await existingProduct.save();

    return NextResponse.json(
      {
        message: "Product updated successfully!",
        success: true,
        product: {
          id: existingProduct._id.toString(),
          productName: existingProduct.productName,
          productSKU: existingProduct.productSKU,
          price: existingProduct.price,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Product API Error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { message: messages.join(", ") },
        { status: 400 },
      );
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A product with this SKU already exists!" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully!", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Product API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
