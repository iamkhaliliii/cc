import type { Metadata } from "next";
import localFont from "next/font/local";
import { Changa } from "next/font/google";
import "./globals.css";
import "../lib/init-db";

const changa = Changa({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "arabic"],
  variable: "--font-changa",
});

const vazirmatn = localFont({
  src: [
    {
      path: "../../public/fonts/Vazirmatn-FD-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Vazirmatn-FD-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Vazirmatn-FD-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "باشگاه مشتریان",
  description: "سامانه مدیریت باشگاه مشتریان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} ${changa.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
