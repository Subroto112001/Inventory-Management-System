import StoreSettings, {
  DEFAULT_STORE_SETTINGS,
} from "@/lib/models/StoreSettings";
import connectMongoDB from "@/lib/databse/mongodb";

export async function getTaxSettings() {
  await connectMongoDB();
  const settings = await StoreSettings.findOne({ key: "default" }).lean();
  return {
    enabled: settings?.taxEnabled ?? true,
    name: settings?.taxName || "VAT",
    rate: Number(settings?.taxRate ?? 15),
    inclusive: Boolean(settings?.taxInclusive),
    effectiveDate: settings?.taxEffectiveDate || new Date(),
    storeName: settings?.storeName || DEFAULT_STORE_SETTINGS.storeName,
  };
}

export function calculateTax(subtotal, settings) {
  const amount = Math.max(0, Number(subtotal) || 0);
  if (!settings?.enabled || !settings.rate) return { tax: 0, taxRate: 0 };
  const tax = settings.inclusive
    ? amount - amount / (1 + settings.rate / 100)
    : (amount * settings.rate) / 100;
  return { tax: Number(tax.toFixed(2)), taxRate: settings.rate };
}
