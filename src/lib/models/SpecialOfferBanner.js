import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    public_id: { type: String, default: null },
    url: { type: String, default: null },
  },
  { _id: false },
);

const specialOfferBannerSchema = new Schema(
  {
    key: { type: String, unique: true, default: "default", immutable: true },
    isEnabled: { type: Boolean, default: false },
    heading: { type: String, trim: true, maxlength: 100, default: "Get Special Offers" },
    offerType: { type: String, enum: ["percentage", "fixed", "custom"], default: "percentage" },
    discountValue: { type: Number, min: 0, default: 10 },
    customOfferText: { type: String, trim: true, maxlength: 100, default: "" },
    description: { type: String, trim: true, maxlength: 400, default: "" },
    leftImage: { type: imageSchema, default: () => ({}) },
    rightImage: { type: imageSchema, default: () => ({}) },
    backgroundColor: { type: String, match: /^#[0-9a-f]{6}$/i, default: "#F1F3F5" },
    textColor: { type: String, match: /^#[0-9a-f]{6}$/i, default: "#111318" },
    accentColor: { type: String, match: /^#[0-9a-f]{6}$/i, default: "#000000" },
    buttonText: { type: String, trim: true, maxlength: 40, default: "" },
    buttonUrl: { type: String, trim: true, maxlength: 300, default: "" },
    terms: { type: String, trim: true, maxlength: 2000, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    visibilityMode: { type: String, enum: ["hide", "show-status"], default: "hide" },
    showSubscription: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const SpecialOfferBanner =
  mongoose.models.SpecialOfferBanner ||
  mongoose.model("SpecialOfferBanner", specialOfferBannerSchema);

export default SpecialOfferBanner;
