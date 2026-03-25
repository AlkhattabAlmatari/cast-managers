import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "كاست مانجرز | منصة تربط الشركات بالمواهب",
  description:
    "كاست مانجرز منصة سعودية تربط بين الشركات والمواهب بشكل حديث وعملي داخل السوق السعودي.",
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
