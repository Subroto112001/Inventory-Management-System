import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import Offer from "@/lib/models/Offer";
import { requireAuth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// =========================
// GET PRODUCTS
// =========================
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
        {
          applyTo: "Specific Products",
          products: { $in: productIds },
        },
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

      // Cloudinary image
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
      {
        success: true,
        products: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Products API Error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// =========================
// POST PRODUCT
// =========================
export async function POST(request) {
  try {
    // -------------------------
    // Authentication
    // -------------------------
    if (!(await requireAuth(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // -------------------------
    // Read FormData
    // -------------------------
    const formData = await request.formData();

    const productName = formData.get("productName");
    const productSKU = formData.get("productSKU");
    const price = formData.get("price");
    const brandName = formData.get("brandName");
    const unit = formData.get("unit");
    const quantity = formData.get("quantity");
    const description = formData.get("description");
    const wholesalePrice = formData.get("wholesalePrice");
    const discount = formData.get("discount");
    const initialStock = formData.get("initialStock");
    const lowStockAlert = formData.get("lowStockAlert");

    // Image from FormData
    const image = formData.get("image");

    // -------------------------
    // Required fields
    // -------------------------
    if (!productName || !productSKU || price === null || price === "") {
      return NextResponse.json(
        {
          message: "Product name, SKU, and price are required!",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // Validate image
    // -------------------------
    if (image && typeof image !== "string") {
      if (!image.type?.startsWith("image/")) {
        return NextResponse.json(
          {
            message: "Only image files are allowed!",
          },
          { status: 400 },
        );
      }
    }

    await connectMongoDB();

    // -------------------------
    // Check duplicate SKU
    // -------------------------
    const normalizedSKU = productSKU.toUpperCase();

    const existingProduct = await Product.findOne({
      productSKU: normalizedSKU,
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          message: "A product with this SKU already exists!",
        },
        { status: 409 },
      );
    }

    // -------------------------
    // Upload image
    // -------------------------
    let uploadedImage = null;

    if (image && typeof image !== "string" && image.size > 0) {
      uploadedImage = await uploadImageToCloudinary(image, "products");
    }

    // -------------------------
    // Stock
    // -------------------------
    const parsedInitialStock = Number(initialStock) || 0;

    // -------------------------
    // Create Product
    // -------------------------
    const newProduct = await Product.create({
      productName: productName.trim(),

      productSKU: normalizedSKU,

      price: Number(price),

      brandName: brandName || "",

      unit: unit || "",

      quantity: Number(quantity) || 0,

      description: description || "",

      wholesalePrice:
        wholesalePrice === "" || wholesalePrice === null
          ? undefined
          : Number(wholesalePrice),

      discount: Number(discount) || 0,

      initialStock: parsedInitialStock,

      currentStock: parsedInitialStock,

      lowStockAlert: Number(lowStockAlert) || 0,

      // Cloudinary
      image: uploadedImage
        ? {
            public_id: uploadedImage.publicId,
            url: uploadedImage.url,
          }
        : undefined,
    });

    // -------------------------
    // Response
    // -------------------------
    return NextResponse.json(
      {
        message: "Product published successfully!",
        success: true,

        product: {
          id: newProduct._id.toString(),
          productName: newProduct.productName,
          productSKU: newProduct.productSKU,
          price: newProduct.price,

          image: newProduct.image
            ? {
                public_id: newProduct.image.public_id,
                url: newProduct.image.url,
              }
            : null,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add Product API Error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return NextResponse.json(
        {
          message: messages.join(", "),
        },
        { status: 400 },
      );
    }

    // Duplicate SKU
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "A product with this SKU already exists!",
        },
        { status: 409 },
      );
    }

    if (error.statusCode === 403) {
      return NextResponse.json(
        {
          message:
            "Cloudinary rejected the upload because this API key lacks upload permission. Update the key permissions or use an upload-enabled key.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
