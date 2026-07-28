import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catnip Skill Hub | 中文 Agent Skill 独立站",
  description: "发现由 Catnip 薄荷猫筛选、整理和发布的中文 Agent Skill。",
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
