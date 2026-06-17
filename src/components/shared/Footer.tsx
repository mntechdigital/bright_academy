import Image from "next/image";
import logo from "../../../public/logo.png";

const quickLinks = [
  { label: "হোম", href: "#" },
  { label: "আমাদের সম্পর্কে", href: "#" },
  { label: "কোর্স সমূহ", href: "#" },
  { label: "শিক্ষকমণ্ডলী", href: "#" },
  { label: "সংবাদ", href: "#" },
  { label: "গ্যালারি", href: "#" },
];

const contactInfo = [
  { label: "Phone", value: "০১৭১৬৬১১২০৮" },
  { label: "Phone", value: "০১৭১২৯৬৪০০৮" },
  { label: "Phone", value: "০১৭১৮৪২৮৪৫২" },
  { label: "Email", value: "info@brightacademiccare.com" },
  { label: "Location", value: "বরিশাল, বাংলাদেশ" },
];

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Main Footer */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #fdf6ec 0%, #fef9f3 40%, #fdf0e0 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-6 right-0 w-32 h-32 rounded-full bg-orange-300 opacity-30 translate-x-12" />
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-4 border-orange-200 opacity-40" />
        <div className="absolute bottom-8 left-0 w-24 h-24 rounded-full bg-orange-100 opacity-40 -translate-x-10" />

        {/* Vertical dividers */}
        <div className="absolute top-0 bottom-0 left-1/3 border-l border-gray-200 hidden lg:block" />
        <div className="absolute top-0 bottom-0 left-2/3 border-l border-gray-200 hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-200 shadow-sm">
              <Image
                src={logo}
                alt="Bright Academy Logo"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
              মানসম্মত শিক্ষা ও যত্নশীল পরিচর্যায় আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ গড়ুন। আমরা প্রতিটি শিক্ষার্থীর সফলতার জন্য প্রতিশ্রুতিবদ্ধ।
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-150 w-fit no-underline"
            >
              যোগাযোগ
              <span className="flex items-center justify-center w-5 h-5 bg-white/25 rounded text-xs">↗</span>
            </a>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="flex flex-col gap-4 lg:pl-10">
            <h3 className="text-gray-900 font-bold text-base mb-1">দ্রুত লিংক</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-600 text-sm hover:text-orange-500 transition-colors no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div className="flex flex-col gap-4 lg:pl-10">
            <h3 className="text-gray-900 font-bold text-base mb-1">যোগাযোগ</h3>
            <ul className="flex flex-col gap-3">
              {contactInfo.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  <span className="text-gray-500">: </span>
                  {item.value}
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors no-underline"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors no-underline"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors no-underline"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-gray-900 py-4 px-6">
        <p className="text-center text-gray-400 text-sm">
          © 2025 Bright Academic | All Rights Reserved. Designed and Developed by{" "}
          <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold no-underline transition-colors">
            MNTECH DIGITAL
          </a>
        </p>
      </div>
    </footer>
  );
}