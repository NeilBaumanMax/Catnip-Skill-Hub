import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catnip Skill Hub",
  description: "Catnip 薄荷猫的中文 Agent Skill 独立站。",
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
