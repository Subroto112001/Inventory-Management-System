import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/lib/models/Order";
import Invoice from "@/lib/models/Invoice";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
import { hasAnyPermission, PERMISSIONS } from "@/lib/authorization";
import connectMongoDB from "@/lib/databse/mongodb";
import { getStoreSettings } from "@/lib/storeSettings";

export async function GET(request, { params }) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json(
      { success: false, message: "Invoice not found" },
      { status: 404 },
    );
  await connectMongoDB();
  const order = await Order.findOne({
    _id: id,
    ...(isCustomer(user) ? { customerUser: user._id } : {}),
  }).lean();
  if (!order)
    return NextResponse.json(
      { success: false, message: "Invoice not found" },
      { status: 404 },
    );
  if (
    !isCustomer(user) &&
    !hasAnyPermission(user, [
      PERMISSIONS.INVOICES_READ,
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.REPORTS_READ,
    ])
  )
    return NextResponse.json(
      {
        success: false,
        message: "You do not have permission to view invoices",
      },
      { status: 403 },
    );
  let invoice = await Invoice.findOne({ order: order._id }).lean();
  if (!invoice) {
    const settings = await getStoreSettings();
    const items = order.items.map((item) => ({
      product: item.product,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.price,
      discount: 0,
      tax: 0,
    }));
    try {
      invoice = await Invoice.create({
        invoiceNumber: `INV-${order.orderNumber}`,
        order: order._id,
        orderNumber: order.orderNumber,
        customerUser: order.customerUser,
        customer: order.customer,
        items,
        subtotal: order.financials.subtotal,
        discount: order.financials.discount || 0,
        tax: order.financials.tax,
        taxRate: order.financials.taxRate || 0,
        deliveryCharge: order.financials.deliveryCharge || 0,
        total: order.financials.grandTotal,
        paymentStatus: order.payment?.paymentStatus,
        storeName: settings.storeName,
      });
      invoice = invoice.toObject();
    } catch (error) {
      if (error.code === 11000)
        invoice = await Invoice.findOne({ order: order._id }).lean();
      else throw error;
    }
  }
  if (new URL(request.url).searchParams.get("format") === "html") {
    const escapeHtml = (value) =>
      String(value ?? "").replace(
        /[&<>\"]/g,
        (character) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[
            character
          ],
      );
    const rows = invoice.items
      .map(
        (item) =>
          `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>${Number(item.unitPrice).toFixed(2)}</td><td>${(item.quantity * item.unitPrice).toFixed(2)}</td></tr>`,
      )
      .join("");
    return new Response(
      `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(invoice.invoiceNumber)}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#222}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border:1px solid #ddd;padding:8px;text-align:left}.total{text-align:right;margin-top:24px}</style></head><body><h1>${escapeHtml(invoice.storeName || "Invoice")}</h1><h2>${escapeHtml(invoice.invoiceNumber)}</h2><p>Order: ${escapeHtml(invoice.orderNumber)}<br>Customer: ${escapeHtml(invoice.customer?.name)}<br>${escapeHtml(invoice.customer?.address)}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><div class="total"><p>Subtotal: ${invoice.subtotal.toFixed(2)}</p><p>Discount: ${invoice.discount.toFixed(2)}</p><p>Tax: ${invoice.tax.toFixed(2)}</p><h2>Total: ${invoice.total.toFixed(2)}</h2></div></body></html>`,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.html"`,
        },
      },
    );
  }
  return NextResponse.json({ success: true, invoice });
}
