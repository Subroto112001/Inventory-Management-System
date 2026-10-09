import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import Offer from "@/lib/models/Offer";
import { requirePermission } from "@/lib/authorization";
import { PERMISSIONS } from "@/lib/authorization";
import Brand from "@/lib/models/Brand";
import Category from "@/lib/models/Category";
import { parseProductSpecifications, sanitizeRichText, sanitizeSpecifications } from "@/lib/richText";
import { uploadImageToCloudinary, deleteCloudinaryFile } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function serializePublicProduct(product) {
  const imageRecords = Array.isArray(product.images) && product.images.length ? product.images : (product.image?.url ? [product.image] : []);
  return {
    id: product._id.toString(),
    name: product.productName,
    productName: product.productName,
    sku: product.productSKU,
    price: product.price,
    discount: product.discount || 0,
    image: product.image?.url || imageRecords[0]?.url || "",
    images: imageRecords.map((image) => image.url).filter(Boolean),
    description: sanitizeRichText(product.description || ""),
    specifications: sanitizeSpecifications(product.specifications || []),
    unit: product.unit || "",
    brand: product.brand?.brandName || product.brandName || "",
    category: product.category?.categoryName || "",
    shipping: product.shipping || null,
    paymentOption: product.paymentOption || "COD_ONLY",
    returnPolicy: product.returnPolicy || null,
    availability: product.currentStock > 0 ? "In Stock" : "Out of Stock",
    inStock: product.currentStock > 0,
    isActive: product.isActive,
  };
}

