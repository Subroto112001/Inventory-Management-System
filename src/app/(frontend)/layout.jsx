import FrontFooter from "@/Component/website/GlobalComponent/FrontFooter";
import FrontHeader from "@/Component/website/GlobalComponent/FrontHeader";


export default function FrontendLayout({ children }) {
  return (
    <>
      <FrontHeader />

      <main>{children}</main>

      <FrontFooter />
    </>
  );
}
