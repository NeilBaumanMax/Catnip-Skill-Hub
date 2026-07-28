import Link from "next/link";
import { redirect } from "next/navigation";
import { adminSkillService } from "@/lib/admin/skills";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import { AdminDashboard } from "./admin-dashboard";
import { LogoutButton } from "./logout-button";
import { ImportStoragePanel } from "./import-storage-panel";
import { assetService } from "@/lib/storage";
import { recommendationService } from "@/lib/recommendations";

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
        <p className="eyebrow">Admin CMS · Phase 5</p>
        <h1>Skill、来源与文件管理</h1>
        <p>管理数据和文件仍使用进程内开发适配器；服务重启后恢复基线，数据库与对象存储将在部署阶段接入。</p>
      </section>
      <AdminDashboard initialSkills={await adminSkillService.list()} />
      <ImportStoragePanel
        initialAssets={await assetService.list()}
        initialRecommendations={await recommendationService.list()}
      />
    </main>
  );
}
