import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import HomepageSlider from "@/lib/models/HomepageSlider";
import { PERMISSIONS, requirePermission } from "@/lib/authorization";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const parseRequestObject = async (request) => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  const object = Object.fromEntries(formData.entries());
  return object;
};

const normalizeInteger = (value, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const serializeSlider = (slider) => ({
  id: slider._id.toString(),
  title: slider.title,
  subtitle: slider.subtitle || "",
  badge: slider.badge || "",
  supportingText: slider.supportingText || "",
  product: slider.product?._id?.toString?.() || slider.product?.toString?.() || "",
  productName: slider.product?.productName || "",
  price: slider.price ?? slider.product?.price ?? null,
  previousPrice: slider.previousPrice ?? null,
  discountText: slider.discountText || "",
  buttonText: slider.buttonText || "Shop now",
  buttonUrl: slider.buttonUrl || "/product",
  image: slider.image?.url || slider.product?.image?.url || "",
  mobileImage: slider.mobileImage?.url || slider.image?.url || "",
  sortOrder: slider.sortOrder ?? 0,
  isActive: slider.isActive,
  startDate: slider.startDate ? new Date(slider.startDate).toISOString() : null,
  endDate: slider.endDate ? new Date(slider.endDate).toISOString() : null,
  createdAt: slider.createdAt ? new Date(slider.createdAt).toISOString() : null,
  updatedAt: slider.updatedAt ? new Date(slider.updatedAt).toISOString() : null,
});

const mapImageUpload = async (file) => {
  if (!file || typeof file === "string") return null;
  if (typeof file.arrayBuffer !== "function") return null;
  const uploadResult = await uploadImageToCloudinary(file, "homepage/sliders");
  return {
    public_id: uploadResult.publicId,
    url: uploadResult.url,
  };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminRequest = searchParams.get("admin") === "1";
    const publicRead = searchParams.get("public") === "1";

    if (adminRequest) {
      const access = await requirePermission(
        request,
        PERMISSIONS.HOMEPAGE_MANAGE,
      );
      if (!access.ok) return access.response;
    }

    await connectMongoDB();
    const filter =
      publicRead || searchParams.get("active") === "1"
        ? { isActive: true }
        : {};
    const sliders = await HomepageSlider.find(filter).populate("product", "productName price image isActive")
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      slides: sliders.map(serializeSlider),
      total: sliders.length,
    });
  } catch (error) {
    console.error("Homepage slider fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load homepage sliders" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const access = await requirePermission(
      request,
      PERMISSIONS.HOMEPAGE_MANAGE,
    );
    if (!access.ok) return access.response;

    const payload = await parseRequestObject(request);
    const title = String(payload.title || "").trim();
    const subtitle = String(payload.subtitle || "").trim();
    const badge = String(payload.badge || "").trim();
    const buttonText = String(payload.buttonText || "Shop now").trim();
    const buttonUrl = String(payload.buttonUrl || "/product").trim();
    const productId = String(payload.product || "").trim();

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Slider title is required" },
        { status: 400 },
      );
    }

    await connectMongoDB();
    if (productId && !/^[a-f\d]{24}$/i.test(productId)) {
      return NextResponse.json({ success: false, message: "Invalid product" }, { status: 400 });
    }
    if (productId) {
      const Product = (await import("@/lib/models/Product")).default;
      const product = await Product.findOne({ _id: productId, isActive: true }).select("_id").lean();
      if (!product) return NextResponse.json({ success: false, message: "Product not found or inactive" }, { status: 400 });
    }
    const image = await mapImageUpload(payload.image || payload.imageFile);
    const mobileImage = await mapImageUpload(
      payload.mobileImage || payload.mobileImageFile,
    );

    const slider = await HomepageSlider.create({
      title,
      subtitle,
      badge,
      supportingText: String(payload.supportingText || "").trim(),
      product: productId || null,
      price: payload.price === "" || payload.price == null ? null : Number(payload.price),
      previousPrice: payload.previousPrice === "" || payload.previousPrice == null ? null : Number(payload.previousPrice),
      discountText: String(payload.discountText || "").trim(),
      buttonText,
      buttonUrl,
      image: image || undefined,
      mobileImage: mobileImage || undefined,
      sortOrder: normalizeInteger(payload.sortOrder, 0),
      isActive:
        payload.isActive === undefined
          ? true
          : payload.isActive === true || payload.isActive === "true",
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
    });

    return NextResponse.json(
      { success: true, slider: serializeSlider(slider.toObject()) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create homepage slider error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to create homepage slider",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const access = await requirePermission(
      request,
      PERMISSIONS.HOMEPAGE_MANAGE,
    );
    if (!access.ok) return access.response;

    const payload = await parseRequestObject(request);
    const sliderId = String(payload.id || payload._id || "").trim();

    if (!sliderId) {
      return NextResponse.json(
        { success: false, message: "Slider id is required" },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const slider = await HomepageSlider.findById(sliderId);
    if (!slider) {
      return NextResponse.json(
        { success: false, message: "Slider not found" },
        { status: 404 },
      );
    }

    if (payload.title !== undefined)
      slider.title = String(payload.title).trim() || slider.title;
    if (payload.subtitle !== undefined)
      slider.subtitle = String(payload.subtitle).trim();
    if (payload.badge !== undefined)
      slider.badge = String(payload.badge).trim();
    if (payload.supportingText !== undefined) slider.supportingText = String(payload.supportingText).trim();
    if (payload.discountText !== undefined) slider.discountText = String(payload.discountText).trim();
    if (payload.price !== undefined) slider.price = payload.price === "" || payload.price == null ? null : Number(payload.price);
    if (payload.previousPrice !== undefined) slider.previousPrice = payload.previousPrice === "" || payload.previousPrice == null ? null : Number(payload.previousPrice);
    if (payload.product !== undefined) {
      const productId = String(payload.product || "").trim();
      if (productId && !/^[a-f\d]{24}$/i.test(productId)) return NextResponse.json({ success: false, message: "Invalid product" }, { status: 400 });
      if (productId) {
        const Product = (await import("@/lib/models/Product")).default;
        const product = await Product.findOne({ _id: productId, isActive: true }).select("_id").lean();
        if (!product) return NextResponse.json({ success: false, message: "Product not found or inactive" }, { status: 400 });
      }
      slider.product = productId || null;
    }
    if (payload.buttonText !== undefined)
      slider.buttonText = String(payload.buttonText).trim();
    if (payload.buttonUrl !== undefined)
      slider.buttonUrl = String(payload.buttonUrl).trim();
    if (payload.sortOrder !== undefined)
      slider.sortOrder = normalizeInteger(
        payload.sortOrder,
        slider.sortOrder || 0,
      );
    if (payload.isActive !== undefined)
      slider.isActive =
        payload.isActive === true || payload.isActive === "true";
    if (payload.startDate !== undefined)
      slider.startDate = payload.startDate ? new Date(payload.startDate) : null;
    if (payload.endDate !== undefined)
      slider.endDate = payload.endDate ? new Date(payload.endDate) : null;

    const imageFile = payload.image || payload.imageFile;
    if (
      imageFile &&
      typeof imageFile !== "string" &&
      typeof imageFile.arrayBuffer === "function"
    ) {
      slider.image = await mapImageUpload(imageFile);
    }

    const mobileImageFile = payload.mobileImage || payload.mobileImageFile;
    if (
      mobileImageFile &&
      typeof mobileImageFile !== "string" &&
      typeof mobileImageFile.arrayBuffer === "function"
    ) {
      slider.mobileImage = await mapImageUpload(mobileImageFile);
    }

    if (payload.removeImage === "1") slider.image = null;
    if (payload.removeMobileImage === "1") slider.mobileImage = null;

    await slider.save();

    return NextResponse.json({
      success: true,
      slider: serializeSlider(slider.toObject()),
    });
  } catch (error) {
    console.error("Update homepage slider error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to update homepage slider",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const access = await requirePermission(
      request,
      PERMISSIONS.HOMEPAGE_MANAGE,
    );
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      const payload = await parseRequestObject(request).catch(() => ({}));
      const fallbackId = String(payload.id || payload._id || "").trim();
      if (!fallbackId) {
        return NextResponse.json(
          { success: false, message: "Slider id is required" },
          { status: 400 },
        );
      }
      const deleted = await HomepageSlider.findByIdAndDelete(fallbackId);
      return NextResponse.json({
        success: !!deleted,
        message: deleted ? "Slider deleted" : "Slider not found",
      });
    }

    const deleted = await HomepageSlider.findByIdAndDelete(id);
    return NextResponse.json({
      success: !!deleted,
      message: deleted ? "Slider deleted" : "Slider not found",
    });
  } catch (error) {
    console.error("Delete homepage slider error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete homepage slider" },
      { status: 500 },
    );
  }
}
