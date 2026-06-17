"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "../../../public/logo.png";
const navLinks = [
  { label: "হোম", href: "/" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "কোর্স সমূহ", href: "/courses" },
  { label: "শিক্ষকমণ্ডলী", href: "/faculty" },
  { label: "মতামত", href: "/review" },
  { label: "সংবাদ", href: "/news" },
  { label: "যোগাযোগ", href: "/communication" },
];

export default function Navbar() {
  const [active, setActive] = useState("হোম");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">

        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 mr-2 no-underline">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-white">
            <Image src={logo} alt="Bright Academy" fill className="object-cover" priority />
          </div>
          <span className="text-[17px] font-semibold text-orange-500 whitespace-nowrap tracking-wide">
            ব্রাইট একাডেমিক
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1">
          {navLinks.map((link, idx) => (
            <div key={link.label} className="flex items-center">
              {/* Divider after first item */}
              {idx === 1 && (
                <div className="w-px h-8 bg-orange-400 opacity-40 mx-1.5" />
              )}
              <a
                href={link.href}
                onClick={() => setActive(link.label)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-150 no-underline
                  ${active === link.label
                    ? "border border-orange-500 text-gray-900 font-semibold bg-transparent"
                    : "text-gray-600 border border-transparent hover:bg-orange-50 hover:text-orange-500"
                  }
                `}
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 lg:hidden" />

        {/* Login Button */}
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 shrink-0 ml-2">
          Login
          <span className="flex items-center justify-center w-5 h-5 bg-white/25 rounded text-xs">
            ↗
          </span>
        </button>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition ml-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => { setActive(link.label); setMenuOpen(false); }}
              className={`
                px-3 py-2 text-sm font-medium rounded-md transition-colors no-underline
                ${active === link.label
                  ? "bg-orange-50 text-orange-500 border border-orange-400"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                }
              `}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}