import AuthLayout from "@/Component/Layout/AuthLayout";
import { getStoreSettings } from "@/lib/storeSettings";

export const metadata = {
  title: "Authentication | Skripto",
  description: "Sign in or create an account.",
};

export default async function AuthenticationLayout({ children }) {
  const settings = await getStoreSettings();
  const branding = {
    storeName: settings.storeName,
    logoUrl: settings.logo?.url || null,
    primaryColor: settings.primaryColor,
    surfaceColor: settings.surfaceColor,
    textColor: settings.textColor,
    mutedTextColor: settings.mutedTextColor,
    borderColor: settings.borderColor,
    accentColor: settings.accentColor,
  };
  return <AuthLayout branding={branding}>{children}</AuthLayout>;
}
