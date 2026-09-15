import { NextResponse } from "next/server";
// Adjust the import paths based on your project's directory structure
import Warehouse from "@/lib/models/Warehouse";
import { requireAuth } from "@/lib/auth";
import connectMongoDB from "@/lib/databse/mongodb";

export async function GET(request) {
  try {
    // Fetch all warehouses, sorted by newest first
    // Populating the manager field allows you to display manager names on the frontend later
    const warehouses = await Warehouse.find()
      .populate("createdBy")
      .sort({ createdAt: -1 })
      .lean(); 


    return NextResponse.json(
      {
        success: true,
        count: warehouses.length,
        warehouses,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve warehouse data. Please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    // await connectDB();
    const user = await requireAuth(request);
console.log(user);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Please log in." },
        { status: 401 },
      );
    }

    await connectMongoDB();

    const body = await request.json();
    const { name, warehouseCode, location, contactNumber, capacity, manager } =
      body;

    // 1. Basic Validation (Mongoose will catch most, but early returns save database hits)
    if (
      !name ||
      !warehouseCode ||
      !location?.address ||
      !location?.district ||
      !contactNumber ||
      !capacity
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide all required fields: name, code, address, district, and creator ID.",
        },
        { status: 400 },
      );
    }

    // 2. Check for duplicate Warehouse Code
    const existingWarehouse = await Warehouse.findOne({
      warehouseCode: warehouseCode.toUpperCase(),
    });
    if (existingWarehouse) {
      return NextResponse.json(
        {
          success: false,
          message: `A warehouse with the code ${warehouseCode} already exists.`,
        },
        { status: 409 }, // 409 Conflict
      );
    }

    // 3. Create and save the new warehouse
    const newWarehouse = await Warehouse.create({
      name,
      warehouseCode,
      location,
      contactNumber,
      capacity,
      manager,
      createdBy: user._id,
      isActive: true, // Defaults to true in the model, reinforced here
    });

    return NextResponse.json(
      {
        success: true,
        message: "Warehouse successfully created.",
        warehouse: newWarehouse,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating warehouse:", error);

    // Handle Mongoose Validation Errors gracefully for the frontend
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "An internal server error occurred while creating the warehouse.",
      },
      { status: 500 },
    );
  }
}
