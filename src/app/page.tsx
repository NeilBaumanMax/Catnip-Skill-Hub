import Link from "next/link";

const categories = [
  "VibeCoding 硬件",
  "编程开发",
  "前端设计",
  "产品与项目管理",
  "自动化",
] as const;

const skills = [
  {
    slug: "deeper-reasoning",
    title: "让 Agent 思考得更深",
    description: "通过反思、假设检查和多轮推理，减少过早给出浅层答案。",
    category: "编程开发",
    tag: "推理增强",
    cover: "cover-mind",
    size: "tall",
  },
  {
    slug: "interface-polish",
    title: "把界面细节做到位",
    description: "从层级、间距到交互状态，系统检查并改善前端完成度。",
    category: "前端设计",
    tag: "UI 审查",
    cover: "cover-interface",
    size: "medium",
  },
  {
    slug: "hardware-prototype",
    title: "快速搭出硬件原型",
    description: "梳理器件、接线与固件步骤，让 Agent 陪你推进 IoT 原型。",
    category: "VibeCoding 硬件",
    tag: "ESP32",
    cover: "cover-hardware",
    size: "large",
  },
  {
    slug: "project-brief",
    title: "把模糊想法变成清晰任务",
    description: "从目标、边界到验收标准，生成团队真正能执行的项目简报。",
    category: "产品与项目管理",
    tag: "需求拆解",
    cover: "cover-brief",
    size: "medium",
  },
  {
    slug: "automation-flow",
    title: "让重复工作自己流动",
    description: "识别高频步骤并设计可复用的自动化工作流与失败处理。",
    category: "自动化",
    tag: "工作流",
    cover: "cover-flow",
    size: "tall",
  },
  {
    slug: "codebase-map",
    title: "先看懂代码，再开始修改",
    description: "快速建立代码地图，标记入口、依赖关系与高风险改动区域。",
    category: "编程开发",
    tag: "代码导航",
    cover: "cover-map",
    size: "large",
  },
  {
    slug: "design-system",
    title: "从零散页面提炼设计系统",
    description: "归纳颜色、字体、组件与状态规则，减少界面越做越乱。",
    category: "前端设计",
    tag: "Design System",
    cover: "cover-system",
    size: "tall",
  },
  {
    slug: "sensor-debug",
    title: "定位传感器的隐形故障",
    description: "按电源、通信、采样和环境因素逐层排查硬件异常。",
    category: "VibeCoding 硬件",
    tag: "传感器",
    cover: "cover-sensor",
    size: "medium",
  },
  {
    slug: "release-checklist",
    title: "每次发布都更有把握",
    description: "把质量、安全、回滚与沟通整理成可重复执行的发布清单。",
    category: "产品与项目管理",
    tag: "发布管理",
    cover: "cover-release",
    size: "large",
  },
  {
    slug: "research-digest",
    title: "把资料整理成行动线索",
    description: "从分散来源提取观点、证据和待验证问题，形成清晰摘要。",
    category: "自动化",
    tag: "信息整理",
    cover: "cover-research",
    size: "tall",
  },
] as const;

export default function Home() {
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
            {categories.map((category, index) => (
              <a className={index === 0 ? "active" : ""} href="#skill-grid" key={category}>
                {category}
              </a>
            ))}
          </div>
        </section>

        <section className="skill-section" aria-labelledby="skill-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">编辑推荐池预览</p>
              <h2 id="skill-title">今天想让 Agent 学会什么？</h2>
            </div>
            <p className="section-note">Phase 1 静态展示内容</p>
          </div>

          <div className="skill-grid" id="skill-grid">
            {skills.map((skill, index) => (
              <article className="skill-card" key={skill.slug}>
                <Link href={`/skills/${skill.slug}`} aria-label={`查看 ${skill.title}`}>
                  <div className={`skill-cover ${skill.cover} ${skill.size}`}>
                    <span className="cover-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="cover-kicker">CATNIP SKILL</span>
                    <strong>{skill.title}</strong>
                    <span className="cover-mark" aria-hidden="true" />
                  </div>
                  <div className="skill-copy">
                    <div className="skill-meta">
                      <span>{skill.category}</span>
                      <span>{skill.tag}</span>
                    </div>
                    <h3>{skill.title}</h3>
                    <p>{skill.description}</p>
                    <footer>
                      <span>原作者：待正式数据接入</span>
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
