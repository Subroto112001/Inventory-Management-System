import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Brand from "@/lib/models/Brand";
import { requireAuth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";

/**
 * GET /api/brand
 * Fetch all brands
 */
export async function GET(request) {
  try {
    await connectMongoDB();

    const user = await requireAuth(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      100,
    );

    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.$or = [
        { brandName: { $regex: search, $options: "i" } },
        { brandCode: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const [brands, total] = await Promise.all([
      Brand.find(filter)
        .populate("createdBy", "firstName lastName email")
        .populate("updatedBy", "firstName lastName email")
        .populate("productCount")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Brand.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Brands fetched successfully",
        brands,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/brand error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch brands",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/brand
 * Create a new brand
 */
export async function POST(request) {
  try {
    await connectMongoDB();

    const user = await requireAuth(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // ---------------------------------------------------------
    // Frontend is sending multipart/form-data
    // ---------------------------------------------------------

    const formData = await request.formData();

    const brandName = formData.get("brandName");
    const brandCode = formData.get("brandCode");
    const description = formData.get("description");
    const contactPerson = formData.get("contactPerson");
    const email = formData.get("email");
    const phoneNumber = formData.get("phoneNumber");
    const website = formData.get("website");
    const address = formData.get("address");
    const district = formData.get("district");
    const country = formData.get("country");
    const status = formData.get("status");

    const logoFile = formData.get("logo");

    // ---------------------------------------------------------
    // Required validation
    // ---------------------------------------------------------

    if (!brandName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand name is required",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // Duplicate brand name
    // ---------------------------------------------------------

    const escapedBrandName = brandName
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingBrandName = await Brand.findOne({
      brandName: {
        $regex: `^${escapedBrandName}$`,
        $options: "i",
      },
    });

    if (existingBrandName) {
      return NextResponse.json(
        {
          success: false,
          message: "A brand with this name already exists",
        },
        { status: 409 },
      );
    }

    // ---------------------------------------------------------
    // Duplicate brand code
    // ---------------------------------------------------------

    const normalizedBrandCode = brandCode?.trim()
      ? brandCode.trim().toUpperCase()
      : undefined;

    if (normalizedBrandCode) {
      const existingBrandCode = await Brand.findOne({
        brandCode: normalizedBrandCode,
      });

      if (existingBrandCode) {
        return NextResponse.json(
          {
            success: false,
            message: "A brand with this code already exists",
          },
          { status: 409 },
        );
      }
    }

    // ---------------------------------------------------------
    // Logo upload
    // ---------------------------------------------------------

    let logo;

    if (
      logoFile &&
      typeof logoFile === "object" &&
      typeof logoFile.arrayBuffer === "function" &&
      logoFile.size > 0
    ) {
      const uploadedLogo = await uploadImageToCloudinary(logoFile, "brands");

      if (uploadedLogo) {
        logo = {
          public_id: uploadedLogo.publicId,
          url: uploadedLogo.url,
        };
      }
    }

    // ---------------------------------------------------------
    // Create Brand
    // ---------------------------------------------------------

    const brand = await Brand.create({
      brandName: brandName.trim(),

      brandCode: normalizedBrandCode,

      description: description?.trim() || undefined,

      logo,

      contactPerson: contactPerson?.trim() || undefined,

      email: email?.trim()?.toLowerCase() || undefined,

      phoneNumber: phoneNumber?.trim() || undefined,

      website: website?.trim() || undefined,

      address: address?.trim() || undefined,

      district: district?.trim() || undefined,

      country: country?.trim() || "Bangladesh",

      status: status === "Inactive" ? "Inactive" : "Active",

      createdBy: user._id || user.id,
    });

    // ---------------------------------------------------------
    // Populate created brand
    // ---------------------------------------------------------

    const populatedBrand = await Brand.findById(brand._id)
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email")
      .lean();

    // ---------------------------------------------------------
    // Success response
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Brand created successfully",
        brand: populatedBrand,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/brand error:", error);

    // ---------------------------------------------------------
    // Mongoose validation error
    // ---------------------------------------------------------

    if (error?.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Brand validation failed",
          errors,
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // Duplicate key error
    // ---------------------------------------------------------

    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return NextResponse.json(
        {
          success: false,
          message: duplicateField
            ? `${duplicateField} already exists`
            : "A brand with this information already exists",
        },
        { status: 409 },
      );
    }

    // ---------------------------------------------------------
    // General error
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create brand",
      },
      { status: 500 },
    );
  }
}