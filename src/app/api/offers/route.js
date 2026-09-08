import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/Offer";
import { getUserId } from "@/lib/getUserId";
import { normalizeOfferInput, serializeOffer } from "@/lib/offerHelpers";

export const dynamic = "force-dynamic";

// GET /api/offers  — list all offers, newest first
export async function GET() {
  try {
    await dbConnect();

    const offers = await Offer.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, offers: offers.map(serializeOffer) },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET /api/offers error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch offers." },
      { status: 500 },
    );
  }
}

// POST /api/offers — create a new offer
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const userId = getUserId(request, body);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: no user id found for createdBy." },
        { status: 401 },
      );
    }

    const offerData = {
      ...normalizeOfferInput(body),
      createdBy: userId,
    };

    const offer = await Offer.create(offerData);

    return NextResponse.json(
      { success: true, offer: serializeOffer(offer) },
      { status: 201 },
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
        { success: false, message: "An offer with that offer code already exists." },
        { status: 409 },
      );
    }

    console.error("POST /api/offers error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create offer." },
      { status: 500 },
    );
  }
}
