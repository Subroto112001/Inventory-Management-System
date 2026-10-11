import MainLayout from "@/Component/Layout/MainLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";

export const metadata = {
  title: "Dashboard | Skripto",
  description: "View your business analytics and operations.",
};

export default async function DashboardLayout({ children }) {
  const user = await getAuthenticatedUser(await cookies());
  if (!user) {
    redirect("/login");
  }
  if (user.role === "Customer") {
    redirect("/");
  }

  const currentUser = user ? {
    id: user._id?.toString(),
    role: user.role,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  } : null;
  return <MainLayout currentUser={currentUser}>{children}</MainLayout>;
}
