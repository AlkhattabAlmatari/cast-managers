import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "كاست مانجرز",
  description: "منصة سعودية تربط بين الشركات والمواهب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}