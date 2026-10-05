import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const PERMISSIONS = Object.freeze({
  PRODUCTS_READ: "products.read",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",
  INVENTORY_READ: "inventory.read",
  INVENTORY_ADJUST: "inventory.adjust",
  ORDERS_READ: "orders.read",
  ORDERS_CREATE: "orders.create",
  ORDERS_UPDATE: "orders.update",
  CUSTOMERS_READ: "customers.read",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_UPDATE: "customers.update",
  CUSTOMERS_DELETE: "customers.delete",
  BRANDS_READ: "brands.read",
  BRANDS_MANAGE: "brands.manage",
  CATEGORIES_READ: "categories.read",
  CATEGORIES_MANAGE: "categories.manage",
  OFFERS_READ: "offers.read",
  OFFERS_MANAGE: "offers.manage",
  WAREHOUSES_READ: "warehouses.read",
  WAREHOUSES_MANAGE: "warehouses.manage",
  USERS_READ: "users.read",
  USERS_MANAGE: "users.manage",
  REPORTS_READ: "reports.read",
  SETTINGS_READ: "settings.read",
  SETTINGS_MANAGE: "settings.manage",
  HOMEPAGE_MANAGE: "homepage.manage",
  SUPPLIERS_READ: "suppliers.read",
  SUPPLIERS_CREATE: "suppliers.create",
  SUPPLIERS_UPDATE: "suppliers.update",
  PROCUREMENT_READ: "procurement.read",
  PROCUREMENT_MANAGE: "procurement.manage",
  INVOICES_READ: "invoices.read",
  RETURNS_READ: "returns.read",
  RETURNS_MANAGE: "returns.manage",
  ATTENDANCE_READ: "attendance.read",
  ATTENDANCE_MANAGE: "attendance.manage",
});

const ALL_PERMISSIONS = Object.values(PERMISSIONS);
const READ_PERMISSIONS = ALL_PERMISSIONS.filter((permission) =>
  permission.endsWith(".read"),
);

const ROLE_PERMISSIONS = {
  Customer: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.BRANDS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.OFFERS_READ,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_CREATE,
  ],
  "System Admin": ALL_PERMISSIONS,
  Admin: ALL_PERMISSIONS.filter(
    (permission) =>
      ![PERMISSIONS.USERS_READ, PERMISSIONS.USERS_MANAGE].includes(permission),
  ),
  "Warehouse Manager": [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.BRANDS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.OFFERS_READ,
    PERMISSIONS.WAREHOUSES_READ,
    PERMISSIONS.REPORTS_READ,
  ],
  Manager: [
    ...READ_PERMISSIONS,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.BRANDS_MANAGE,
    PERMISSIONS.CATEGORIES_MANAGE,
    PERMISSIONS.OFFERS_MANAGE,
    PERMISSIONS.HOMEPAGE_MANAGE,
    PERMISSIONS.WAREHOUSES_READ,
    PERMISSIONS.SUPPLIERS_READ,
    PERMISSIONS.SUPPLIERS_CREATE,
    PERMISSIONS.SUPPLIERS_UPDATE,
    PERMISSIONS.PROCUREMENT_READ,
    PERMISSIONS.PROCUREMENT_MANAGE,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.RETURNS_READ,
    PERMISSIONS.RETURNS_MANAGE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.REPORTS_READ,
  ],
  "Inventory Clerk": [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_CREATE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.BRANDS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.OFFERS_READ,
    PERMISSIONS.WAREHOUSES_READ,
  ],
  "Forklift Operator": [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.WAREHOUSES_READ,
  ],
  Auditor: [...READ_PERMISSIONS, PERMISSIONS.REPORTS_READ],
  "Junior HR": [PERMISSIONS.USERS_READ, PERMISSIONS.ATTENDANCE_READ],
  "Assistant HR": [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_MANAGE,
  ],
  "Senior HR": [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.REPORTS_READ,
  ],
};

function accessResponse(status, message) {
  return NextResponse.json({ success: false, message }, { status });
}

export function permissionsFor(user) {
  if (!user) return [];
  return ROLE_PERMISSIONS[user.role] || [];
}

export function hasPermission(user, permission) {
  return permissionsFor(user).includes(permission);
}

export function hasAnyPermission(user, permissions) {
  return permissions.some((permission) => hasPermission(user, permission));
}

export async function requirePermission(request, permission) {
  const user = await requireAuth(request);
  if (!user) {
    return {
      ok: false,
      user: null,
      response: accessResponse(401, "Authentication required"),
    };
  }
  if (!hasPermission(user, permission)) {
    return {
      ok: false,
      user,
      response: accessResponse(
        403,
        "You do not have permission to perform this action",
      ),
    };
  }
  return { ok: true, user, response: null };
}

export async function requireAnyPermission(request, permissions) {
  const user = await requireAuth(request);
  if (!user) {
    return {
      ok: false,
      user: null,
      response: accessResponse(401, "Authentication required"),
    };
  }
  if (!hasAnyPermission(user, permissions)) {
    return {
      ok: false,
      user,
      response: accessResponse(
        403,
        "You do not have permission to perform this action",
      ),
    };
  }
  return { ok: true, user, response: null };
}

export async function requireStaff(request) {
  const user = await requireAuth(request);
  if (!user) {
    return {
      ok: false,
      user: null,
      response: accessResponse(401, "Authentication required"),
    };
  }
  if (user.role === "Customer") {
    return {
      ok: false,
      user,
      response: accessResponse(403, "Staff access required"),
    };
  }
  return { ok: true, user, response: null };
}

export async function requireRole(request, roles) {
  const user = await requireAuth(request);
  if (!user) {
    return {
      ok: false,
      user: null,
      response: accessResponse(401, "Authentication required"),
    };
  }
  if (!roles.includes(user.role)) {
    return {
      ok: false,
      user,
      response: accessResponse(
        403,
        "You do not have permission to perform this action",
      ),
    };
  }
  return { ok: true, user, response: null };
}
