import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import Offer from "@/lib/models/Offer";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    if (!(await requireAuth(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const productIds = products.map((product) => product._id);
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart },
      $or: [
        { applyTo: "All Products" },
        { applyTo: "Specific Products", products: { $in: productIds } },
      ],
    })
      .select(
        "offerName offerCode discountType discountValue maxDiscountAmount applyTo products startDate endDate usageLimit usageCount",
      )
      .lean();

    const usableOffers = offers.filter(
      (offer) =>
        offer.startDate <= todayEnd &&
        offer.endDate >= todayStart &&
        (offer.usageLimit === undefined ||
          offer.usageLimit === null ||
          offer.usageCount < offer.usageLimit),
    );

    const result = products.map((p) => ({
      id: p._id.toString(),
      productName: p.productName,
      productSKU: p.productSKU,
      brandName: p.brandName || "",
      description: p.description || "",
      unit: p.unit || "",
      price: p.price,
      wholesalePrice: p.wholesalePrice ?? "",
      discount: p.discount ?? 0,
      quantity: p.quantity ?? 0,
      initialStock: p.initialStock ?? 0,
      currentStock: p.currentStock ?? 0,
      lowStockAlert: p.lowStockAlert ?? 0,
      image: p.image?.url || "",
      isActive: p.isActive,
      offers: usableOffers
        .filter(
          (offer) =>
            offer.applyTo === "All Products" ||
            offer.products.some((productId) => productId.equals(p._id)),
        )
        .map((offer) => ({
          id: offer._id.toString(),
          offerName: offer.offerName,
          offerCode: offer.offerCode || "",
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          maxDiscountAmount: offer.maxDiscountAmount ?? null,
          applyTo: offer.applyTo,
          startDate: offer.startDate,
          endDate: offer.endDate,
        })),
    }));

    return NextResponse.json(
      { success: true, products: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Products API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    if (!(await requireAuth(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
      // imageUrl, // TODO: ইমেজ আপলোড সার্ভিস কানেক্ট হলে এখানে যোগ হবে
    } = body;

    if (!productName || !productSKU || price === undefined || price === "") {
      return NextResponse.json(
        { message: "Product name, SKU, and price are required!" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const existingProduct = await Product.findOne({
      productSKU: productSKU.toUpperCase(),
    });
    if (existingProduct) {
      return NextResponse.json(
        { message: "A product with this SKU already exists!" },
        { status: 409 },
      );
    }

    const parsedInitialStock = Number(initialStock) || 0;

    const newProduct = await Product.create({
      productName,
      productSKU,
      price: Number(price),
      brandName,
      unit,
      quantity: Number(quantity) || 0,
      description,
      wholesalePrice:
        wholesalePrice === "" ? undefined : Number(wholesalePrice),
      discount: Number(discount) || 0,
      initialStock: parsedInitialStock,
      currentStock: parsedInitialStock, // তৈরির সময় currentStock = initialStock
      lowStockAlert: Number(lowStockAlert) || 0,
      // image: imageUrl ? { url: imageUrl } : undefined,
    });

    return NextResponse.json(
      {
        message: "Product published successfully!",
        success: true,
        product: {
          id: newProduct._id.toString(),
          productName: newProduct.productName,
          productSKU: newProduct.productSKU,
          price: newProduct.price,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add Product API Error:", error);

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
