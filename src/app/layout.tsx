import type { Metadata } from "next";
import "./globals.css";
import "./ui-fix.css";

export const metadata: Metadata = {
  title: "Catnip Skill Hub",
  description: "Curated Agent Skills for real workflows.",
  icons: {
    icon: [{ url: "/brand/logo.png", type: "image/png" }],
    apple: [{ url: "/brand/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
