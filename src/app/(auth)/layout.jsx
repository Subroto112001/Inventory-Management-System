import AuthLayout from "@/Component/Layout/AuthLayout";
import { getStoreSettings, normalizeTheme } from "@/lib/storeSettings";

export const metadata = {
  title: "Authentication | Skripto",
  description: "Sign in or create an account.",
};

export default async function AuthenticationLayout({ children }) {
  const settings = await getStoreSettings();
  const theme = normalizeTheme(settings);
  const branding = {
    storeName: settings.storeName,
    logoUrl: settings.logo?.url || null,
    primaryColor: theme.primary,
    surfaceColor: settings.surfaceColor,
    backgroundColor: settings.backgroundColor,
    textColor: settings.textColor,
    mutedTextColor: settings.mutedTextColor,
    borderColor: settings.borderColor,
    accentColor: settings.accentColor,
  };
  return <AuthLayout branding={branding}>{children}</AuthLayout>;
}
