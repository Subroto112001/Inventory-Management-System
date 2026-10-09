import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { getAuthenticatedUser, isCustomer, signAccessToken, verifyAccessToken } from "@/lib/auth";
import connectMongoDB from "@/lib/databse/mongodb";
import { deleteCloudinaryFile, uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";

function serializeUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName || "",
    email: user.email,
    phoneNumber: user.phoneNumber || "",
    image: user.image || null,
    isEmailVerified: Boolean(user.isEmailVerified),
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
    const multipart = request.headers.get("content-type")?.includes("multipart/form-data");
    const formData = multipart ? await request.formData() : null;
    const body = formData ? Object.fromEntries(formData.entries()) : await request.json();
    const allowedFields = new Set(["firstName", "lastName", "phoneNumber", "address", "district", "country", "image"]);
    if (Object.keys(body).some((field) => !allowedFields.has(field))) {
      return NextResponse.json({ success: false, message: "Unsupported profile field" }, { status: 400 });
    }
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const phoneNumber = String(body.phoneNumber || "").trim();
    const address = String(body.address || "").trim();
    const district = String(body.district || "").trim();
    const country = String(body.country || "Bangladesh").trim();
    const imageFile = formData?.get("image");

    if (
      !/^[a-zA-Z\s]{2,50}$/.test(firstName) ||
      (lastName && !/^[a-zA-Z\s]{2,50}$/.test(lastName))
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid name" },
        { status: 400 },
      );
    }
    if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid phone number" },
        { status: 400 },
      );
    }

    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
        return NextResponse.json({ success: false, message: "Choose a JPG, PNG, or WebP profile image." }, { status: 400 });
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, message: "Profile images must be 5 MB or smaller." }, { status: 400 });
      }
    }

    await connectMongoDB();
    const user = await User.findById(access.user._id).select("-password -refreshToken");
    if (!user) return NextResponse.json({ success: false, message: "Customer account not found" }, { status: 404 });
    let uploadedImage;
    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      uploadedImage = await uploadImageToCloudinary(imageFile, "customer-profiles");
    }
    const previousImageId = user.image?.public_id;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.district = district;
    user.country = country;
    if (uploadedImage) user.image = { public_id: uploadedImage.publicId, url: uploadedImage.url };
    await user.save();
    if (uploadedImage && previousImageId) {
      deleteCloudinaryFile(previousImageId).catch((error) => console.error("Unable to remove replaced profile image:", error?.message));
    }

    return NextResponse.json({ success: true, user: serializeUser(user) });
  } catch (error) {
    if (error?.statusCode || /Cloudinary|upload/i.test(error?.message || "")) {
      return NextResponse.json({ success: false, message: "Profile image upload failed. Your existing profile picture was kept." }, { status: 502 });
    }
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
    if (Object.keys(body).some((field) => !["currentPassword", "newPassword", "confirmPassword"].includes(field))) {
      return NextResponse.json({ success: false, message: "Unsupported password field" }, { status: 400 });
    }
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmation = String(body.confirmPassword || "");
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
    if (newPassword !== confirmation) {
      return NextResponse.json({ success: false, message: "New password and confirmation do not match" }, { status: 400 });
    }
    await connectMongoDB();
    const user = await User.findById(access.user._id).select("+password");
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      );
    }
    user.password = newPassword;
    user.authVersion = (user.authVersion || 0) + 1;
    await user.save();
    const response = NextResponse.json({ success: true, message: "Password updated successfully" });
    const oldPayload = verifyAccessToken(request.cookies.get("token")?.value);
    const remainingLifetime = Math.max(1, (oldPayload?.exp || Math.floor(Date.now() / 1000) + 86400) - Math.floor(Date.now() / 1000));
    response.cookies.set("token", signAccessToken(user, remainingLifetime), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: remainingLifetime, path: "/" });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to update password" },
      { status: 500 },
    );
  }
}
