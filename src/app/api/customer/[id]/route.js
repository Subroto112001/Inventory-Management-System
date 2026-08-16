import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Customer from "@/lib/models/Customer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// PUT: Update a customer
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid customer id",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { fullName, email, phoneNumber, address, notes, isActive } = body;

    if (fullName !== undefined && !fullName.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name is required",
        },
        { status: 400 },
      );
    }

    if (phoneNumber !== undefined && !phoneNumber.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 },
      );
    }

    await connectMongoDB();

    // Prevent duplicate phone number on another customer
    if (phoneNumber) {
      const existingPhone = await Customer.findOne({
        phoneNumber,
        _id: { $ne: id },
      });

      if (existingPhone) {
        return NextResponse.json(
          {
            success: false,
            message: "Phone number already exists",
          },
          { status: 409 },
        );
      }
    }

    // Prevent duplicate email on another customer
    if (email) {
      const existingEmail = await Customer.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          { status: 409 },
        );
      }
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined)
      updateData.email = email ? email.toLowerCase() : undefined;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (notes !== undefined) updateData.notes = notes;
    if (isActive !== undefined) updateData.isActive = isActive;

    const customer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Customer updated successfully",
        customer,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Customer API Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);

      return NextResponse.json(
        {
          success: false,
          message: messages.join(", "),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

// DELETE: Remove a customer
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid customer id",
        },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Customer deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Customer API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
