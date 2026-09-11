import type { Metadata } from "next";
import "./globals.css";
import "./neil-theme.css";

export const metadata: Metadata = {
  title: "Neil’s Skill Hub",
  description: "Neil Bauman 精选的 Agent Skills，帮你把灵感带进真实工作流。",
  icons: {
    icon: [{ url: "/brand/neil-rabbit-icon.png", type: "image/png" }],
    apple: [{ url: "/brand/neil-rabbit-icon.png", type: "image/png" }],
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
