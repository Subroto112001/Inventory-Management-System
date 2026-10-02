import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import connectMongoDB from "@/lib/databse/mongodb";

export const dynamic = "force-dynamic";

function serializeUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName || "",
    email: user.email,
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    district: user.district || "",
    country: user.country || "Bangladesh",
    role: user.role,
    addresses: user.addresses || [],
  };
}

async function getSelf(request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return {
      response: NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      ),
    };
  if (!isCustomer(user))
    return {
      response: NextResponse.json(
        { success: false, message: "Customer account required" },
        { status: 403 },
      ),
    };
  return { user };
}

export async function GET(request) {
  const access = await getSelf(request);
  if (access.response) return access.response;
  return NextResponse.json({ success: true, user: serializeUser(access.user) });
}

export async function PATCH(request) {
  const access = await getSelf(request);
  if (access.response) return access.response;

  try {
    const body = await request.json();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const phoneNumber = String(body.phoneNumber || "").trim();
    const address = String(body.address || "").trim();
    const district = String(body.district || "").trim();
    const country = String(body.country || "Bangladesh").trim();

    if (
      !/^[a-zA-Z\s]{2,50}$/.test(firstName) ||
      (lastName && !/^[a-zA-Z\s]{2,50}$/.test(lastName))
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid name" },
        { status: 400 },
      );
    }
    if (phoneNumber && !/^(?:\+88|88)?(01[3-9]\d{8})$/.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid phone number" },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const user = await User.findByIdAndUpdate(
      access.user._id,
      { firstName, lastName, phoneNumber, address, district, country },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    return NextResponse.json({ success: true, user: serializeUser(user) });
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: Object.values(error.errors)
            .map((item) => item.message)
            .join(", "),
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Unable to update account" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  const access = await getSelf(request);
  if (access.response) return access.response;

  try {
    const body = await request.json();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (
      !currentPassword ||
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(newPassword)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password and a valid new password are required",
        },
        { status: 400 },
      );
    }
    await connectMongoDB();
    const user = await User.findById(access.user._id).select("+password");
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      );
    }
    user.password = await bcrypt.hash(newPassword, 12);
    user.authVersion = (user.authVersion || 0) + 1;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to update password" },
      { status: 500 },
    );
  }
}
