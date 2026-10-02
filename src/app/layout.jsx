import "./globals.css";
import {
  getStoreSettings,
  normalizeTheme,
  themeStyleVars,
} from "@/lib/storeSettings";

export async function generateMetadata() {
  const theme = normalizeTheme(await getStoreSettings());
  return {
    title: `${theme.storeName} | Inventory Management System`,
    description:
      theme.tagline || "Inventory and business management application.",
    icons: theme.favicon?.url ? { icon: theme.favicon.url } : undefined,
  };
}

export default async function RootLayout({ children }) {
  const settings = await getStoreSettings();
  const theme = normalizeTheme(settings);
  return (
    <html lang="en">
      <body
        className="min-h-screen antialiased"
        style={themeStyleVars(settings)}
      >
        <div data-store-name={theme.storeName}>{children}</div>
      </body>
    </html>
  );
}
