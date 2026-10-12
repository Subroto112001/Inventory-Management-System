import { NextResponse } from "next/server";
import crypto from "node:crypto";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import ExclusiveProduct from "@/lib/models/ExclusiveProduct";

export const dynamic = "force-dynamic";

export async function GET(request) { return run(request); }
export async function POST(request) { return run(request); }

async function run(request) {
  const secret = process.env.SCHEDULER_SECRET;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!secret || secret.length < 24 || provided.length !== secret.length || !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(secret)))
    return NextResponse.json({ success: false, message: "Unauthorized scheduler request." }, { status: 401 });
  try {
    await connectMongoDB();
    const now = new Date();
    const due = await Product.find({ lifecycle: "scheduled", isActive: true, launchAt: { $lte: now } }).select("_id featuredOnLaunch").lean();
    if (due.length) {
      const ids = due.map((product) => product._id);
      await Product.updateMany({ _id: { $in: ids }, lifecycle: "scheduled", launchAt: { $lte: now } }, { $set: { lifecycle: "live" } });
    }
    const featured = await Product.find({ lifecycle: "live", isActive: true, featuredOnLaunch: true }).select("_id").lean();
    if (featured.length) {
      await ExclusiveProduct.bulkWrite(
        featured.map(({ _id: productId }) => ({
          updateOne: {
            filter: { productId },
            update: { $set: { isActive: true }, $setOnInsert: { productId, displayOrder: 0 } },
            upsert: true,
          },
        })),
        { ordered: false },
      );
    }
    return NextResponse.json({ success: true, processed: due.length, checkedAt: now.toISOString() });
  } catch (error) {
    console.error("Scheduled product launch failed", error);
    return NextResponse.json({ success: false, message: "Scheduled launch processing failed." }, { status: 500 });
  }
}
