import mongoose from "mongoose";

const { Schema } = mongoose;

const newsletterSubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      unique: true,
    },
    status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed" },
    source: { type: String, default: "homepage-special-offer" },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

newsletterSubscriberSchema.index({ email: 1 }, { unique: true });

const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);

export default NewsletterSubscriber;
