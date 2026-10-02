import connectMongoDB from "@/lib/databse/mongodb";
import StoreSettings, {
  DEFAULT_STORE_SETTINGS,
} from "@/lib/models/StoreSettings";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

function hexToRgb(value) {
  if (!HEX_COLOR.test(value)) return null;
  return [1, 3, 5].map((index) => parseInt(value.slice(index, index + 2), 16));
}

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(first, second) {
  const firstRgb = hexToRgb(first);
  const secondRgb = hexToRgb(second);
  if (!firstRgb || !secondRgb) return 1;
  const luminance = (rgb) =>
    0.2126 * channel(rgb[0]) +
    0.7152 * channel(rgb[1]) +
    0.0722 * channel(rgb[2]);
  const light = Math.max(luminance(firstRgb), luminance(secondRgb));
  const dark = Math.min(luminance(firstRgb), luminance(secondRgb));
  return (light + 0.05) / (dark + 0.05);
}

export function readableText(background) {
  return contrastRatio(background, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#211F1D";
}

function adjustColor(value, amount) {
  const rgb = hexToRgb(value);
  if (!rgb) return value;
  return `#${rgb
    .map((channelValue) =>
      Math.max(0, Math.min(255, channelValue + amount))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function normalizeTheme(settings = {}) {
  const merged = { ...DEFAULT_STORE_SETTINGS, ...(settings || {}) };
  const primaryText = readableText(merged.primaryColor);
  const secondaryText = readableText(
    merged.secondaryColor || merged.accentColor,
  );
  return {
    storeName: merged.storeName,
    tagline: merged.tagline,
    logo: merged.logo || null,
    favicon: merged.favicon || null,
    fontFamily: merged.fontFamily,
    primary: merged.primaryColor,
    secondary: merged.secondaryColor || merged.accentColor,
    accent: merged.accentColor,
    background: merged.backgroundColor || merged.surfaceColor,
    surface: merged.surfaceColor,
    text: merged.textColor,
    muted: merged.mutedTextColor,
    border: merged.borderColor,
    success: merged.successColor,
    warning: merged.warningColor,
    error: merged.errorColor,
    primaryHover: adjustColor(
      merged.primaryColor,
      contrastRatio(merged.primaryColor, "#FFFFFF") > 7 ? -20 : 20,
    ),
    secondaryHover: adjustColor(
      merged.secondaryColor || merged.accentColor,
      -15,
    ),
    primaryText,
    secondaryText,
  };
}

export function themeStyleVars(settings) {
  const theme = normalizeTheme(settings);
  return {
    "--theme-primary": theme.primary,
    "--theme-primary-hover": theme.primaryHover,
    "--theme-primary-text": theme.primaryText,
    "--theme-secondary": theme.secondary,
    "--theme-secondary-hover": theme.secondaryHover,
    "--theme-secondary-text": theme.secondaryText,
    "--theme-accent": theme.accent,
    "--theme-background": theme.background,
    "--theme-surface": theme.surface,
    "--theme-text": theme.text,
    "--theme-muted": theme.muted,
    "--theme-border": theme.border,
    "--theme-success": theme.success,
    "--theme-warning": theme.warning,
    "--theme-error": theme.error,
    "--theme-font": theme.fontFamily,
    "--store-primary": theme.primary,
    "--store-accent": theme.accent,
    "--store-surface": theme.surface,
    "--store-text": theme.text,
    "--store-font": theme.fontFamily,
  };
}

export async function getStoreSettings() {
  try {
    await connectMongoDB();
    const settings = await StoreSettings.findOne({ key: "default" }).lean();
    return { ...DEFAULT_STORE_SETTINGS, ...(settings || {}) };
  } catch (error) {
    console.error("Failed to load store settings:", error?.message);
    return { ...DEFAULT_STORE_SETTINGS };
  }
}

export { HEX_COLOR };
