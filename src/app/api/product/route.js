import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import Offer from "@/lib/models/Offer";
import Brand from "@/lib/models/Brand";
import Category from "@/lib/models/Category";
import { requirePermission } from "@/lib/authorization";
import { PERMISSIONS } from "@/lib/authorization";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";
import { increaseStock } from "@/lib/inventory/stockService";
import { parseProductSpecifications, sanitizeRichText, sanitizeSpecifications } from "@/lib/richText";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function serializePublicProduct(product) {
  const imageRecords = Array.isArray(product.images) && product.images.length
    ? product.images
    : (product.image?.url ? [product.image] : []);
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
    createdAt: product.createdAt,
  };
}

// =========================
// GET PRODUCTS
// =========================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicRead = searchParams.get("public") === "1";

    if (publicRead) {
      await connectMongoDB();

      const page = Math.max(Number(searchParams.get("page")) || 1, 1);
      const limit = Math.min(
        Math.max(Number(searchParams.get("limit")) || 12, 1),
        48,
      );
      const search = searchParams.get("search")?.trim();
      const category = searchParams.get("category")?.trim();
      const brand = searchParams.get("brand")?.trim();
      const availability = searchParams.get("availability") === "in-stock";
      const sort = searchParams.get("sort") || "newest";
      const filter = { isActive: true };

      if (search) {
        filter.$or = [
          { productName: { $regex: search, $options: "i" } },
          { productSKU: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      if (availability) filter.currentStock = { $gt: 0 };
      if (category) {
        const categoryFilter = /^[a-f\d]{24}$/i.test(category)
          ? { _id: category }
          : {
              categoryName: {
                $regex: `^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
              },
            };
        const categoryDoc = await Category.findOne(categoryFilter)
          .select("_id")
          .lean();
        if (!categoryDoc)
          return NextResponse.json({
            success: true,
            products: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
          });
        filter.category = categoryDoc._id;
      }
      if (brand) {
        const brandFilter = /^[a-f\d]{24}$/i.test(brand)
          ? { _id: brand }
          : {
              brandName: {
                $regex: `^${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
              },
            };
        const brandDoc = await Brand.findOne(brandFilter).select("_id").lean();
        if (!brandDoc)
          return NextResponse.json({
            success: true,
            products: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
          });
        filter.brand = brandDoc._id;
      }

      const sortMap = {
        newest: { createdAt: -1 },
        priceAsc: { price: 1 },
        priceDesc: { price: -1 },
      };
      const [products, total] = await Promise.all([
        Product.find(filter)
          .populate("brand", "brandName logo")
          .populate("category", "categoryName")
          .sort(sortMap[sort] || sortMap.newest)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      return NextResponse.json({
        success: true,
        products: products.map(serializePublicProduct),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    const access = await requirePermission(request, PERMISSIONS.PRODUCTS_READ);
    if (!access.ok) return access.response;

    await connectMongoDB();

    const products = await Product.find()
      .populate("brand", "brandName")
      .populate("category", "categoryName categoryCode")
      .sort({ createdAt: -1 })
      .lean();

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
      brandName: p.brand?.brandName || p.brandName || "",
      description: sanitizeRichText(p.description || ""),
      specifications: sanitizeSpecifications(p.specifications || []),
      unit: p.unit || "",
      price: p.price,
      wholesalePrice: p.wholesalePrice ?? "",
      discount: p.discount ?? 0,
      quantity: p.quantity ?? 0,
      initialStock: p.initialStock ?? 0,
      currentStock: p.currentStock ?? 0,
      lowStockAlert: p.lowStockAlert ?? 0,

      // Category
      categoryId: p.category?._id ? p.category._id.toString() : "",
      categoryName: p.category?.categoryName || "",
      category: p.category?._id
        ? {
            id: p.category._id.toString(),
            categoryName: p.category.categoryName,
            categoryCode: p.category.categoryCode,
          }
        : null,

      // Cloudinary image
      image: p.image?.url || p.images?.[0]?.url || "",
      images: (p.images?.length ? p.images : (p.image?.url ? [p.image] : [])).map((image) => image.url).filter(Boolean),
      shipping: p.shipping || null,
      paymentOption: p.paymentOption || "COD_ONLY",
      returnPolicy: p.returnPolicy || null,

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
    const access = await requirePermission(
      request,
      PERMISSIONS.PRODUCTS_CREATE,
    );
    if (!access.ok) return access.response;

    // -------------------------
    // Read FormData
    // -------------------------
    const formData = await request.formData();

    const productName = formData.get("productName");
    const productSKU = formData.get("productSKU");
    const price = formData.get("price");
    const brandId = formData.get("brand")?.toString().trim();
    const unit = formData.get("unit");
    const quantity = formData.get("quantity");
    const description = sanitizeRichText(formData.get("description")?.toString() || "");
    const specificationResult = parseProductSpecifications(formData.get("specifications")?.toString() ?? "");
    if (description.length > 20000) {
      return NextResponse.json(
        { success: false, message: "Product validation failed", errors: [{ field: "description", message: "Description cannot exceed 20000 characters." }] },
        { status: 400 },
      );
    }
    if (specificationResult.errors.length) {
      return NextResponse.json(
        { success: false, message: "Product validation failed", errors: specificationResult.errors },
        { status: 400 },
      );
    }
    const specifications = specificationResult.value;
    const wholesalePrice = formData.get("wholesalePrice");
    const discount = formData.get("discount");
    const initialStock = formData.get("initialStock");
    const lowStockAlert = formData.get("lowStockAlert");

    // Category (required) — the selected category's _id
    const categoryId = formData.get("category")?.toString().trim();

    // Image from FormData
    const legacyImage = formData.get("image");
    const imageFiles = [...formData.getAll("images"), ...(legacyImage && typeof legacyImage !== "string" && legacyImage.size > 0 ? [legacyImage] : [])];
    const shippingCharge = formData.get("shippingCharge");
    const deliveryEstimate = formData.get("deliveryEstimate")?.toString().trim() || "";
    const freeShipping = formData.get("freeShipping") === "true";
    const shippingInstructions = formData.get("shippingInstructions")?.toString().trim() || "";
    const paymentOption = formData.get("paymentOption")?.toString() || "COD_ONLY";
    const returnEligibleRaw = formData.get("returnEligible");
    const returnWindowRaw = formData.get("returnWindowDays");
    const returnConditions = formData.get("returnConditions")?.toString().trim() || "";
    const returnInstructions = formData.get("returnInstructions")?.toString().trim() || "";

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

    if (!categoryId) {
      return NextResponse.json(
        { message: "Please select a category for this product!" },
        { status: 400 },
      );
    }

    if (!brandId) {
      return NextResponse.json(
        { message: "Please select a brand for this product!" },
        { status: 400 },
      );
    }

    if (!mongoose.isValidObjectId(brandId)) {
      return NextResponse.json(
        { message: "Invalid brand selected!" },
        { status: 400 },
      );
    }

    if (!mongoose.isValidObjectId(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category selected!" },
        { status: 400 },
      );
    }

    // -------------------------
    // Validate image
    // -------------------------
    if (imageFiles.length > 4) {
      return NextResponse.json({ message: "A product can have at most four images." }, { status: 400 });
    }
    for (const image of imageFiles) {
      if (!image.type?.startsWith("image/") || image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: image.size > 5 * 1024 * 1024 ? "Each image must be 5 MB or smaller." : "Only image files are allowed!" },
          { status: 400 },
        );
      }
    }
    const parsedShipping = shippingCharge === null || shippingCharge === "" ? undefined : Number(shippingCharge);
    const parsedReturnWindow = returnWindowRaw === null || returnWindowRaw === "" ? undefined : Number(returnWindowRaw);
    if ((parsedShipping !== undefined && (!Number.isFinite(parsedShipping) || parsedShipping < 0)) || (parsedReturnWindow !== undefined && (!Number.isInteger(parsedReturnWindow) || parsedReturnWindow < 0 || parsedReturnWindow > 365))) {
      return NextResponse.json({ message: "Shipping charge or return window is invalid." }, { status: 400 });
    }
    if (returnEligibleRaw !== null && !["true", "false", ""].includes(returnEligibleRaw.toString())) {
      return NextResponse.json({ message: "Return eligibility is invalid." }, { status: 400 });
    }
    if (!["COD_ONLY", "ONLINE_ONLY", "BOTH"].includes(paymentOption)) {
      return NextResponse.json({ message: "Select a valid product payment option." }, { status: 400 });
    }

    await connectMongoDB();

    // -------------------------
    // Validate category exists
    // -------------------------
    const categoryDoc = await Category.findById(categoryId)
      .select("_id isActive")
      .lean();

    if (!categoryDoc) {
      return NextResponse.json(
        { message: "Selected category was not found!" },
        { status: 404 },
      );
    }

    if (categoryDoc.isActive === false) {
      return NextResponse.json(
        { message: "Selected category is inactive!" },
        { status: 400 },
      );
    }

    const brandDoc = await Brand.findById(brandId).select("_id brandName").lean();
    if (!brandDoc) {
      return NextResponse.json(
        { message: "Selected brand was not found!" },
        { status: 404 },
      );
    }

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
    const uploadedImages = await Promise.all(imageFiles.map((file) => uploadImageToCloudinary(file, "products")));
    const imageRecords = uploadedImages.map((image) => ({ public_id: image.publicId, url: image.url }));

    // -------------------------
    // Stock
    // -------------------------
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

    // -------------------------
    // Create Product
    // -------------------------
    const newProduct = await Product.create({
      productName: productName.trim(),

      productSKU: normalizedSKU,

      price: Number(price),

      brand: brandDoc._id,

      unit: unit || "",

      quantity: Number(quantity) || 0,

      description,
      specifications,

      wholesalePrice:
        wholesalePrice === "" || wholesalePrice === null
          ? undefined
          : Number(wholesalePrice),

      discount: Number(discount) || 0,

      initialStock: parsedInitialStock,

      currentStock: 0,

      lowStockAlert: parsedLowStockAlert,

      // Category
      category: categoryDoc._id,

      // Cloudinary
      image: imageRecords[0],
      images: imageRecords,
      shipping: {
        charge: freeShipping ? 0 : parsedShipping,
        deliveryEstimate,
        freeShipping,
        instructions: shippingInstructions,
      },
      paymentOption,
      returnPolicy: {
        eligible: returnEligibleRaw === null || returnEligibleRaw === "" ? undefined : returnEligibleRaw === "true",
        windowDays: parsedReturnWindow,
        conditions: returnConditions,
        instructions: returnInstructions,
      },
      createdBy: access.user._id,
    });

    // -------------------------
    // Add product to Category.products
    // -------------------------
    try {
      await Category.updateOne(
        { _id: categoryDoc._id },
        { $addToSet: { products: newProduct._id } },
      );
    } catch (categoryError) {
      await Product.deleteOne({ _id: newProduct._id });
      throw categoryError;
    }

    if (parsedInitialStock > 0) {
      try {
        await increaseStock({
          productId: newProduct._id,
          delta: parsedInitialStock,
          movementType: "INITIAL_STOCK",
          reason: "Initial stock on product creation",
          referenceType: "PRODUCT",
          referenceId: newProduct._id,
          performedBy: access.user._id,
        });
      } catch (stockError) {
        await Product.deleteOne({ _id: newProduct._id });
        await Category.updateOne(
          { _id: categoryDoc._id },
          { $pull: { products: newProduct._id } },
        );
        throw stockError;
      }
    }

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
          categoryId: categoryDoc._id.toString(),

          image: newProduct.image || null,
          images: imageRecords.map((image) => image.url),
          shipping: newProduct.shipping,
          paymentOption: newProduct.paymentOption || "COD_ONLY",
          returnPolicy: newProduct.returnPolicy,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add Product API Error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Product validation failed",
          errors: Object.entries(error.errors).map(([field, validationError]) => ({
            field,
            message: validationError.message,
          })),
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
