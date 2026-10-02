import Header from "@/Component/Header";
import Sidebar from "@/Component/Sidebar";
import {
  getStoreSettings,
  normalizeTheme,
  themeStyleVars,
} from "@/lib/storeSettings";

export default async function MainLayout({ children }) {
  const settings = await getStoreSettings();
  const theme = normalizeTheme(settings);

  return (
    <div
      className="flex h-screen flex-col bg-[var(--theme-background)]"
      style={{
        ...themeStyleVars(settings),
        fontFamily: theme.fontFamily,
        "--color-primary": theme.primary,
        "--color-primary-container": theme.primary,
      }}
    >
      {/* Header Section */}
      <header
        className="h-[70px] w-full shrink-0 z-50 shadow-md bg-[var(--theme-primary)]"
        aria-label="Global Header"
      >
        <Header settings={theme} />
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar settings={theme} />

        {/* Main Content */}
        <main
          className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-6 focus:outline-none"
          id="main-content"
          tabIndex="-1"
          aria-label="Main Content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
