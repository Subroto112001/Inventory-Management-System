import { CartProvider } from "@/Component/website/Cart/CartContext";
import CartSidebar from "@/Component/website/Cart/Cartsidebar";
import FrontFooter from "@/Component/website/GlobalComponent/FrontFooter";
import FrontHeader from "@/Component/website/GlobalComponent/FrontHeader";
import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function FrontendLayout({ children }) {
  return (
    <div className={leagueSpartan.className}>
      <CartProvider>
        <FrontHeader />
        <main>{children}</main>
        <FrontFooter />
        <CartSidebar />
      </CartProvider>
    </div>
  );
}