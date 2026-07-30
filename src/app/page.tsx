import Link from "next/link";
import { PublicHeader, PublicShell } from "@/app/_components/public-shell";
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
    <PublicShell>
      {/*
        THESIS: Skill 封面是首页主体，拒绝大型 Hero 与通用市场卡片墙。
        OWN-WORLD: 蓝调山景环境、深蓝玻璃工具层、Catnip 薄荷焦点与多样内容封面。
        STORY: 用户从搜索和分类进入瀑布流，在卡片上理解用途，再进入详情行动。
        FIRST VIEWPORT: 左侧功能栏，顶部发现控制，紧凑标题，下方立即出现四列 Skill。
        FORM: 内容发现画廊，采用 Neil Bauman 指定的 Unsplash 式框架与 Catnip 产品边界。
      */}
      <span className="navigation-sentinel" id="page-top" aria-hidden="true" />
      <PublicHeader query={discovery.filters.query}>
            <nav className="discovery-categories" aria-label="Skill 主分类">
              <Link
                aria-current={discovery.filters.category ? undefined : "page"}
                className={discovery.filters.category ? "" : "active"}
                href={discoveryHref({ query: discovery.filters.query, tag: discovery.filters.tag })}
              >
                全部
              </Link>
              {MAIN_CATEGORIES.map((category) => (
                <Link
                  aria-current={discovery.filters.category === category ? "page" : undefined}
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
            </nav>

            <nav className="discovery-tags" aria-label="Skill 标签">
              <span>热门标签</span>
              {discovery.availableTags.map((tag) => (
                <Link
                  aria-current={discovery.filters.tag === tag ? "page" : undefined}
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
            </nav>
      </PublicHeader>

        <main className="discovery-content">
          <section className="discovery-intro" aria-labelledby="page-title">
            <div>
              <h1 id="page-title">发现真正值得安装的 Skill</h1>
              <p>由 Catnip 薄荷猫筛选、整理。先看见能力，再决定是否带进工作流。</p>
            </div>
            <div className="discovery-summary" aria-live="polite">
              <strong>{discovery.items.length}</strong>
              <span>{discovery.mode === "recommended" ? "个今日推荐" : "个匹配结果"}</span>
              {discovery.mode === "filtered" ? <Link href="/#skill-grid">清除条件</Link> : null}
            </div>
          </section>

          <section className="waterfall-section" aria-labelledby="skill-grid-title">
            <div className="waterfall-heading">
              <h2 id="skill-grid-title">{discovery.mode === "recommended" ? "继续发现" : "搜索结果"}</h2>
              <p>点击任意封面查看功能、来源、下载与安装说明。</p>
            </div>

            <div className="skill-waterfall" id="skill-grid">
              {discovery.items.map((skill) => (
                <article className="waterfall-card" data-size={skill.coverSize} key={skill.slug}>
                  <Link href={`/skills/${skill.slug}`} aria-label={`查看 ${skill.title}`}>
                    <div
                      className={`waterfall-cover cover-${skill.coverTheme}`}
                      data-photo={skill.coverTheme === "brief" ? "mountain" : undefined}
                      aria-hidden="true"
                    >
                      <span className="cover-original">{skill.originalName}</span>
                      <span className="waterfall-art" />
                    </div>
                    <div className="waterfall-copy">
                      <div className="waterfall-title-row">
                        <h3>{skill.title}</h3>
                        <span>{skill.category}</span>
                      </div>
                      <p>{skill.summary}</p>
                      <footer>
                        <span>{skill.author.name}</span>
                        <span>{skill.tags[0]} / 阅读 {stats[skill.slug]?.views ?? 0}</span>
                      </footer>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {discovery.items.length === 0 ? (
              <div className="discovery-empty">
                <h2>没有找到匹配的 Skill</h2>
                <p>试着缩短关键词，或清除当前分类与标签。</p>
                <Link href="/#skill-grid">查看全部推荐</Link>
              </div>
            ) : null}
          </section>
        </main>

        <footer className="discovery-footer" id="about">
          <div>
            <strong>Catnip Skill Hub</strong>
            <p>由管理员 Neil Bauman 筛选、整理和发布。</p>
          </div>
          <div>
            <span>Catnip 品牌图形已正式接入</span>
            <a
              href="https://unsplash.com/photos/mountain-landscape-with-a-calm-lake-at-dawn-JCqW61z2Sz0"
              target="_blank"
              rel="noreferrer"
            >
              山景摄影：Wolfgang Hasselmann / Unsplash
            </a>
            <Link href="/recommend">推荐一个 Skill</Link>
          </div>
        </footer>
    </PublicShell>
  );
}
