import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Customer from "@/lib/models/Customer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Fetch all customers
export async function GET() {
  try {
    await connectMongoDB();

    const customers = await Customer.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        customers,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Customers API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// POST: Create customer
export async function POST(request) {
  try {
    const body = await request.json();

    const { fullName, email, phoneNumber, address, notes } = body;

    if (!fullName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name is required",
        },
        { status: 400 },
      );
    }

    if (!phoneNumber?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 },
      );
    }

    await connectMongoDB();

    // Prevent duplicate phone number
    const existingPhone = await Customer.findOne({
      phoneNumber,
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

    // Prevent duplicate email (only if email is provided)
    if (email) {
      const existingEmail = await Customer.findOne({
        email: email.toLowerCase(),
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

    const customer = await Customer.create({
      fullName,
      email: email ? email.toLowerCase() : undefined,
      phoneNumber,
      address,
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
        customer,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Customer API Error:", error);

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
