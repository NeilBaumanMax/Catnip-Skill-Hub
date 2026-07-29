import Link from "next/link";
import { SkillArtwork } from "@/app/_components/skill-artwork";
import { RecommendForm } from "./recommend-form";

export default function RecommendPage() {
  return (
    <main className="public-site recommend-shell">
      <header className="detail-header recommend-header">
        <Link className="wordmark" href="/" aria-label="Catnip Skill Hub 首页">
          <span className="brand-placeholder" aria-hidden="true">C</span>
          <span><strong>Catnip</strong><small>薄荷猫</small></span>
        </Link>
        <Link className="back-link" href="/"><span aria-hidden="true">←</span> 返回探索</Link>
      </header>

      <section className="recommend-layout">
        <div className="recommend-intro">
          <p className="section-kicker">推荐 Skill</p>
          <h1>把值得发现的 Skill 告诉我们</h1>
          <p>这里仅收集线索。Neil Bauman 会人工判断和录入，推荐不会自动创建草稿，也不会自动公开。</p>
          <SkillArtwork alt="连接、筛选和整理 Skill 线索的 Catnip 演示插图" theme="map" />
        </div>

        <section className="recommend-card" aria-labelledby="recommend-form-title">
          <div>
            <h2 id="recommend-form-title">提交推荐线索</h2>
            <p>必填项只有链接、发现渠道和推荐理由。</p>
          </div>
          <RecommendForm />
        </section>
      </section>
    </main>
  );
}
