import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import { PERMISSIONS, requirePermission } from "@/lib/authorization";

async function PATCHHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.UPCOMING_PRODUCTS_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid product id." }, { status: 400 });
  const body = await request.json();
  await connectMongoDB();
  const product = await Product.findOne({ _id: id, lifecycle: "scheduled" });
  if (!product) return NextResponse.json({ success: false, message: "Scheduled product not found." }, { status: 404 });
  if (body.launchAt !== undefined) {
    const date = new Date(body.launchAt);
    if (!Number.isFinite(date.getTime()) || date <= new Date()) return NextResponse.json({ success: false, message: "Launch date must be in the future." }, { status: 400 });
    product.launchAt = date;
  }
  if (body.preorder) {
    const startsAt = body.preorder.startsAt ? new Date(body.preorder.startsAt) : null;
    const endsAt = body.preorder.endsAt ? new Date(body.preorder.endsAt) : null;
    const expectedShipAt = body.preorder.expectedShipAt ? new Date(body.preorder.expectedShipAt) : null;
    const limit = body.preorder.limit == null || body.preorder.limit === "" ? null : Number(body.preorder.limit);
    if ((startsAt && (!Number.isFinite(startsAt.getTime()) || startsAt >= product.launchAt)) || (endsAt && (!Number.isFinite(endsAt.getTime()) || endsAt < (startsAt || new Date()) || endsAt > product.launchAt)) || (expectedShipAt && !Number.isFinite(expectedShipAt.getTime())) || (limit !== null && (!Number.isInteger(limit) || limit < 1))) return NextResponse.json({ success: false, message: "Invalid pre-order window or quantity limit." }, { status: 400 });
    product.preorder.enabled = body.preorder.enabled === true;
    product.preorder.startsAt = startsAt;
    product.preorder.endsAt = endsAt;
    product.preorder.limit = limit;
    product.preorder.expectedShipAt = expectedShipAt;
    product.preorder.terms = String(body.preorder.terms || "").slice(0, 2000);
  }
  if (body.featuredOnLaunch !== undefined) product.featuredOnLaunch = body.featuredOnLaunch === true;
  if (body.isActive !== undefined) product.isActive = body.isActive === true;
  await product.save();
  return NextResponse.json({ success: true });
}

async function DELETEHandler(request, { params }) {
  const access = await requirePermission(request, PERMISSIONS.UPCOMING_PRODUCTS_MANAGE);
  if (!access.ok) return access.response;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid product id." }, { status: 400 });
  await connectMongoDB();
  const product = await Product.findOneAndUpdate({ _id: id, lifecycle: "scheduled" }, { $set: { lifecycle: "inactive", isActive: false } });
  return NextResponse.json({ success: !!product, message: product ? "Product archived." : "Scheduled product not found." }, { status: product ? 200 : 404 });
}

export const PATCH = withApiErrorHandling(PATCHHandler, "PATCH /api/upcoming-products/[id]");
export const DELETE = withApiErrorHandling(DELETEHandler, "DELETE /api/upcoming-products/[id]");
