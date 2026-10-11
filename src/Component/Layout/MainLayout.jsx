import Header from "@/Component/Header";
import Sidebar from "@/Component/Sidebar";
import {
  getStoreSettings,
  normalizeTheme,
  themeStyleVars,
} from "@/lib/storeSettings";

export default async function MainLayout({ children, currentUser }) {
  const settings = await getStoreSettings();
  const theme = normalizeTheme(settings);

  return (
    <div
      className="flex h-dvh min-h-0 overflow-hidden bg-[var(--theme-background)]"
      style={{
        ...themeStyleVars(settings),
        fontFamily: theme.fontFamily,
        "--color-primary": theme.primary,
        "--color-primary-container": theme.primary,
      }}
    >
      <Sidebar settings={theme} currentUser={currentUser} showMobileButton={false} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header settings={theme} currentUser={currentUser} />
        <main
          className="dashboard-layout-scroll min-h-0 min-w-0 flex-1 overflow-y-auto p-4 focus:outline-none sm:p-5 lg:p-7"
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
