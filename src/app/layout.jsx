import "./globals.css";

export const metadata = {
  title: "Skripto | Inventory Management System",
  description: "Inventory and business management application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] antialiased">{children}</body>
    </html>
  );
}
