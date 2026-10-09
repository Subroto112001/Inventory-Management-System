import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import connectMongoDB from "@/lib/databse/mongodb";
import { validateAddress } from "@/lib/accountValidation";

function denied(user) {
  if (!user)
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  if (!isCustomer(user))
    return NextResponse.json(
      { success: false, message: "Customer account required" },
      { status: 403 },
    );
  return null;
}

export async function PATCH(request, { params }) {
  const user = await getAuthenticatedUser(request);
  const response = denied(user);
  if (response) return response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invalid address id" },
      { status: 400 },
    );
  const address = user.addresses.id(id);
  if (!address)
    return NextResponse.json(
      { success: false, message: "Address not found" },
      { status: 404 },
    );
  try {
    const body = await request.json();
    const allowedFields = ["label", "fullName", "phone", "address", "line2", "area", "city", "state", "postalCode", "country", "isDefault"];
    if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
      return NextResponse.json({ success: false, message: "Unsupported address field" }, { status: 400 });
    }
    const parsed = validateAddress({ ...address.toObject(), ...body });
    if (parsed.error) return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    if (body.isDefault !== undefined && typeof body.isDefault !== "boolean") {
      return NextResponse.json({ success: false, message: "Default address setting is invalid" }, { status: 400 });
    }
    Object.assign(address, parsed.address);
    if (body.isDefault === true) user.addresses.forEach((item) => { item.isDefault = item._id.toString() === id; });
    await connectMongoDB();
    await user.save();
    return NextResponse.json({ success: true, address, addresses: user.addresses });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to update address" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getAuthenticatedUser(request);
  const response = denied(user);
  if (response) return response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invalid address id" },
      { status: 400 },
    );
  const address = user.addresses.id(id);
  if (!address)
    return NextResponse.json(
      { success: false, message: "Address not found" },
      { status: 404 },
    );
  const wasDefault = address.isDefault;
  address.deleteOne();
  if (wasDefault && user.addresses.length) user.addresses[0].isDefault = true;
  await connectMongoDB();
  await user.save();
  return NextResponse.json({ success: true, addresses: user.addresses });
}
