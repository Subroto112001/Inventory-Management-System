import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";

export const dynamic = "force-dynamic";

async function getCustomer(request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 }) };
  if (!isCustomer(user)) return { response: NextResponse.json({ success: false, message: "Customer account required" }, { status: 403 }) };
  return { user };
}

export async function GET(request) {
  const access = await getCustomer(request);
  if (access.response) return access.response;
  try {
    await connectMongoDB();
    const wishlistIds = access.user.wishlist || [];
    const products = await Product.find({ _id: { $in: wishlistIds }, isActive: true }).populate("category", "categoryName").lean();
    const validIds = new Set(products.map((product) => product._id.toString()));
    const staleIds = wishlistIds.filter((id) => !validIds.has(id.toString()));
    if (staleIds.length) await access.user.updateOne({ $pull: { wishlist: { $in: staleIds } } });
    return NextResponse.json({ success: true, products: products.map((product) => ({
      id: product._id.toString(),
      name: product.productName,
      sku: product.productSKU,
      category: product.category?.categoryName || "",
      price: product.price,
      discount: product.discount || 0,
      image: product.image?.url || product.images?.[0]?.url || "",
      inStock: product.currentStock > 0,
    })) });
  } catch (error) {
    console.error("Wishlist fetch error:", error?.message);
    return NextResponse.json({ success: false, message: "Unable to load wishlist" }, { status: 500 });
  }
}

export async function POST(request) {
  const access = await getCustomer(request);
  if (access.response) return access.response;
  try {
    const body = await request.json();
    if (Object.keys(body).some((field) => field !== "productId") || !mongoose.isValidObjectId(body.productId)) return NextResponse.json({ success: false, message: "Invalid product id" }, { status: 400 });
    await connectMongoDB();
    if (!await Product.exists({ _id: body.productId, isActive: true })) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    await access.user.updateOne({ $addToSet: { wishlist: new mongoose.Types.ObjectId(body.productId) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist add error:", error?.message);
    return NextResponse.json({ success: false, message: "Unable to update wishlist" }, { status: 500 });
  }
}
