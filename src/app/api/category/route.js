import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import { requireAuth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// =====================================================
// GET CATEGORIES
// =====================================================
export async function GET(request) {
  try {
    // -------------------------
    // Authentication
    // -------------------------
    if (!(await requireAuth(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // -------------------------
    // Connect Database
    // -------------------------
    await connectMongoDB();

    // -------------------------
    // Get Categories
    // -------------------------
    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    // -------------------------
    // Get Products
    // -------------------------
    const products = await Product.find()
      .select(
        "_id productName productSKU price quantity currentStock image category isActive",
      )
      .sort({ createdAt: -1 })
      .lean();

    // -------------------------
    // Prepare Response
    // -------------------------
    const result = categories.map((category) => {
      const categoryProducts = products.filter(
        (product) =>
          product.category &&
          product.category.toString() === category._id.toString(),
      );

      return {
        id: category._id.toString(),

        categoryName: category.categoryName,

        categoryCode: category.categoryCode,

        description: category.description || "",

        // Cloudinary image
        image: category.image?.url || "",

        isActive: category.isActive,

        // Products
        productCount: categoryProducts.length,

        products: categoryProducts.map((product) => ({
          id: product._id.toString(),

          productName: product.productName,

          productSKU: product.productSKU,

          price: product.price,

          quantity: product.quantity ?? 0,

          currentStock: product.currentStock ?? 0,

          image: product.image?.url || "",

          isActive: product.isActive,
        })),

        createdBy: category.createdBy ? category.createdBy.toString() : null,

        createdAt: category.createdAt,

        updatedAt: category.updatedAt,
      };
    });

    return NextResponse.json(
      {
        success: true,
        categories: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Categories API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// POST CATEGORY
// =====================================================
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

    const categoryName = formData.get("categoryName");
    const categoryCode = formData.get("categoryCode");
    const description = formData.get("description");

    // Image
    const image = formData.get("image");

    // -------------------------
    // Required Fields
    // -------------------------
    if (!categoryName || !categoryCode) {
      return NextResponse.json(
        {
          message: "Category name and category code are required!",
        },
        { status: 400 },
      );
    }

    // -------------------------
    // Validate Image
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

    // -------------------------
    // Connect Database
    // -------------------------
    await connectMongoDB();

    // -------------------------
    // Normalize Category Code
    // -------------------------
    const normalizedCategoryCode = categoryCode.trim().toUpperCase();

    const normalizedCategoryName = categoryName.trim();

    // -------------------------
    // Check Duplicate Code
    // -------------------------
    const existingCategory = await Category.findOne({
      categoryCode: normalizedCategoryCode,
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          message: "A category with this category code already exists!",
        },
        { status: 409 },
      );
    }

    // -------------------------
    // Check Duplicate Name
    // -------------------------
    const existingCategoryName = await Category.findOne({
      categoryName: {
        $regex: `^${normalizedCategoryName}$`,
        $options: "i",
      },
    });

    if (existingCategoryName) {
      return NextResponse.json(
        {
          message: "A category with this name already exists!",
        },
        { status: 409 },
      );
    }

    // =================================================
    // UPLOAD CATEGORY IMAGE TO CLOUDINARY
    // =================================================

    let uploadedImage = null;

    if (image && typeof image !== "string" && image.size > 0) {
      uploadedImage = await uploadImageToCloudinary(image, "categories");
    }

    // =================================================
    // CREATE CATEGORY
    // =================================================

    const newCategory = await Category.create({
      categoryName: normalizedCategoryName,

      categoryCode: normalizedCategoryCode,

      description: description?.trim() || "",

      image: uploadedImage
        ? {
            public_id: uploadedImage.publicId,
            url: uploadedImage.url,
          }
        : {
            public_id: null,
            url: null,
          },

      products: [],

      isActive: true,
    });

    // -------------------------
    // Response
    // -------------------------
    return NextResponse.json(
      {
        success: true,

        message: "Category created successfully!",

        category: {
          id: newCategory._id.toString(),

          categoryName: newCategory.categoryName,

          categoryCode: newCategory.categoryCode,

          description: newCategory.description,

          image: newCategory.image
            ? {
                public_id: newCategory.image.public_id,
                url: newCategory.image.url,
              }
            : null,

          productCount: 0,

          products: [],

          isActive: newCategory.isActive,

          createdAt: newCategory.createdAt,

          updatedAt: newCategory.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add Category API Error:", error);

    // -------------------------
    // Mongoose Validation Error
    // -------------------------
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return NextResponse.json(
        {
          message: messages.join(", "),
        },
        { status: 400 },
      );
    }

    // -------------------------
    // Duplicate Category
    // -------------------------
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "A category with this category code already exists!",
        },
        { status: 409 },
      );
    }

    // -------------------------
    // Cloudinary Permission Error
    // -------------------------
    if (error.statusCode === 403) {
      return NextResponse.json(
        {
          message:
            "Cloudinary rejected the upload because this API key lacks upload permission.",
        },
        { status: 502 },
      );
    }

    // -------------------------
    // Cloudinary / Other Error
    // -------------------------
    return NextResponse.json(
      {
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
