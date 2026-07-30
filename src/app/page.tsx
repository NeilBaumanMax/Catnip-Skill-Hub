import Link from "next/link";
import { analyticsService } from "@/lib/analytics";
import { discoverSkills } from "@/lib/discovery";
import { runtimeSkillRepository } from "@/lib/data/skills";
import { MAIN_CATEGORIES } from "@/lib/domain/skills";

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function discoveryHref(filters: { query?: string; category?: string; tag?: string }): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  const query = params.toString();
  return query ? `/?${query}#skill-grid` : "/#skill-grid";
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const resources = await runtimeSkillRepository.list();
  const discovery = discoverSkills({
    query: first(params.q),
    category: first(params.category),
    tag: first(params.tag),
  }, Math.random, resources);
  const stats = await analyticsService.getMany(discovery.items.map((skill) => skill.slug));

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Catnip Skill Hub 首页">
          <span className="brand-placeholder" aria-hidden="true">
            C
          </span>
          <span>
            <strong>Catnip</strong>
            <small>薄荷猫</small>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="主要导航">
          <a href="#explore">探索</a>
          <a href="#categories">分类</a>
        </nav>

        <form className="search-preview" role="search" aria-label="Skill 搜索" action="/" method="get">
          <label htmlFor="skill-search">搜索 Skill</label>
          <input
            id="skill-search"
            name="q"
            type="search"
            placeholder="搜索标题、用途或标签"
            defaultValue={discovery.filters.query}
            maxLength={100}
          />
          <button type="submit">搜索</button>
        </form>

        <Link className="recommend-link" href="/recommend">
          推荐 Skill
        </Link>
      </header>

      <main>
        <section className="intro" id="explore" aria-labelledby="page-title">
          <p className="eyebrow">中文 Agent Skill 精选</p>
          <h1 id="page-title">发现值得带进工作流的好 Skill</h1>
          <p>
            从创意编码到硬件原型，浏览由 Catnip 薄荷猫筛选、整理的实用能力。
          </p>
        </section>

        <section className="category-section" id="categories" aria-labelledby="category-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">按兴趣开始</p>
              <h2 id="category-title">探索分类</h2>
            </div>
            <span>5 个主分类</span>
          </div>
          <div className="category-list" aria-label="Skill 主分类">
            {MAIN_CATEGORIES.map((category) => (
              <Link
                className={discovery.filters.category === category ? "active" : ""}
                href={discoveryHref({
                  query: discovery.filters.query,
                  category: discovery.filters.category === category ? undefined : category,
                  tag: discovery.filters.tag,
                })}
                key={category}
              >
                {category}
              </Link>
            ))}
          </div>
          <div className="tag-filter" aria-label="Skill 标签筛选">
            {discovery.availableTags.map((tag) => (
              <Link
                className={discovery.filters.tag === tag ? "active" : ""}
                href={discoveryHref({
                  query: discovery.filters.query,
                  category: discovery.filters.category,
                  tag: discovery.filters.tag === tag ? undefined : tag,
                })}
                key={tag}
              >{tag}</Link>
            ))}
          </div>
        </section>

        <section className="skill-section" aria-labelledby="skill-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{discovery.mode === "recommended" ? "随机推荐" : "搜索结果"}</p>
              <h2 id="skill-title">{discovery.mode === "recommended" ? "今天想让 Agent 学会什么？" : "找到这些 Skill"}</h2>
            </div>
            <div className="result-summary">
              <p className="section-note">{discovery.items.length} 个公开资源</p>
              {discovery.mode === "filtered" ? <Link href="/#skill-grid">清除条件</Link> : null}
            </div>
          </div>

          <div className="skill-grid" id="skill-grid">
            {discovery.items.map((skill, index) => (
              <article className="skill-card" key={skill.slug}>
                <Link href={`/skills/${skill.slug}`} aria-label={`查看 ${skill.title}`}>
                  <div className={`skill-cover cover-${skill.coverTheme} ${skill.coverSize}`}>
                    <span className="cover-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="cover-kicker">CATNIP SKILL</span>
                    <strong>{skill.title}</strong>
                    <span className="cover-mark" aria-hidden="true" />
                  </div>
                  <div className="skill-copy">
                    <div className="skill-meta">
                      <span>{skill.category}</span>
                      <span>{skill.tags[0]}</span>
                    </div>
                    <h3>{skill.title}</h3>
                    <p>{skill.summary}</p>
                    <footer>
                      <span>原作者：{skill.author.name}</span>
                      <span>阅读 {stats[skill.slug]?.views ?? 0} · 查看 →</span>
                    </footer>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          {discovery.items.length === 0 ? (
            <div className="empty-results">
              <h3>暂时没有匹配的 Skill</h3>
              <p>可以缩短关键词、切换分类或清除筛选条件。</p>
              <Link href="/#skill-grid">查看全部推荐</Link>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="site-footer" id="recommend">
        <div>
          <strong>Catnip 薄荷猫</strong>
          <p>由管理员筛选、整理和发布的中文 Agent Skill 独立站。</p>
        </div>
        <div className="footer-note">
          <span>Logo 与吉祥物将在后续接入</span>
          <Link href="/recommend">推荐一个 Skill</Link>
        </div>
      </footer>
    </div>
  );
}
