import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb"; // আপনার ডিরেক্টরি অনুযায়ী
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: সব অর্ডার ফেচ করার জন্য
export async function GET() {
  try {
    await connectMongoDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Fetch Orders API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST: নতুন অর্ডার তৈরি করার জন্য
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      cart,
      orderType,
      deliveryPaymentType,
      paymentMethod,
      amountReceived,
      mobileBankingProvider,
      transactionId,
      cardType,
      cardLast4,
      subtotal,
      tax,
      deliveryCharge,
      grandTotal,
      userId, // Auth session থেকে ইউজারের ID পাঠাতে হবে
    } = body;

    // ১. বেসিক ভ্যালিডেশন
    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { message: "Cart cannot be empty!" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    // ২. কার্ট আইটেমগুলোকে অর্ডার স্কিমা অনুযায়ী ফরম্যাট করা
    const orderItems = cart.map((item) => ({
      product: item.id || item._id, // ফ্রন্টএন্ডে id থাকলে সেটা ব্যবহার হবে
      name: item.name || item.productName,
      sku: item.sku || item.productSKU,
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    // ৩. পেমেন্ট স্ট্যাটাস ক্যালকুলেশন
    let paymentStatus = "Pending";
    const numAmountReceived = Number(amountReceived) || 0;
    const numGrandTotal = Number(grandTotal) || 0;

    if (paymentMethod === "Cash" && numAmountReceived >= numGrandTotal) {
      paymentStatus = "Paid";
    } else if (paymentMethod === "Cash" && numAmountReceived > 0) {
      paymentStatus = "Partial";
    } else if (paymentMethod === "Mobile Banking" || paymentMethod === "Card") {
      paymentStatus = "Paid";
    }

    if (orderType === "Home Delivery" && deliveryPaymentType === "COD") {
      paymentStatus = "Pending";
    }

    // ৪. পেমেন্ট অবজেক্ট তৈরি
    const paymentDetails = {
      method: paymentMethod,
      deliveryPaymentType:
        orderType === "Home Delivery" ? deliveryPaymentType : "N/A",
      paymentStatus,
      cashDetails:
        paymentMethod === "Cash"
          ? {
              amountReceived: numAmountReceived,
              changeAmount:
                numAmountReceived > numGrandTotal
                  ? numAmountReceived - numGrandTotal
                  : 0,
            }
          : undefined,
      mobileBankingDetails:
        paymentMethod === "Mobile Banking"
          ? {
              provider: mobileBankingProvider,
              transactionId,
            }
          : undefined,
      cardDetails:
        paymentMethod === "Card"
          ? {
              cardType,
              cardLast4,
            }
          : undefined,
    };

    // আপনার স্কিমাতে processedBy ফিল্ডটি required.
    // প্রোডাকশনে এখানে লগ-ইন করা ইউজারের ID বসবে।
    // আপাতত ডামি একটি ObjectId দেওয়া হলো যদি ফ্রন্টএন্ড থেকে userId না আসে।
    const processedById = userId
      ? new mongoose.Types.ObjectId(userId)
      : new mongoose.Types.ObjectId("000000000000000000000000");

    // ৫. ডাটাবেসে অর্ডার ক্রিয়েট করা
    const newOrder = await Order.create({
      customer: {
        name: customerName,
        phone: customerPhone || undefined, // empty string থাকলে undefined পাস করা ভালো, validation error এড়াতে
        address: customerAddress,
      },
      items: orderItems,
      orderType,
      status: "Confirmed", // অর্ডার তৈরির পর ডিফল্ট স্ট্যাটাস Confirmed রাখা হলো
      financials: {
        subtotal: Number(subtotal),
        tax: Number(tax),
        deliveryCharge: Number(deliveryCharge),
        grandTotal: numGrandTotal,
      },
      payment: paymentDetails,
      processedBy: processedById,
    });

    // ৬. প্রোডাক্টের বর্তমান স্টক (currentStock) কমানো
    const bulkStockUpdates = cart.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $inc: { currentStock: -Number(item.quantity) } }, // quantity অনুযায়ী স্টক মাইনাস হবে
      },
    }));

    if (bulkStockUpdates.length > 0) {
      await Product.bulkWrite(bulkStockUpdates);
    }

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        success: true,
        order: newOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Order API Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { message: messages.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
