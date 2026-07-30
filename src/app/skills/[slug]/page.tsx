import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SkillActions } from "@/app/_components/skill-actions";
import { TrackedExternalLink, ViewTracker } from "@/app/_components/analytics-events";
import { analyticsService } from "@/lib/analytics";
import { runtimeSkillRepository } from "@/lib/data/skills";
import { buildInstallCommandMatrix } from "@/lib/install";

interface SkillPageProps {
  params: Promise<{ slug: string }>;
}

const subtypeLabels = {
  single: "单项 Skill",
  native_pack: "原生 Skill 包",
  editorial_pack: "编辑组合包",
} as const;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await runtimeSkillRepository.findBySlug(slug);

  if (!skill || skill.governance.publishStatus !== "published" || skill.governance.hidden) return {};

  return {
    title: `${skill.title} | Catnip Skill Hub`,
    description: skill.summary,
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = await runtimeSkillRepository.findBySlug(slug);

  if (!skill || skill.governance.publishStatus !== "published" || skill.governance.hidden) notFound();

  const resources = await runtimeSkillRepository.list();
  const relatedSkills = skill.relatedSlugs.flatMap((relatedSlug) => {
    const related = resources.find((candidate) => candidate.slug === relatedSlug);
    return related && related.governance.publishStatus === "published" && !related.governance.hidden ? [related] : [];
  });
  const cover = skill.images.find((image) => image.kind === "cover");
  const installCommands = buildInstallCommandMatrix(skill);
  const counts = await analyticsService.get(skill.slug);

  return (
    <div className="site-shell detail-shell">
      <header className="detail-header">
        <Link className="wordmark" href="/" aria-label="返回 Catnip Skill Hub 首页">
          <span className="brand-placeholder" aria-hidden="true">C</span>
          <span>
            <strong>Catnip</strong>
            <small>薄荷猫</small>
          </span>
        </Link>
        <Link className="back-link" href="/">← 返回探索</Link>
      </header>

      <main>
        <section className="detail-intro">
          <div className="detail-title">
            <p className="eyebrow">{subtypeLabels[skill.subtype]}</p>
            <h1>{skill.title}</h1>
            <p className="original-name">{skill.originalName}</p>
            <p className="detail-summary">{skill.summary}</p>
            <div className="detail-meta" aria-label="Skill 基础信息">
              <span>原作者：{skill.author.name}</span>
              <span>{skill.category}</span>
              {skill.tags.map((tag) => <span key={tag}>{tag}</span>)}
              <ViewTracker slug={skill.slug} initialViews={counts.views} />
            </div>
          </div>

          <div className={`detail-cover cover-${skill.coverTheme}`} role="img" aria-label={cover?.alt}>
            <span>CATNIP SKILL / {skill.source.version}</span>
            <strong>{skill.title}</strong>
            <i className="cover-mark" aria-hidden="true" />
          </div>
        </section>

        <section className="detail-gallery" aria-labelledby="gallery-title">
          <div className="detail-section-heading">
            <p className="eyebrow">视觉与效果</p>
            <h2 id="gallery-title">图片集</h2>
          </div>
          <div className="gallery-grid">
            {skill.images.map((image, index) => (
              <figure className={`gallery-visual cover-${image.visualKey}`} key={image.id}>
                <div role="img" aria-label={image.alt}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{index === 0 ? skill.title : "工作流效果示意"}</strong>
                  <i className="cover-mark" aria-hidden="true" />
                </div>
                <figcaption>{image.alt} · 来源：{image.sourceLabel}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <SkillActions
          commands={installCommands}
          downloadEnabled={skill.governance.downloadEnabled}
          downloadUrl={`/api/skills/${skill.slug}/download`}
          skillSlug={skill.slug}
        />

        <div className="detail-columns">
          <div className="detail-main-column">
            <section className="content-section" aria-labelledby="description-title">
              <p className="eyebrow">它能做什么</p>
              <h2 id="description-title">详细功能</h2>
              <p className="section-lead">{skill.description}</p>
              <ul className="feature-list">
                {skill.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </section>

            <section className="content-section" aria-labelledby="use-cases-title">
              <p className="eyebrow">什么时候使用</p>
              <h2 id="use-cases-title">使用场景</h2>
              <div className="case-grid">
                {skill.useCases.map((useCase, index) => (
                  <article key={useCase}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{useCase}</h3>
                  </article>
                ))}
              </div>
            </section>

            {skill.childSkills.length > 0 && (
              <section className="content-section" aria-labelledby="children-title">
                <p className="eyebrow">Pack 结构</p>
                <h2 id="children-title">包含的子 Skills</h2>
                <div className="child-list">
                  {skill.childSkills.map((child) => (
                    <article key={child.id}>
                      <div>
                        <span>{child.originalName}</span>
                        <h3>{child.title}</h3>
                        <p>{child.summary}</p>
                      </div>
                      {child.hasStandalonePage && child.standaloneSlug ? (
                        <Link href={`/skills/${child.standaloneSlug}`}>独立页面 →</Link>
                      ) : (
                        <span>随 Pack 提供</span>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="content-section" aria-labelledby="usage-title">
              <p className="eyebrow">开始使用</p>
              <h2 id="usage-title">使用方法与 Prompt 示例</h2>
              <ol className="usage-list">
                {skill.usageSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              {skill.promptExamples.map((prompt) => <pre className="prompt-box" key={prompt}><code>{prompt}</code></pre>)}
            </section>

            <section className="content-section" aria-labelledby="results-title">
              <p className="eyebrow">辅助展示</p>
              <h2 id="results-title">使用效果</h2>
              <div className="result-list">
                {skill.results.map((result) => (
                  <article key={result.title}>
                    <h3>{result.title}</h3>
                    <p>{result.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="content-section risk-section" aria-labelledby="risks-title">
              <p className="eyebrow">使用前阅读</p>
              <h2 id="risks-title">风险和注意事项</h2>
              <ul>
                {skill.risks.map((risk) => <li key={risk}>{risk}</li>)}
              </ul>
            </section>
          </div>

          <aside className="source-card" aria-labelledby="source-title">
            <p className="eyebrow">可追溯信息</p>
            <h2 id="source-title">版本与来源</h2>
            <dl>
              <div><dt>资源类型</dt><dd>{subtypeLabels[skill.subtype]}</dd></div>
              <div><dt>原始名称</dt><dd>{skill.originalName}</dd></div>
              <div><dt>版本</dt><dd>{skill.source.version}</dd></div>
              <div><dt>Commit</dt><dd>{skill.source.sourceCommit ?? "演示阶段未绑定"}</dd></div>
              <div><dt>License</dt><dd>{skill.source.license}</dd></div>
              <div><dt>下载状态</dt><dd>{skill.governance.downloadEnabled ? "管理员已开放" : "尚未开放"}</dd></div>
            </dl>
            <TrackedExternalLink href={skill.source.sourceUrl} slug={skill.slug}>查看来源仓库 ↗</TrackedExternalLink>
          </aside>
        </div>

        <section className="related-section" aria-labelledby="related-title">
          <div className="detail-section-heading">
            <p className="eyebrow">继续探索</p>
            <h2 id="related-title">相关 Skill</h2>
          </div>
          <div className="related-grid">
            {relatedSkills.map((related) => (
              <Link href={`/skills/${related.slug}`} key={related.slug}>
                <span>{related.category}</span>
                <h3>{related.title}</h3>
                <p>{related.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>Catnip 薄荷猫</strong>
          <p>由管理员筛选、整理和发布的中文 Agent Skill 独立站。</p>
        </div>
        <div className="footer-note">
          <span>当前目录含一个可下载 Catnip 原创 Skill</span>
          <span>其他演示种子继续保持下载关闭</span>
        </div>
      </footer>
    </div>
  );
}
