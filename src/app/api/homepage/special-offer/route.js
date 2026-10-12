import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import SpecialOfferBanner from "@/lib/models/SpecialOfferBanner";
import { PERMISSIONS, requirePermission } from "@/lib/authorization";
import { deleteCloudinaryFile, uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_BANNER = {
  isEnabled: false,
  heading: "Get Special Offers",
  offerType: "percentage",
  discountValue: 10,
  customOfferText: "",
  description: "",
  leftImage: null,
  rightImage: null,
  backgroundColor: "#F1F3F5",
  textColor: "#111318",
  accentColor: "#000000",
  buttonText: "",
  buttonUrl: "",
  terms: "",
  startDate: null,
  endDate: null,
  visibilityMode: "hide",
  showSubscription: false,
};

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

const serializeAdmin = (banner) => ({
  ...DEFAULT_BANNER,
  ...banner,
  id: banner?._id?.toString?.() || "",
  leftImage: banner?.leftImage?.url ? { public_id: banner.leftImage.public_id || "", url: banner.leftImage.url } : null,
  rightImage: banner?.rightImage?.url ? { public_id: banner.rightImage.public_id || "", url: banner.rightImage.url } : null,
  startDate: banner?.startDate ? new Date(banner.startDate).toISOString() : null,
  endDate: banner?.endDate ? new Date(banner.endDate).toISOString() : null,
  updatedAt: banner?.updatedAt ? new Date(banner.updatedAt).toISOString() : null,
});

function offerText(banner) {
  if (banner.offerType === "custom") return banner.customOfferText;
  if (banner.offerType === "fixed") return `$${Number(banner.discountValue).toFixed(2)} Off`;
  return `${Number(banner.discountValue)}% Off`;
}

function serializePublic(banner, now = new Date()) {
  if (!banner?.isEnabled) return null;
  const startsAt = banner.startDate ? new Date(banner.startDate) : null;
  const endsAt = banner.endDate ? new Date(banner.endDate) : null;
  const scheduleStatus = startsAt && now < startsAt
    ? "upcoming"
    : endsAt && now >= endsAt
      ? "expired"
      : "active";
  if (scheduleStatus !== "active" && banner.visibilityMode !== "show-status") return null;

  const active = scheduleStatus === "active";
  return {
    heading: banner.heading,
    offerText: active ? offerText(banner) : "",
    scheduleStatus,
    description: banner.description,
    leftImage: banner.leftImage?.url || "",
    rightImage: banner.rightImage?.url || "",
    backgroundColor: banner.backgroundColor,
    textColor: banner.textColor,
    accentColor: banner.accentColor,
    buttonText: active ? banner.buttonText : "",
    buttonUrl: active ? banner.buttonUrl : "",
    terms: active ? banner.terms : "",
    showSubscription: active && banner.showSubscription,
  };
}

function validDestination(value) {
  if (!value) return true;
  if (value.length > 300 || /[\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function parseDate(value, field) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw badRequest(`${field} is not a valid date`);
  return date;
}

async function getPayload(request) {
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicRequest = searchParams.get("public") === "1";
    if (!publicRequest) {
      const access = await requirePermission(request, PERMISSIONS.HOMEPAGE_MANAGE);
      if (!access.ok) return access.response;
    }

    await connectMongoDB();
    const banner = await SpecialOfferBanner.findOne({ key: "default" }).lean();
    if (publicRequest) {
      return NextResponse.json({ success: true, banner: serializePublic(banner) }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
    return NextResponse.json({ success: true, banner: serializeAdmin(banner) });
  } catch (error) {
    console.error("Special offer banner fetch error:", error);
    return NextResponse.json({ success: false, message: "Unable to load special offer banner" }, { status: 500 });
  }
}

export async function PUT(request) {
  const uploads = [];
  try {
    const access = await requirePermission(request, PERMISSIONS.HOMEPAGE_MANAGE);
    if (!access.ok) return access.response;
    const payload = await getPayload(request);
    const heading = String(payload.heading || "").trim();
    const offerType = String(payload.offerType || "");
    const customOfferText = String(payload.customOfferText || "").trim();
    const description = String(payload.description || "").trim();
    const buttonText = String(payload.buttonText || "").trim();
    const buttonUrl = String(payload.buttonUrl || "").trim();
    const terms = String(payload.terms || "").trim();
    const visibilityMode = String(payload.visibilityMode || "hide");
    const discountValue = payload.discountValue === "" ? 0 : Number(payload.discountValue);
    const backgroundColor = String(payload.backgroundColor || "");
    const textColor = String(payload.textColor || "");
    const accentColor = String(payload.accentColor || "");
    const startDate = parseDate(payload.startDate, "Start date");
    const endDate = parseDate(payload.endDate, "End date");
    const isEnabled = payload.isEnabled === "true";
    const showSubscription = payload.showSubscription === "true";

    if (isEnabled && !heading) throw badRequest("Heading is required when the banner is enabled");
    if (heading.length > 100 || description.length > 400 || terms.length > 2000 || buttonText.length > 40 || customOfferText.length > 100) throw badRequest("One or more text fields exceed their allowed length");
    if (!["percentage", "fixed", "custom"].includes(offerType)) throw badRequest("Select a valid offer type");
    if (offerType === "percentage" && (!Number.isFinite(discountValue) || discountValue < 0 || discountValue > 100)) throw badRequest("Percentage discount must be between 0 and 100");
    if (offerType === "fixed" && (!Number.isFinite(discountValue) || discountValue <= 0 || discountValue > 1000000)) throw badRequest("Fixed discount must be greater than zero and no more than 1,000,000");
    if (offerType === "custom" && !customOfferText) throw badRequest("Enter the promotional text to display");
    if (!/^#[0-9a-f]{6}$/i.test(backgroundColor) || !/^#[0-9a-f]{6}$/i.test(textColor) || !/^#[0-9a-f]{6}$/i.test(accentColor)) throw badRequest("Choose valid six-digit colors");
    if (!validDestination(buttonUrl)) throw badRequest("Button destination must be a site path or a secure HTTPS URL");
    if (Boolean(buttonText) !== Boolean(buttonUrl)) throw badRequest("Enter both button text and a destination, or leave both blank");
    if (!["hide", "show-status"].includes(visibilityMode)) throw badRequest("Select a valid scheduling visibility option");
    if (startDate && endDate && endDate <= startDate) throw badRequest("End date must be after the start date");

    await connectMongoDB();
    let banner = await SpecialOfferBanner.findOne({ key: "default" });
    if (!banner) banner = new SpecialOfferBanner({ key: "default" });
    const oldImages = [banner.leftImage, banner.rightImage];
    Object.assign(banner, {
      isEnabled, heading, offerType, discountValue, customOfferText, description,
      backgroundColor, textColor, accentColor, buttonText, buttonUrl, terms,
      startDate, endDate, visibilityMode, showSubscription,
    });

    for (const side of ["leftImage", "rightImage"]) {
      const file = payload[`${side}File`];
      if (file && typeof file !== "string" && typeof file.arrayBuffer === "function" && file.size > 0) {
        if (!file.type?.startsWith("image/") || file.size > 5 * 1024 * 1024) throw badRequest("Images must be image files no larger than 5 MB");
        const uploaded = await uploadImageToCloudinary(file, "homepage/special-offer");
        uploads.push(uploaded.publicId);
        banner[side] = { public_id: uploaded.publicId, url: uploaded.url };
      }
      if (payload[`remove${side[0].toUpperCase()}${side.slice(1)}`] === "true") banner[side] = null;
    }

    await banner.save();
    const retainedIds = new Set([banner.leftImage?.public_id, banner.rightImage?.public_id]);
    for (const oldImage of oldImages) {
      if (oldImage?.public_id && !retainedIds.has(oldImage.public_id)) {
        try { await deleteCloudinaryFile(oldImage.public_id); } catch (deleteError) { console.error("Could not remove replaced offer image:", deleteError); }
      }
    }

    return NextResponse.json({ success: true, banner: serializeAdmin(banner.toObject()) });
  } catch (error) {
    console.error("Special offer banner save error:", error);
    for (const publicId of uploads) {
      try { await deleteCloudinaryFile(publicId); } catch (cleanupError) { console.error("Could not clean up an unsaved offer image:", cleanupError); }
    }
    const status = error.statusCode && error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : 500;
    return NextResponse.json({ success: false, message: error.message || "Unable to save special offer banner" }, { status });
  }
}
