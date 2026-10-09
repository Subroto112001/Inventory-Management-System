import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb"; // আপনার ডিরেক্টরি অনুযায়ী
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { isCustomer, requireAuth } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import { decreaseStock } from "@/lib/inventory/stockService";
import Offer from "@/lib/models/Offer";
import { calculateTax, getTaxSettings } from "@/lib/tax";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const access = await requirePermission(request, PERMISSIONS.ORDERS_READ);
    if (!access.ok) return access.response;
    const authenticatedUser = access.user;
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 25, 1),
      100,
    );
    const filter = isCustomer(authenticatedUser)
      ? { customerUser: authenticatedUser._id }
      : {};
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
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
    const access = await requirePermission(request, PERMISSIONS.ORDERS_CREATE);
    if (!access.ok) return access.response;
    const authenticatedUser = access.user;
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      addressId,
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
      couponCode,
    } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { message: "Cart cannot be empty!" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const savedAddress = isCustomer(authenticatedUser) ? authenticatedUser.addresses.id(addressId) : null;
    if (isCustomer(authenticatedUser) && !savedAddress) return NextResponse.json({ message: "Select one of your saved delivery addresses" }, { status: 400 });

    const productIds = cart.map((item) => item.id || item._id);
    if (productIds.some((id) => !id || !mongoose.Types.ObjectId.isValid(id))) {
      return NextResponse.json(
        { message: "One or more products are invalid" },
        { status: 400 },
      );
    }
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).lean();
    const productsById = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const orderItems = [];
    let calculatedSubtotal = 0;
    let configuredDeliveryCharge = 0;
    let standardShippingSubtotal = 0;

    for (const item of cart) {
      const rawProductId = item.id || item._id;
      const product = productsById.get(rawProductId.toString());
      const quantity = Number(item.quantity);

      if (!product) {
        return NextResponse.json(
          { message: "One or more products are unavailable" },
          { status: 400 },
        );
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return NextResponse.json(
          { message: "Each quantity must be between 1 and 10" },
          { status: 400 },
        );
      }
      if (product.currentStock < quantity) {
        return NextResponse.json(
          { message: `${product.productName} has insufficient stock` },
          { status: 409 },
        );
      }

      const productId = new mongoose.Types.ObjectId(rawProductId);
      const purchasePrice = Math.max(0, Number(product.price) * (1 - Number(product.discount || 0) / 100));
      calculatedSubtotal += purchasePrice * quantity;
      const productShipping = product.shipping || {};
      if (productShipping.freeShipping) {
        // This line has no shipping charge.
      } else if (productShipping.charge !== undefined && productShipping.charge !== null) {
        configuredDeliveryCharge += Number(productShipping.charge) * quantity;
      } else {
        standardShippingSubtotal += purchasePrice * quantity;
      }

      orderItems.push({
        product: productId,
        name: product.productName,
        sku: product.productSKU,
        quantity,
        price: purchasePrice,
      });
    }

    const taxSettings = await getTaxSettings();
    let appliedOffer = null;
    let discount = 0;
    const normalizedCoupon = String(couponCode || "")
      .trim()
      .toUpperCase();
    if (normalizedCoupon) {
      appliedOffer = await Offer.findOne({
        offerCode: normalizedCoupon,
      }).lean();
      const now = new Date();
      if (
        !appliedOffer ||
        !appliedOffer.isActive ||
        now < appliedOffer.startDate ||
        now > appliedOffer.endDate ||
        (appliedOffer.usageLimit &&
          appliedOffer.usageCount >= appliedOffer.usageLimit) ||
        calculatedSubtotal < (appliedOffer.minPurchase || 0)
      ) {
        return NextResponse.json(
          { message: "This coupon is invalid or unavailable" },
          { status: 400 },
        );
      }
      if (
        appliedOffer.applyTo === "Specific Products" &&
        orderItems.some(
          (item) =>
            !appliedOffer.products.some(
              (productId) => productId.toString() === item.product.toString(),
            ),
        )
      ) {
        return NextResponse.json(
          { message: "This coupon does not apply to all cart items" },
          { status: 400 },
        );
      }
      if (appliedOffer.perCustomerLimit && authenticatedUser._id) {
        const previousUses = await Order.countDocuments({
          customerUser: authenticatedUser._id,
          "financials.promotionCode": normalizedCoupon,
        });
        if (previousUses >= appliedOffer.perCustomerLimit)
          return NextResponse.json(
            { message: "This coupon has reached its customer usage limit" },
            { status: 400 },
          );
      }
      discount = Math.min(
        appliedOffer.discountType === "Percentage"
          ? (calculatedSubtotal * appliedOffer.discountValue) / 100
          : appliedOffer.discountValue,
        appliedOffer.maxDiscountAmount || Number.MAX_SAFE_INTEGER,
        calculatedSubtotal,
      );
    }
    const taxableSubtotal = Math.max(0, calculatedSubtotal - discount);
    const calculatedTax = calculateTax(taxableSubtotal, taxSettings);

    // Payment calculations
    let paymentStatus = "Pending";
    const numAmountReceived = isCustomer(authenticatedUser)
      ? 0
      : Number(amountReceived) || 0;
    const calculatedDelivery = orderType === "Home Delivery"
      ? configuredDeliveryCharge + (standardShippingSubtotal > 0 && standardShippingSubtotal < 75 ? 12 : 0)
      : 0;
    const numTax = calculatedTax.tax;
    const numDeliveryCharge = isCustomer(authenticatedUser)
      ? calculatedDelivery
      : Number(deliveryCharge) || 0;
    const numGrandTotal =
      taxableSubtotal +
      (taxSettings.inclusive ? 0 : numTax) +
      numDeliveryCharge;

    if (
      !isCustomer(authenticatedUser) &&
      paymentMethod === "Cash" &&
      numAmountReceived >= numGrandTotal
    ) {
      paymentStatus = "Paid";
    } else if (
      !isCustomer(authenticatedUser) &&
      paymentMethod === "Cash" &&
      numAmountReceived > 0
    ) {
      paymentStatus = "Partial";
    } else if (
      !isCustomer(authenticatedUser) &&
      (paymentMethod === "Mobile Banking" || paymentMethod === "Card")
    ) {
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
    const processedById = authenticatedUser._id;

    const orderData = {
      customer: {
        name: isCustomer(authenticatedUser)
          ? savedAddress.fullName
          : customerName,
        phone: isCustomer(authenticatedUser)
          ? savedAddress.phone
          : customerPhone || undefined,
        address: isCustomer(authenticatedUser) ? [savedAddress.address, savedAddress.area, savedAddress.city, savedAddress.postalCode, savedAddress.country].filter(Boolean).join(", ") : customerAddress,
      },
      items: orderItems,
      orderType,
      status: "Confirmed",
      financials: {
        subtotal: calculatedSubtotal,
        discount,
        tax: numTax,
        taxRate: calculatedTax.taxRate,
        taxName: taxSettings.name,
        promotionCode: appliedOffer?.offerCode,
        deliveryCharge: numDeliveryCharge,
        grandTotal: numGrandTotal,
      },
      payment: paymentDetails,
      processedBy: isCustomer(authenticatedUser) ? undefined : processedById,
      customerUser: isCustomer(authenticatedUser)
        ? authenticatedUser._id
        : undefined,
    };

    let newOrder;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const createdOrders = await Order.create([orderData], { session });
        newOrder = createdOrders[0];
        for (const item of orderItems) {
          await decreaseStock({
            productId: item.product,
            delta: item.quantity,
            movementType: "SALE",
            reason: `Order ${newOrder.orderNumber}`,
            referenceType: "ORDER",
            referenceId: newOrder._id,
            performedBy: authenticatedUser._id,
            session,
          });
        }
        if (appliedOffer) {
          const consumed = await Offer.findOneAndUpdate(
            {
              _id: appliedOffer._id,
              $or: [
                { usageLimit: { $exists: false } },
                { usageLimit: null },
                { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
              ],
            },
            { $inc: { usageCount: 1 } },
            { new: true, session },
          );
          if (!consumed) throw new Error("This coupon is no longer available");
        }
      });
    } catch (transactionError) {
      if (
        /transaction|replica set|mongos/i.test(transactionError.message || "")
      ) {
        return NextResponse.json(
          {
            message:
              "Order creation requires a MongoDB deployment with transaction support",
          },
          { status: 503 },
        );
      }
      throw transactionError;
    } finally {
      await session.endSession();
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

    if (/insufficient stock/i.test(error.message || "")) {
      return NextResponse.json(
        { message: "One or more products no longer have enough stock" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Unable to create order" },
      { status: 500 },
    );
  }
}
