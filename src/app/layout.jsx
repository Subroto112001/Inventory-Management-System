import Header from "@/Component/Header";
import Sidebar from "@/Component/Sidebar";
import "./globals.css";

export const metadata = {
  title: "Dashboard | Skripto",
  description: "View your business analytics and operations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Main Wrapper */}
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <header
            className="h-[70px] w-full shrink-0 z-50 shadow-md bg-[#611F69]"
            aria-label="Global Header"
          >
            <Header />
          </header>

          {/* Dashboard Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside
              className="
                hidden md:block
                w-[260px]
                shrink-0
                h-full
                bg-white
                border-r
                border-gray-200
                overflow-y-auto
              "
              aria-label="Sidebar Navigation"
            >
              <Sidebar />
            </aside>

            {/* Main Content */}
            <main
              className="
                flex-1
                h-full
                overflow-y-auto
                p-4
                md:p-6
              "
              id="main-content"
              tabIndex="-1"
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
