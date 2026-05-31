import MainLayout from "@/Component/Layout/MainLayout";

export const metadata = {
  title: "Dashboard | Skripto",
  description: "View your business analytics and operations.",
};

export default function DashboardLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
