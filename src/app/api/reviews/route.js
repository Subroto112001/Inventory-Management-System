import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";

import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { requireAuth } from "@/lib/auth";
import { requireStaff } from "@/lib/authorization";
import Review from "../../../lib/models/Review.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(request) {
  try {
    const productId = new URL(request.url).searchParams.get("productId");
    if (!mongoose.isValidObjectId(productId))
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    await connectMongoDB();
    const rows = await Review.find({ product: productId, isPublished: true })
      .populate("customer", "firstName")
      .sort({ createdAt: -1 })
      .lean();
    const reviews = rows.map((r) => ({
      id: r._id.toString(),
      rating: r.rating,
      title: r.title,
      body: r.body,
      customerName: r.customer?.firstName || "Customer",
      createdAt: r.createdAt,
    }));
    const user = await requireAuth(request);
    const canReview = Boolean(user?.role === "Customer" && await Order.exists({ customerUser: user._id, status: "Delivered", "items.product": productId }));
    const hasReviewed = Boolean(user?.role === "Customer" && await Review.exists({ customer: user._id, product: productId }));
    const average = reviews.length
      ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length
      : 0;
    return NextResponse.json({
      reviews,
      count: reviews.length,
      averageRating: Number(average.toFixed(1)),
      canReview,
      hasReviewed,
    });
  } catch (e) {
    console.error("Reviews GET error", e);
    return NextResponse.json(
      { message: "Unable to load reviews" },
      { status: 500 },
    );
  }
}
export async function POST(request) {
  const user = await requireAuth(request);
  if (!user || user.role !== "Customer")
    return NextResponse.json(
      { message: "Customer sign-in required" },
      { status: user ? 403 : 401 },
    );
  try {
    const { productId, rating, title = "", body } = await request.json();
    if (
      !mongoose.isValidObjectId(productId) ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      typeof body !== "string" ||
      !body.trim() ||
      body.length > 2000 ||
      typeof title !== "string" ||
      title.length > 120
    )
      return NextResponse.json(
        { message: "Provide product, rating from 1 to 5, and review text" },
        { status: 400 },
      );
    await connectMongoDB();
    if (!(await Product.exists({ _id: productId, isActive: true })))
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    if (
      !(await Order.exists({
        customerUser: user._id,
        status: "Delivered",
        "items.product": productId,
      }))
    )
      return NextResponse.json(
        { message: "A delivered purchase is required to review this product" },
        { status: 403 },
      );
    const review = await Review.create({
      product: productId,
      customer: user._id,
      rating,
      title: title.trim(),
      body: body.trim(),
    });
    return NextResponse.json(
      { success: true, id: review._id.toString() },
      { status: 201 },
    );
  } catch (e) {
    if (e.code === 11000)
      return NextResponse.json(
        { message: "You have already reviewed this product" },
        { status: 409 },
      );
    console.error("Reviews POST error", e);
    return NextResponse.json(
      { message: "Unable to submit review" },
      { status: 500 },
    );
  }
}
export async function DELETE(request) {
  const access = await requireStaff(request);
  if (!access.ok) return access.response;
  if (!["Admin", "System Admin", "Manager"].includes(access.user.role))
    return NextResponse.json(
      { message: "Review moderation is not allowed" },
      { status: 403 },
    );
  try {
    const { reviewId } = await request.json();
    if (!mongoose.isValidObjectId(reviewId))
      return NextResponse.json(
        { message: "Invalid review id" },
        { status: 400 },
      );
    await connectMongoDB();
    const deleted = await Review.findByIdAndDelete(reviewId);
    return deleted
      ? NextResponse.json({ success: true })
      : NextResponse.json({ message: "Review not found" }, { status: 404 });
  } catch (e) {
    console.error("Reviews DELETE error", e);
    return NextResponse.json(
      { message: "Unable to moderate review" },
      { status: 500 },
    );
  }
}
