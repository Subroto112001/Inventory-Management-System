import mongoose from "mongoose";
import { NextResponse } from "next/server";

import connectMongoDB from "@/lib/databse/mongodb";
import Brand from "@/lib/models/Brand";
import Product from "@/lib/models/Product";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/brand/:id
 * Fetch a single brand
 */
export async function GET(request, { params }) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid brand ID",
        },
        { status: 400 },
      );
    }

    const brand = await Brand.findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email")
      .populate("productCount")
      .lean();

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        brand,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/brand/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch brand",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/brand/:id
 * Update a brand
 */
export async function PUT(request, { params }) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid brand ID",
        },
        { status: 400 },
      );
    }

    const existingBrand = await Brand.findById(id);

    if (!existingBrand) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand not found",
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const {
      brandName,
      brandCode,
      description,
      logo,
      contactPerson,
      email,
      phoneNumber,
      website,
      address,
      district,
      country,
      status,
    } = body;

    // Check duplicate brand name
    if (brandName?.trim()) {
      const duplicateName = await Brand.findOne({
        _id: { $ne: id },
        brandName: {
          $regex: `^${brandName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            success: false,
            message: "A brand with this name already exists",
          },
          { status: 409 },
        );
      }
    }

    // Check duplicate brand code
    if (brandCode?.trim()) {
      const normalizedBrandCode = brandCode.trim().toUpperCase();

      const duplicateCode = await Brand.findOne({
        _id: { $ne: id },
        brandCode: normalizedBrandCode,
      });

      if (duplicateCode) {
        return NextResponse.json(
          {
            success: false,
            message: "A brand with this code already exists",
          },
          { status: 409 },
        );
      }
    }

    const updateData = {};

    if (brandName !== undefined) {
      updateData.brandName = brandName.trim();
    }

    if (brandCode !== undefined) {
      updateData.brandCode = brandCode?.trim()
        ? brandCode.trim().toUpperCase()
        : undefined;
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || undefined;
    }

    if (logo !== undefined) {
      updateData.logo =
        logo && typeof logo === "object"
          ? {
              public_id: logo.public_id?.trim() || undefined,
              url: logo.url?.trim() || undefined,
            }
          : undefined;
    }

    if (contactPerson !== undefined) {
      updateData.contactPerson = contactPerson?.trim() || undefined;
    }

    if (email !== undefined) {
      updateData.email = email?.trim()?.toLowerCase() || undefined;
    }

    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber?.trim() || undefined;
    }

    if (website !== undefined) {
      updateData.website = website?.trim() || undefined;
    }

    if (address !== undefined) {
      updateData.address = address?.trim() || undefined;
    }

    if (district !== undefined) {
      updateData.district = district?.trim() || undefined;
    }

    if (country !== undefined) {
      updateData.country = country?.trim() || "Bangladesh";
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    updateData.updatedBy = user._id || user.id;

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Brand updated successfully",
        brand: updatedBrand,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/brand/[id] error:", error);

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

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update brand",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/brand/:id
 * Delete a brand
 */
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid brand ID",
        },
        { status: 400 },
      );
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand not found",
        },
        { status: 404 },
      );
    }

    // Prevent deleting a brand that is already assigned to products
    const productCount = await Product.countDocuments({
      brand: id,
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `This brand cannot be deleted because it is assigned to ${productCount} product(s).`,
          productCount,
        },
        { status: 409 },
      );
    }

    await Brand.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Brand deleted successfully",
        brandId: id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/brand/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to delete brand",
      },
      { status: 500 },
    );
  }
}
