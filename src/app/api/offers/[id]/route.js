import { NextResponse } from "next/server";
import Offer from "@/lib/models/Offer";
import {
  normalizeOfferInput,
  serializeOffer,
  isValidObjectId,
} from "@/lib/offerHelpers";
import connectMongoDB from "@/lib/databse/mongodb";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/offers/:id — fetch a single offer
export async function GET(request, { params }) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid offer id." },
      { status: 400 },
    );
  }

  try {
    if (!(await requireAuth(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();

    const offer = await Offer.findById(id);
    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Offer not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, offer: serializeOffer(offer) },
      { status: 200 },
    );
  } catch (err) {
    console.error(`GET /api/offers/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch offer." },
      { status: 500 },
    );
  }
}

// PUT /api/offers/:id — update an existing offer (also used for the
// active/inactive toggle, which sends the full offer with isActive flipped)
export async function PUT(request, { params }) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid offer id." },
      { status: 400 },
    );
  }

  try {
    if (!(await requireAuth(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();

    const body = await request.json();
    const updates = normalizeOfferInput(body);

    const offer = await Offer.findById(id);
    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Offer not found." },
        { status: 404 },
      );
    }

    Object.assign(offer, updates);
    await offer.save(); // runs schema validators, incl. the pre("validate") hook

    return NextResponse.json(
      { success: true, offer: serializeOffer(offer) },
      { status: 200 },
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(" ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "An offer with that offer code already exists.",
        },
        { status: 409 },
      );
    }

    console.error(`PUT /api/offers/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: "Failed to update offer." },
      { status: 500 },
    );
  }
}

// DELETE /api/offers/:id
export async function DELETE(request, { params }) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid offer id." },
      { status: 400 },
    );
  }

  try {
    if (!(await requireAuth(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();

    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Offer not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Offer deleted." },
      { status: 200 },
    );
  } catch (err) {
    console.error(`DELETE /api/offers/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: "Failed to delete offer." },
      { status: 500 },
    );
  }
}
