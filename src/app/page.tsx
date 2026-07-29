/*
THESIS: A Skill gallery that proves usefulness through authored covers and clear source-aware copy, refusing the generic search-first marketplace shell.
OWN-WORLD: Porcelain and graphite surfaces, Catnip mint controls, soft 16px content corners, functional pills, system Chinese type, and restrained translucent navigation.
STORY: Visitors recognize a useful Skill, understand its purpose and origin, then open the detail page to download or install it.
FIRST VIEWPORT: Compact floating navigation above a left editorial statement and one large featured Skill artwork, with categories and the catalog already visible below.
FORM: User-pinned Spatial Skill Gallery replacement direction. No concept seed was used because the latest brief explicitly fixed the world.
*/
import Link from "next/link";
import { SkillArtwork } from "@/app/_components/skill-artwork";
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
  const featured = discovery.mode === "recommended" ? discovery.items[0] : undefined;
  const catalogItems = featured ? discovery.items.slice(1) : discovery.items;

  return (
    <div className="public-site site-shell">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Catnip Skill Hub 首页">
          <span className="brand-placeholder" aria-hidden="true">C</span>
          <span>
            <strong>Catnip</strong>
            <small>薄荷猫</small>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="主要导航">
          <a href="#explore">探索</a>
          <a href="#categories">分类</a>
          <Link href="/recommend">推荐</Link>
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
      </header>

      <main>
        <section className="home-lead" id="explore" aria-labelledby="page-title">
          <div className="home-lead-copy">
            <p className="section-kicker">中文 Agent Skill 精选</p>
            <h1 id="page-title">发现值得带进工作流的 Skill</h1>
            <p>由 Catnip 薄荷猫筛选、解释和整理，让能力先被看见，再被信任。</p>
            <a className="primary-action" href="#skill-grid">开始探索</a>
          </div>

          {featured ? (
            <article className="featured-skill">
              <Link href={`/skills/${featured.slug}`} aria-label={`查看 ${featured.title}`}>
                <SkillArtwork
                  alt={`${featured.title} 的 Catnip 演示封面`}
                  className="featured-artwork"
                  priority
                  theme={featured.coverTheme}
                />
                <div className="featured-copy">
                  <div>
                    <span>{featured.category}</span>
                    <span>{featured.author.name}</span>
                  </div>
                  <h2>{featured.title}</h2>
                  <p>{featured.summary}</p>
                  <span className="text-link">查看 Skill <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            </article>
          ) : null}
        </section>

        <section className="category-section" id="categories" aria-labelledby="category-title">
          <div className="section-heading">
            <div>
              <h2 id="category-title">按兴趣浏览</h2>
              <p>五个主分类，一次只保留最有用的筛选。</p>
            </div>
            <span>{discovery.items.length} 个公开资源</span>
          </div>
          <div className="category-list" aria-label="Skill 主分类">
            {MAIN_CATEGORIES.map((category) => (
              <Link
                aria-current={discovery.filters.category === category ? "true" : undefined}
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
                aria-current={discovery.filters.tag === tag ? "true" : undefined}
                className={discovery.filters.tag === tag ? "active" : ""}
                href={discoveryHref({
                  query: discovery.filters.query,
                  category: discovery.filters.category,
                  tag: discovery.filters.tag === tag ? undefined : tag,
                })}
                key={tag}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        <section className="skill-section" aria-labelledby="skill-title">
          <div className="section-heading">
            <div>
              <h2 id="skill-title">{discovery.mode === "recommended" ? "继续发现" : "搜索结果"}</h2>
              <p>{discovery.mode === "recommended" ? "每次访问都会从推荐池重新组织顺序。" : "以下资源符合当前搜索和筛选条件。"}</p>
            </div>
            {discovery.mode === "filtered" ? <Link className="quiet-link" href="/#skill-grid">清除条件</Link> : null}
          </div>

          <div className="skill-grid" id="skill-grid">
            {catalogItems.map((skill) => (
              <article className={`skill-card card-${skill.coverSize}`} key={skill.slug}>
                <Link href={`/skills/${skill.slug}`} aria-label={`查看 ${skill.title}`}>
                  <SkillArtwork alt={`${skill.title} 的 Catnip 演示封面`} theme={skill.coverTheme} />
                  <div className="skill-copy">
                    <div className="skill-meta">
                      <span>{skill.category}</span>
                      <span>{skill.tags[0]}</span>
                    </div>
                    <h3>{skill.title}</h3>
                    <p>{skill.summary}</p>
                    <footer>
                      <span>原作者：{skill.author.name}</span>
                      <span>阅读 {stats[skill.slug]?.views ?? 0}</span>
                    </footer>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          {discovery.items.length === 0 ? (
            <div className="empty-results">
              <h3>暂时没有匹配的 Skill</h3>
              <p>缩短关键词、切换分类，或回到完整推荐目录。</p>
              <Link href="/#skill-grid">查看全部推荐</Link>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>Catnip 薄荷猫</strong>
          <p>由管理员筛选、整理和发布的中文 Agent Skill 独立站。</p>
        </div>
        <div className="footer-note">
          <span>正式 Logo 与吉祥物将在后续接入</span>
          <Link href="/recommend">推荐一个 Skill</Link>
        </div>
      </footer>
    </div>
  );
}
