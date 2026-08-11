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
      userId,
    } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { message: "Cart cannot be empty!" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    // Map cart items and validate MongoDB ObjectIds
    const orderItems = [];
    const bulkStockUpdates = [];

    for (const item of cart) {
      const rawProductId = item.id || item._id;

      if (!rawProductId || !mongoose.Types.ObjectId.isValid(rawProductId)) {
        return NextResponse.json(
          {
            message: `Invalid product ID for item: ${item.productName || item.name}`,
          },
          { status: 400 },
        );
      }

      const productId = new mongoose.Types.ObjectId(rawProductId);

      orderItems.push({
        product: productId,
        name: item.productName || item.name,
        sku: item.productSKU || item.sku,
        quantity: Number(item.quantity),
        price: Number(item.price),
      });

      bulkStockUpdates.push({
        updateOne: {
          filter: { _id: productId },
          update: { $inc: { currentStock: -Number(item.quantity) } },
        },
      });
    }

    // Payment calculations
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
          ? { provider: mobileBankingProvider, transactionId }
          : undefined,
      cardDetails:
        paymentMethod === "Card" ? { cardType, cardLast4 } : undefined,
    };

    // Safe ObjectId conversion for processedBy
    const processedById =
      userId && mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : new mongoose.Types.ObjectId("000000000000000000000000");

    const newOrder = await Order.create({
      customer: {
        name: customerName,
        phone: customerPhone || undefined,
        address: customerAddress,
      },
      items: orderItems,
      orderType,
      status: "Confirmed",
      financials: {
        subtotal: Number(subtotal),
        tax: Number(tax),
        deliveryCharge: Number(deliveryCharge),
        grandTotal: numGrandTotal,
      },
      payment: paymentDetails,
      processedBy: processedById,
    });

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

    if (error.name === "CastError") {
      return NextResponse.json(
        { message: `Invalid ID format: ${error.value}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}