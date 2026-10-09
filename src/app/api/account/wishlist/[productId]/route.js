import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import connectMongoDB from "@/lib/databse/mongodb";

export async function DELETE(request, { params }) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  if (!isCustomer(user)) return NextResponse.json({ success: false, message: "Customer account required" }, { status: 403 });
  const { productId } = await params;
  if (!mongoose.isValidObjectId(productId)) return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
  try {
    await connectMongoDB();
    await user.updateOne({ $pull: { wishlist: new mongoose.Types.ObjectId(productId) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist remove error:", error?.message);
    return NextResponse.json({ success: false, message: "Unable to update wishlist" }, { status: 500 });
  }
}
