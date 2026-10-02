import {
  LuFacebook,
  LuInstagram,
  LuTwitter,
  LuYoutube,
  LuMail,
  LuMapPin,
  LuPhone,
} from "react-icons/lu";

export default function FrontFooter({ settings }) {
  return (
    <footer className="bg-[var(--theme-text)] text-[var(--theme-surface)] mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-sm bg-[var(--theme-accent)] text-[var(--theme-primary-text)] flex items-center justify-center font-serif text-base">
              {settings.storeName.charAt(0)}
            </span>

            <span className="font-serif text-lg text-[#F7F3EC]">
              {settings.storeName}
            </span>
          </div>

          <p className="text-sm text-[#9B9689] mb-4">{settings.tagline}</p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-[#C9A659] transition-colors"
            >
              <LuFacebook size={16} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[#C9A659] transition-colors"
            >
              <LuInstagram size={16} />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-[#C9A659] transition-colors"
            >
              <LuTwitter size={16} />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-[#C9A659] transition-colors"
            >
              <LuYoutube size={16} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-sm text-[#F7F3EC] mb-4">Shop</h4>

          <ul className="space-y-2.5 text-sm text-[#9B9689]">
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                All categories
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                New arrivals
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Best sellers
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Gift cards
              </a>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm text-[#F7F3EC] mb-4">Help</h4>

          <ul className="space-y-2.5 text-sm text-[#9B9689]">
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Shipping & returns
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Track order
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                FAQs
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm text-[#F7F3EC] mb-4">Contact</h4>

          <ul className="space-y-2.5 text-sm text-[#9B9689]">
            <li className="flex items-center gap-2">
              <LuMapPin size={14} />
              Dhaka, Bangladesh
            </li>

            <li className="flex items-center gap-2">
              <LuPhone size={14} />
              +880 1XXX-XXXXXX
            </li>

            <li className="flex items-center gap-2">
              <LuMail size={14} />
              hello@fieldhouse.shop
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9B9689]">
          <p>
            © {new Date().getFullYear()} {settings.storeName}. All rights
            reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="border border-white/15 rounded-sm px-2 py-1">
              VISA
            </span>

            <span className="border border-white/15 rounded-sm px-2 py-1">
              MASTERCARD
            </span>

            <span className="border border-white/15 rounded-sm px-2 py-1">
              bKash
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
