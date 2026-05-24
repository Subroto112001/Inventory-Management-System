import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "../Component/Header";
import Sidebar from "@/Component/Sidebar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// SEO-optimized metadata
export const metadata = {
  title: "Dashboard | Business Management System",
  description:
    "Manage your business operations, orders, and user profiles efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body
        className={`${poppins.className} h-screen overflow-hidden flex flex-col bg-white text-gray-900`}
      >
        {/* Header — shrink-0 keeps it from compressing */}
        <header className="w-full shrink-0 z-50 shadow-md bg-[#611F69]">
          <Header />
        </header>

        {/* overflow-hidden here prevents the row itself from scrolling */}
        <div className="flex flex-row gap-1 flex-1 overflow-hidden">
          {/* Sidebar — no overflow, stays locked in place */}
          <aside className="w-[15%] h-full" aria-label="Sidebar Navigation">
            <Sidebar />
          </aside>

          {/* Only main scrolls */}
          <main className="w-[85%] h-full overflow-y-auto" id="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}