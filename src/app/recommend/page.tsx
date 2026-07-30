import Link from "next/link";
import { BrandLogo } from "@/app/_components/brand-logo";
import { RecommendForm } from "./recommend-form";

export default function RecommendPage() {
  return (
    <main className="recommend-shell">
      <header className="detail-nav">
        <Link className="wordmark" href="/">
          <BrandLogo className="brand-logo" priority />
          <span><strong>Catnip Skill Hub</strong><small>CURATED AGENT SKILLS</small></span>
        </Link>
        <Link className="back-link" href="/">← 返回探索</Link>
      </header>
      <section className="recommend-card">
        <p className="eyebrow">推荐 Skill</p>
        <h1>把值得发现的 Skill 告诉我们</h1>
        <p>这里只收集线索。管理员 Neil Bauman 会人工审核和录入；推荐不会自动生成草稿，也不会自动公开。</p>
        <RecommendForm />
      </section>
    </main>
  );
}
