import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAuthenticatedAdmin()) redirect("/admin");

  return (
    <main className="admin-shell admin-login-shell">
      <Link className="brand-wordmark" href="/">Catnip 薄荷猫</Link>
      <section className="admin-login-card">
        <p className="eyebrow">管理员入口</p>
        <h1>管理 Catnip Skill</h1>
        <p>此入口仅供预创建管理员使用。普通访客浏览和下载无需登录。</p>
        <LoginForm />
      </section>
    </main>
  );
}
