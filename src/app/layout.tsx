import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Tiro_Bangla, Poppins } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import ScrollToTop from "../components/shared/ScrollToTop";
import Provider from "../provider/Provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin", "bengali"],
  variable: "--font-tiro-bangla",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ব্রাইট একাডেমি",
  description:
    "© Bright Academic 2024. All rights reserved. Bright Academic is an educational platform dedicated to providing quality learning resources and support for students and educators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${tiroBangla.variable}
          ${poppins.variable}
          antialiased
        `}
      >
        <ScrollToTop />
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
