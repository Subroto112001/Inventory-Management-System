import Header from "@/Component/Header";
import Sidebar from "@/Component/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <header
        className="h-[70px] w-full shrink-0 z-50 shadow-md bg-[#611F69]"
        aria-label="Global Header"
      >
        <Header />
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside
          className="hidden md:block w-[260px] shrink-0 h-full bg-white border-r border-gray-200 overflow-y-auto"
          aria-label="Sidebar Navigation"
        >
          <Sidebar />
        </aside>

        <main
          className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6"
          id="main-content"
          tabIndex="-1"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
