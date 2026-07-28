import Link from "next/link";
import { redirect } from "next/navigation";
import { adminSkillService } from "@/lib/admin/skills";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import { AdminDashboard } from "./admin-dashboard";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <Link className="brand-wordmark" href="/">Catnip 薄荷猫</Link>
          <p>管理员：{admin.email}</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/">查看公开网站</Link>
          <LogoutButton />
        </div>
      </header>
      <section className="admin-intro">
        <p className="eyebrow">Admin CMS · Phase 4</p>
        <h1>Skill 草稿与发布管理</h1>
        <p>本阶段使用进程内开发仓储验证管理闭环；服务重启后恢复种子基线，数据库持久化将在后续阶段接入。</p>
      </section>
      <AdminDashboard initialSkills={await adminSkillService.list()} />
    </main>
  );
}
