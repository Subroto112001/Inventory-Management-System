import { CartProvider } from "@/Component/website/Cart/CartContext";
import CartSidebar from "@/Component/website/Cart/Cartsidebar";
import { WishlistProvider } from "@/Component/website/Cart/WishlistContext";
import { CompareProvider } from "@/Component/website/Cart/CompareContext";
import FrontFooter from "@/Component/website/GlobalComponent/FrontFooter";
import FrontHeader from "@/Component/website/GlobalComponent/FrontHeader";
import {
  getStoreSettings,
  normalizeTheme,
  themeStyleVars,
} from "@/lib/storeSettings";
import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default async function FrontendLayout({ children }) {
  const settings = await getStoreSettings();
  const theme = normalizeTheme(settings);

  return (
    <div
      className={leagueSpartan.className}
      style={{
        ...themeStyleVars(settings),
        fontFamily: theme.fontFamily,
      }}
    >
      <CartProvider>
       <CompareProvider>
        <WishlistProvider branding={theme}>
        <FrontHeader settings={theme} />
        <main>{children}</main>
        <FrontFooter settings={theme} />
        <CartSidebar />
        </WishlistProvider>
       </CompareProvider>
      </CartProvider>
    </div>
  );
}
