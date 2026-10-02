import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import StockMovement from "@/lib/models/StockMovement";
import PurchaseOrder from "@/lib/models/PurchaseOrder";
import Supplier from "@/lib/models/Supplier";
import Attendance from "@/lib/models/Attendance";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";

export const dynamic = "force-dynamic";

function dateBoundary(value, end = false) {
  if (!value) return null;
  const date = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request) {
  const access = await requirePermission(request, PERMISSIONS.REPORTS_READ);
  if (!access.ok) return access.response;
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const from =
      dateBoundary(searchParams.get("from")) ||
      new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );
    const to = dateBoundary(searchParams.get("to"), true) || now;
    if (from > to)
      return NextResponse.json(
        { success: false, message: "Invalid report date range" },
        { status: 400 },
      );
    await connectMongoDB();
    const orderMatch = { createdAt: { $gte: from, $lte: to } };
    const [
      orderSummary,
      productSummary,
      customers,
      lowStock,
      movementSummary,
      purchaseOrders,
      suppliers,
      attendance,
    ] = await Promise.all([
      Order.aggregate([
        { $match: orderMatch },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Cancelled"] },
                  0,
                  "$financials.grandTotal",
                ],
              },
            },
            items: { $sum: { $sum: "$items.quantity" } },
          },
        },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ["$isActive", 1, 0] } },
            stock: { $sum: "$currentStock" },
          },
        },
      ]),
      User.countDocuments({ role: "Customer", accountStatus: "Active" }),
      Product.countDocuments({
        isActive: true,
        $expr: { $lte: ["$currentStock", "$lowStockAlert"] },
      }),
      StockMovement.aggregate([
        { $match: { createdAt: { $gte: from, $lte: to } } },
        {
          $group: {
            _id: "$movementType",
            quantity: {
              $sum: {
                $cond: [
                  { $eq: ["$direction", "IN"] },
                  "$quantity",
                  { $multiply: ["$quantity", -1] },
                ],
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),
      PurchaseOrder.countDocuments({ createdAt: { $gte: from, $lte: to } }),
      Supplier.countDocuments({ status: "Active" }),
      Attendance.aggregate([
        { $match: { date: { $gte: from, $lte: to } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);
    const orders = orderSummary.reduce((result, item) => {
      result[item._id] = item;
      return result;
    }, {});
    return NextResponse.json({
      success: true,
      range: { from, to },
      metrics: {
        orders: Object.values(orders).reduce(
          (sum, item) => sum + item.count,
          0,
        ),
        revenue: Object.values(orders).reduce(
          (sum, item) => sum + item.revenue,
          0,
        ),
        productsSold: Object.values(orders).reduce(
          (sum, item) => sum + item.items,
          0,
        ),
        customers,
        products: productSummary[0] || { total: 0, active: 0, stock: 0 },
        lowStock,
        purchaseOrders,
        activeSuppliers: suppliers,
        orderStatuses: orders,
        stockMovements: movementSummary,
        attendance,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to generate report" },
      { status: 500 },
    );
  }
}
