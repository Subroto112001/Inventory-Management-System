import AuthLayout from "@/Component/Layout/AuthLayout";

export const metadata = {
  title: "Authentication | Skripto",
  description: "Sign in or create an account.",
};

export default function AuthenticationLayout({ children }) {
  return <AuthLayout>{children}</AuthLayout>;
}
