import { NextResponse } from "next/server";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import { validateAddress } from "@/lib/accountValidation";

function accessResponse(user) {
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

export async function GET(request) {
  const user = await getAuthenticatedUser(request);
  const denied = accessResponse(user);
  if (denied) return denied;
  return NextResponse.json({ success: true, addresses: user.addresses || [] });
}

export async function POST(request) {
  const user = await getAuthenticatedUser(request);
  const denied = accessResponse(user);
  if (denied) return denied;
  try {
    const parsed = validateAddress(await request.json());
    if (parsed.error)
      return NextResponse.json(
        { success: false, message: parsed.error },
        { status: 400 },
      );
    await connectMongoDB();
    const shouldDefault =
      user.addresses.length === 0 || parsed.address.isDefault;
    user.addresses.forEach((item) => {
      item.isDefault = shouldDefault ? false : item.isDefault;
    });
    user.addresses.push({ ...parsed.address, isDefault: shouldDefault });
    await user.save();
    return NextResponse.json(
      {
        success: true,
        address: user.addresses[user.addresses.length - 1],
        addresses: user.addresses,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to save address" },
      { status: 500 },
    );
  }
}
