import mongoose from "mongoose";

const { Schema } = mongoose;

export const DEFAULT_STORE_SETTINGS = {
  storeName: "FIELDHOUSE",
  tagline: "Thoughtful living, beautifully made.",
  logo: null,
  favicon: null,
  primaryColor: "#1F3A2E",
  secondaryColor: "#B65C38",
  accentColor: "#B65C38",
  surfaceColor: "#F7F3EC",
  backgroundColor: "#F7F3EC",
  textColor: "#211F1D",
  mutedTextColor: "#8A8378",
  borderColor: "#E4DED2",
  successColor: "#1F3A2E",
  warningColor: "#C9A659",
  errorColor: "#B65C38",
  fontFamily: "League Spartan",
};

const storeSettingsSchema = new Schema(
  {
    key: { type: String, unique: true, default: "default", immutable: true },
    storeId: { type: String, trim: true, default: "default", index: true },
    storeName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 80,
      required: true,
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: 160,
      default: DEFAULT_STORE_SETTINGS.tagline,
    },
    logo: {
      public_id: String,
      url: { type: String, match: /^https:\/\/.+/ },
    },
    favicon: {
      public_id: String,
      url: { type: String, match: /^https:\/\/.+/ },
    },
    primaryColor: { type: String, match: /^#[0-9A-Fa-f]{6}$/, required: true },
    secondaryColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: DEFAULT_STORE_SETTINGS.secondaryColor,
    },
    accentColor: { type: String, match: /^#[0-9A-Fa-f]{6}$/, required: true },
    surfaceColor: { type: String, match: /^#[0-9A-Fa-f]{6}$/, required: true },
    backgroundColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: DEFAULT_STORE_SETTINGS.backgroundColor,
    },
    textColor: { type: String, match: /^#[0-9A-Fa-f]{6}$/, required: true },
    mutedTextColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: DEFAULT_STORE_SETTINGS.mutedTextColor,
    },
    borderColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: DEFAULT_STORE_SETTINGS.borderColor,
    },
    successColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: DEFAULT_STORE_SETTINGS.successColor,
    },
    warningColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: DEFAULT_STORE_SETTINGS.warningColor,
    },
    errorColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: DEFAULT_STORE_SETTINGS.errorColor,
    },
    fontFamily: {
      type: String,
      enum: [
        "League Spartan",
        "Inter",
        "Lato",
        "Merriweather",
        "Poppins",
        "Playfair Display",
      ],
      required: true,
    },
    taxEnabled: { type: Boolean, default: true },
    taxName: { type: String, trim: true, maxlength: 50, default: "VAT" },
    taxRate: { type: Number, min: 0, max: 100, default: 15 },
    taxInclusive: { type: Boolean, default: false },
    taxEffectiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.models.StoreSettings ||
  mongoose.model("StoreSettings", storeSettingsSchema);
