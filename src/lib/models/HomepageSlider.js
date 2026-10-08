import mongoose from "mongoose";

const { Schema } = mongoose;

const homepageSliderSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Slider title is required"],
      trim: true,
      maxlength: [120, "Slider title cannot exceed 120 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, "Slider subtitle cannot exceed 300 characters"],
      default: "",
    },
    badge: {
      type: String,
      trim: true,
      maxlength: [60, "Badge cannot exceed 60 characters"],
      default: "",
    },
    supportingText: { type: String, trim: true, maxlength: 100, default: "" },
    product: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    price: { type: Number, min: 0, default: null },
    previousPrice: { type: Number, min: 0, default: null },
    discountText: { type: String, trim: true, maxlength: 40, default: "" },
    buttonText: {
      type: String,
      trim: true,
      maxlength: [40, "Button text cannot exceed 40 characters"],
      default: "Shop now",
    },
    buttonUrl: {
      type: String,
      trim: true,
      maxlength: [300, "Button URL cannot exceed 300 characters"],
      default: "/product",
    },
    image: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    mobileImage: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true },
);

homepageSliderSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

const cachedHomepageSlider = mongoose.models.HomepageSlider;
const addedPaths = [
  "supportingText",
  "product",
  "price",
  "previousPrice",
  "discountText",
];

// Next.js dev hot reload can retain the model compiled before these fields
// were added. Recompile it so Mongoose recognizes populate("product").
if (
  cachedHomepageSlider &&
  addedPaths.some((path) => !cachedHomepageSlider.schema.path(path))
) {
  delete mongoose.models.HomepageSlider;
}

const HomepageSlider =
  mongoose.models.HomepageSlider ||
  mongoose.model("HomepageSlider", homepageSliderSchema);

export default HomepageSlider;