export async function GET(request, { params }) {
  try {
    const publicRead = new URL(request.url).searchParams.get("public") === "1";
    if (!publicRead) {
      const access = await requirePermission(
        request,
        PERMISSIONS.PRODUCTS_READ,
      );
      if (!access.ok) return access.response;
    }
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const product = await Product.findOne({
      _id: id,
      ...(publicRead ? { isActive: true } : {}),
    })
      .populate("brand", "brandName logo")
      .populate("category", "categoryName")
      .lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    if (publicRead) {
      return NextResponse.json({
        success: true,
        product: serializePublicProduct(product),
      });
    }

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
        { applyTo: "Specific Products", products: product._id },
      ],
    })
      .select(
        "offerName offerCode discountType discountValue maxDiscountAmount applyTo startDate endDate usageLimit usageCount",
      )
      .lean();

    return NextResponse.json(
      {
        success: true,
        product: {
          id: product._id.toString(),
          productName: product.productName,
          productSKU: product.productSKU,
          brandName: product.brandName || "",
          description: sanitizeRichText(product.description || ""),
          specifications: sanitizeSpecifications(product.specifications || []),
          unit: product.unit || "",
          price: product.price,
          wholesalePrice: product.wholesalePrice ?? "",
          discount: product.discount ?? 0,
          quantity: product.quantity ?? 0,
          initialStock: product.initialStock ?? 0,
          currentStock: product.currentStock ?? 0,
          lowStockAlert: product.lowStockAlert ?? 0,
          image: product.image?.url || product.images?.[0]?.url || "",
          images: (product.images?.length ? product.images : (product.image?.url ? [product.image] : [])).map((image) => image.url).filter(Boolean),
          imageRecords: product.images?.length ? product.images : (product.image?.url ? [product.image] : []),
          shipping: product.shipping || null,
          paymentOption: product.paymentOption || "COD_ONLY",
          returnPolicy: product.returnPolicy || null,
          isActive: product.isActive,
          offers: offers
            .filter(
              (offer) =>
                offer.startDate <= todayEnd &&
                offer.endDate >= todayStart &&
                (offer.usageLimit === undefined ||
                  offer.usageLimit === null ||
                  offer.usageCount < offer.usageLimit),
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
    const access = await requirePermission(
      request,
      PERMISSIONS.PRODUCTS_UPDATE,
    );
    if (!access.ok) return access.response;
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    const isMultipart = request.headers.get("content-type")?.includes("multipart/form-data");
    const formData = isMultipart ? await request.formData() : null;
    const body = formData ? Object.fromEntries(formData.entries()) : await request.json();
    const {
      productName,
      productSKU,
      price,
      brandName,
      unit,
      quantity,
      description,
      specifications,
      wholesalePrice,
      discount,
      initialStock,
      lowStockAlert,
      shippingCharge,
      deliveryEstimate,
      freeShipping,
      shippingInstructions,
      paymentOption,
      returnEligible,
      returnWindowDays,
      returnConditions,
      returnInstructions,
    } = body;

    if (!productName || !productSKU || price === undefined || price === "") {
      return NextResponse.json(
        { message: "Product name, SKU, and price are required!" },
        { status: 400 },
      );
    }

    const parsedInitialStock = Number(initialStock ?? 0);
    const parsedLowStockAlert = Number(lowStockAlert ?? 0);
    if (
      !Number.isInteger(parsedInitialStock) ||
      parsedInitialStock < 0 ||
      !Number.isInteger(parsedLowStockAlert) ||
      parsedLowStockAlert < 0
    ) {
      return NextResponse.json(
        { message: "Stock values must be non-negative whole numbers" },
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

    const previousImages = existingProduct.images?.length
      ? existingProduct.images.map((image) => ({ public_id: image.public_id || "", url: image.url }))
      : (existingProduct.image?.url ? [{ public_id: existingProduct.image.public_id || "", url: existingProduct.image.url }] : []);
    let retainedImages = previousImages;
    if (body.existingImages !== undefined) {
      let requestedImages;
      try { requestedImages = JSON.parse(body.existingImages || "[]"); } catch { return NextResponse.json({ message: "Invalid existing image selection." }, { status: 400 }); }
      if (!Array.isArray(requestedImages)) return NextResponse.json({ message: "Invalid existing image selection." }, { status: 400 });
      retainedImages = requestedImages.map((entry) => previousImages.find((image) => image.public_id === entry.public_id && image.url === entry.url)).filter(Boolean);
      if (retainedImages.length !== requestedImages.length) return NextResponse.json({ message: "An image selection is invalid." }, { status: 400 });
    }
    const newFiles = formData ? formData.getAll("images").filter((file) => file && typeof file !== "string" && file.size > 0) : [];
    if (retainedImages.length + newFiles.length > 4) return NextResponse.json({ message: "A product can have at most four images." }, { status: 400 });
    for (const file of newFiles) {
      if (!file.type?.startsWith("image/") || file.size > 5 * 1024 * 1024) return NextResponse.json({ message: file.size > 5 * 1024 * 1024 ? "Each image must be 5 MB or smaller." : "Only image files are allowed." }, { status: 400 });
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
    const sanitizedDescription = sanitizeRichText(description || "");
    if (sanitizedDescription.length > 20000) {
      return NextResponse.json(
        { success: false, message: "Product validation failed", errors: [{ field: "description", message: "Description cannot exceed 20000 characters." }] },
        { status: 400 },
      );
    }
    existingProduct.description = sanitizedDescription;
    if (specifications !== undefined) {
      const specificationResult = parseProductSpecifications(specifications);
      if (specificationResult.errors.length) {
        return NextResponse.json(
          { success: false, message: "Product validation failed", errors: specificationResult.errors },
          { status: 400 },
        );
      }
      existingProduct.specifications = specificationResult.value;
    }
    existingProduct.wholesalePrice =
      wholesalePrice === "" ? undefined : Number(wholesalePrice);
    existingProduct.discount = Number(discount) || 0;
    existingProduct.initialStock = parsedInitialStock;
    existingProduct.lowStockAlert = parsedLowStockAlert;
    const parsedShippingCharge = shippingCharge === undefined || shippingCharge === "" ? undefined : Number(shippingCharge);
    const parsedReturnWindow = returnWindowDays === undefined || returnWindowDays === "" ? undefined : Number(returnWindowDays);
    if ((parsedShippingCharge !== undefined && (!Number.isFinite(parsedShippingCharge) || parsedShippingCharge < 0)) || (parsedReturnWindow !== undefined && (!Number.isInteger(parsedReturnWindow) || parsedReturnWindow < 0 || parsedReturnWindow > 365))) return NextResponse.json({ message: "Shipping charge or return window is invalid." }, { status: 400 });
    if (returnEligible !== undefined && ![true, false, "true", "false", ""].includes(returnEligible)) return NextResponse.json({ message: "Return eligibility is invalid." }, { status: 400 });
    if (paymentOption !== undefined && !["COD_ONLY", "ONLINE_ONLY", "BOTH"].includes(paymentOption)) return NextResponse.json({ message: "Select a valid product payment option." }, { status: 400 });
    const uploadedImages = await Promise.all(newFiles.map((file) => uploadImageToCloudinary(file, "products")));
    const nextImages = [...retainedImages, ...uploadedImages.map((image) => ({ public_id: image.publicId, url: image.url }))];
    if (body.existingImages !== undefined || newFiles.length) {
      existingProduct.images = nextImages;
      existingProduct.image = nextImages[0] || undefined;
    }
    if ([shippingCharge, deliveryEstimate, freeShipping, shippingInstructions].some((value) => value !== undefined)) {
      const hasFreeShipping = freeShipping === true || freeShipping === "true";
      existingProduct.shipping = { charge: hasFreeShipping ? 0 : parsedShippingCharge, deliveryEstimate: String(deliveryEstimate || "").trim(), freeShipping: hasFreeShipping, instructions: String(shippingInstructions || "").trim() };
    }
    if (paymentOption !== undefined) existingProduct.paymentOption = paymentOption;
    if ([returnEligible, returnWindowDays, returnConditions, returnInstructions].some((value) => value !== undefined)) existingProduct.returnPolicy = { eligible: returnEligible === undefined || returnEligible === "" ? undefined : returnEligible === true || returnEligible === "true", windowDays: parsedReturnWindow, conditions: String(returnConditions || "").trim(), instructions: String(returnInstructions || "").trim() };
    // note: currentStock ইচ্ছাকৃতভাবে এখানে টাচ করা হয়নি —
    // এটা initialStock এডিট করলে বদলানো উচিত না, বরং stock adjustment API দিয়ে বদলানো উচিত

    await existingProduct.save();
    const retainedIds = new Set(nextImages.map((image) => image.public_id).filter(Boolean));
    for (const image of previousImages) if (image.public_id && !retainedIds.has(image.public_id)) deleteCloudinaryFile(image.public_id).catch(() => {});

    return NextResponse.json(
      {
        message: "Product updated successfully!",
        success: true,
        product: {
          id: existingProduct._id.toString(),
          productName: existingProduct.productName,
          productSKU: existingProduct.productSKU,
          price: existingProduct.price,
          image: existingProduct.image || null,
          images: (existingProduct.images || []).map((image) => image.url),
          shipping: existingProduct.shipping || null,
          paymentOption: existingProduct.paymentOption || "COD_ONLY",
          returnPolicy: existingProduct.returnPolicy || null,
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
    const access = await requirePermission(
      request,
      PERMISSIONS.PRODUCTS_DELETE,
    );
    if (!access.ok) return access.response;
    const { id } = await params;
    const productId = id?.trim();

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const deletedProduct = await Product.findByIdAndDelete(productId);
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
