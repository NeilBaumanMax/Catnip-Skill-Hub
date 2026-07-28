import Link from "next/link";
import { getPublishedSkills, MAIN_CATEGORIES } from "@/lib/domain/skills";

export default function Home() {
  const skills = getPublishedSkills();

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

        <div className="search-preview" role="search" aria-label="Skill 搜索预览">
          <label htmlFor="skill-search">搜索 Skill</label>
          <input
            id="skill-search"
            type="search"
            placeholder="搜索 Skill"
            disabled
            title="搜索功能将在后续阶段接入"
          />
        </div>

        <a className="recommend-link" href="#recommend">
          推荐 Skill
        </a>
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
              <a href="#skill-grid" key={category}>
                {category}
              </a>
            ))}
          </div>
        </section>

        <section className="skill-section" aria-labelledby="skill-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catnip 原创演示目录</p>
              <h2 id="skill-title">今天想让 Agent 学会什么？</h2>
            </div>
            <p className="section-note">{skills.length} 个静态精选资源</p>
          </div>

          <div className="skill-grid" id="skill-grid">
            {skills.map((skill, index) => (
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
                      <span aria-hidden="true">查看 →</span>
                    </footer>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer" id="recommend">
        <div>
          <strong>Catnip 薄荷猫</strong>
          <p>由管理员筛选、整理和发布的中文 Agent Skill 独立站。</p>
        </div>
        <div className="footer-note">
          <span>Logo 与吉祥物将在后续接入</span>
          <span>推荐 Skill 表单将在后续阶段开放</span>
        </div>
      </footer>
    </div>
  );
}
