import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../lib/init-db";

const vazirmatn = localFont({
  src: [
    {
      path: "../../node_modules/vazirmatn/misc/Farsi-Digits/fonts/webfonts/Vazirmatn-FD-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/vazirmatn/misc/Farsi-Digits/fonts/webfonts/Vazirmatn-FD-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/vazirmatn/misc/Farsi-Digits/fonts/webfonts/Vazirmatn-FD-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
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
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
