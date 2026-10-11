import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const annotationSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, trim: true, maxlength: 180, default: "" },
    kind: { type: String, enum: ["feature", "measurement"], default: "feature" },
    x: { type: Number, min: 0, max: 100, required: true },
    y: { type: Number, min: 0, max: 100, required: true },
    x2: { type: Number, min: 0, max: 100, default: 70 },
    y2: { type: Number, min: 0, max: 100, default: 50 },
    measurementValue: { type: String, trim: true, maxlength: 30, default: "" },
    measurementUnit: { type: String, trim: true, maxlength: 15, default: "" },
    verified: { type: Boolean, default: false },
  },
  { _id: false },
);

const productAnalysisSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
      index: true,
    },
    sourceImage: { type: String, required: true, maxlength: 2048 },
    summary: { type: String, trim: true, maxlength: 500, default: "" },
    annotations: {
      type: [annotationSchema],
      default: [],
      validate: [(items) => items.length <= 8, "A product analysis can have at most eight annotations"],
    },
    infographicSvg: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null },
    renderVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export default mongoose.models.ProductAnalysis ||
  mongoose.model("ProductAnalysis", productAnalysisSchema);
