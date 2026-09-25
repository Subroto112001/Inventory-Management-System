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
      {/* <FrontHeader /> */}

      <main>{children}</main>

      {/* <FrontFooter /> */}
    </div>
  );
}
