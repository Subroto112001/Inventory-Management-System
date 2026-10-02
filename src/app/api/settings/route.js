import { NextResponse } from "next/server";
import { requirePermission, PERMISSIONS } from "@/lib/authorization";
import connectMongoDB from "@/lib/databse/mongodb";
import StoreSettings, {
  DEFAULT_STORE_SETTINGS,
} from "@/lib/models/StoreSettings";
import { contrastRatio, HEX_COLOR, normalizeTheme } from "@/lib/storeSettings";
import { recordAuditLog } from "@/lib/auditLog";

const FONT_FAMILIES = [
  "League Spartan",
  "Inter",
  "Lato",
  "Merriweather",
  "Poppins",
  "Playfair Display",
];

function sanitize(settings) {
  const theme = settings.theme || {};
  const branding = settings.branding || {};
  const asset = (value) => {
    const url = typeof value === "string" ? value.trim() : value?.url?.trim();
    return url ? { url } : undefined;
  };
  return {
    storeName: String(
      settings.storeName ||
        branding.storeName ||
        DEFAULT_STORE_SETTINGS.storeName,
    ).trim(),
    tagline: String(
      settings.tagline ?? branding.tagline ?? DEFAULT_STORE_SETTINGS.tagline,
    ).trim(),
    logo: asset(settings.logo || branding.logo),
    favicon: asset(settings.favicon || branding.favicon),
    storeId: "default",
    primaryColor:
      settings.primaryColor ||
      theme.primary ||
      DEFAULT_STORE_SETTINGS.primaryColor,
    secondaryColor:
      settings.secondaryColor ||
      theme.secondary ||
      DEFAULT_STORE_SETTINGS.secondaryColor,
    accentColor:
      settings.accentColor ||
      theme.accent ||
      DEFAULT_STORE_SETTINGS.accentColor,
    surfaceColor:
      settings.surfaceColor ||
      theme.surface ||
      DEFAULT_STORE_SETTINGS.surfaceColor,
    backgroundColor:
      settings.backgroundColor ||
      theme.background ||
      DEFAULT_STORE_SETTINGS.backgroundColor,
    textColor:
      settings.textColor || theme.text || DEFAULT_STORE_SETTINGS.textColor,
    mutedTextColor:
      settings.mutedTextColor ||
      theme.muted ||
      DEFAULT_STORE_SETTINGS.mutedTextColor,
    borderColor:
      settings.borderColor ||
      theme.border ||
      DEFAULT_STORE_SETTINGS.borderColor,
    successColor:
      settings.successColor ||
      theme.success ||
      DEFAULT_STORE_SETTINGS.successColor,
    warningColor:
      settings.warningColor ||
      theme.warning ||
      DEFAULT_STORE_SETTINGS.warningColor,
    errorColor:
      settings.errorColor || theme.error || DEFAULT_STORE_SETTINGS.errorColor,
    fontFamily:
      settings.fontFamily ||
      settings.typography?.font ||
      DEFAULT_STORE_SETTINGS.fontFamily,
    taxEnabled: settings.taxEnabled !== false,
    taxName: String(settings.taxName || "VAT").trim(),
    taxRate: Number(settings.taxRate ?? 15),
    taxInclusive: Boolean(settings.taxInclusive),
    taxEffectiveDate: settings.taxEffectiveDate || new Date(),
  };
}

export async function GET(request) {
  const access = await requirePermission(request, PERMISSIONS.SETTINGS_READ);
  if (!access.ok) return access.response;

  await connectMongoDB();
  const settings = await StoreSettings.findOne({ key: "default" }).lean();
  const resolved = { ...DEFAULT_STORE_SETTINGS, ...(settings || {}) };
  return NextResponse.json({
    settings: { ...resolved, theme: normalizeTheme(resolved) },
  });
}

export async function PUT(request) {
  const access = await requirePermission(request, PERMISSIONS.SETTINGS_MANAGE);
  if (!access.ok) return access.response;

  const settings = sanitize(await request.json());
  const unsafeUrl = [settings.logo?.url, settings.favicon?.url].some(
    (value) => value && !/^https:\/\/.+/.test(value),
  );
  const colors = [
    settings.primaryColor,
    settings.secondaryColor,
    settings.accentColor,
    settings.surfaceColor,
    settings.backgroundColor,
    settings.textColor,
    settings.mutedTextColor,
    settings.borderColor,
    settings.successColor,
    settings.warningColor,
    settings.errorColor,
  ];
  if (
    settings.storeName.length < 2 ||
    settings.storeName.length > 80 ||
    !colors.every((color) => HEX_COLOR.test(color)) ||
    unsafeUrl ||
    !FONT_FAMILIES.includes(settings.fontFamily) ||
    !settings.taxName ||
    !Number.isFinite(settings.taxRate) ||
    settings.taxRate < 0 ||
    settings.taxRate > 100
  ) {
    return NextResponse.json(
      { message: "Please provide valid store branding values" },
      { status: 400 },
    );
  }

  const warnings = [];
  if (contrastRatio(settings.primaryColor, "#FFFFFF") < 3)
    warnings.push(
      "Primary color has low contrast with white text; dark text will be used automatically.",
    );
  if (contrastRatio(settings.surfaceColor, settings.textColor) < 4.5)
    warnings.push("Surface and text colors do not meet recommended contrast.");

  await connectMongoDB();
  const saved = await StoreSettings.findOneAndUpdate(
    { key: "default" },
    { $set: settings, $setOnInsert: { key: "default" } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  ).lean();
  await recordAuditLog({
    actor: access.user._id,
    action: "SETTINGS_UPDATE",
    resource: "StoreSettings",
    resourceId: saved._id,
    metadata: { storeName: saved.storeName },
  });

  return NextResponse.json({
    message: "Store branding saved",
    settings: saved,
    warnings,
  });
}
