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
        className={`${poppins.className} min-h-screen flex flex-col bg-white text-gray-900`}
      >
        {/* Sticky Header Wrapper */}
        <header className="w-full sticky top-0 z-50 shadow-md bg-[#611F69]">
          <Header />
        </header>

        <div className="flex flex-row gap-1 flex-1">
          {/* Semantic aside for Sidebar */}
          <aside className="w-[15%]" aria-label="Sidebar Navigation">
            <Sidebar />
          </aside>

          {/* Semantic main for page content */}
          <main className="w-[85%]" id="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
