import type { CoverSize, CoverTheme, MainCategory, SkillResource, SkillSubtype } from "./types";

const websiteRepositoryUrl = "https://github.com/NeilBaumanMax/Catnip-Skill-Hub";

interface SeedInput {
  slug: string;
  title: string;
  originalName: string;
  summary: string;
  description: string;
  category: MainCategory;
  tags: readonly string[];
  theme: CoverTheme;
  size: CoverSize;
  subtype?: SkillSubtype;
  features: readonly string[];
  useCases: readonly string[];
  usageSteps: readonly string[];
  promptExamples: readonly string[];
  results: readonly { title: string; description: string }[];
  risks: readonly string[];
  relatedSlugs: readonly string[];
  childSkills?: SkillResource["childSkills"];
  images?: SkillResource["images"];
  galleryTheme?: CoverTheme;
  authorName?: string;
  authorUrl?: string;
  sourceKind?: SkillResource["source"]["kind"];
  repositoryPath?: string;
  repositoryUrl?: string;
  sourceUrl?: string;
  releaseAssetUrl?: string;
  sourceCommit?: string;
  sourceSha256?: string;
  license?: string;
  version?: string;
  downloadEnabled?: boolean;
  sourceLabel?: string;
  adminNotes?: string;
  recommendationWeight?: number;
  pinned?: boolean;
  reviewState?: SkillResource["governance"]["reviewState"];
}

function createSeed(input: SeedInput): SkillResource {
  const subtype = input.subtype ?? "single";
  const repositoryUrl = input.repositoryUrl ?? websiteRepositoryUrl;

  return {
    id: `catnip-${input.slug}`,
    slug: input.slug,
    resourceType: subtype === "single" ? "skill" : "skill_pack",
    subtype,
    title: input.title,
    originalName: input.originalName,
    summary: input.summary,
    description: input.description,
    author: {
      name: input.authorName ?? "Catnip 薄荷猫",
      url: input.authorUrl ?? repositoryUrl,
    },
    source: {
      kind: input.sourceKind ?? (subtype === "editorial_pack" ? "editorial_collection" : "catnip_original"),
      label: input.sourceLabel ?? "Catnip Skill 目录",
      sourceUrl: input.sourceUrl ?? repositoryUrl,
      repositoryUrl,
      repositoryPath: input.repositoryPath,
      releaseAssetUrl: input.releaseAssetUrl,
      license: input.license ?? "待管理员在正式发布前确认",
      version: input.version ?? "0.1.0",
      sourceCommit: input.sourceCommit,
      sourceSha256: input.sourceSha256,
    },
    category: input.category,
    tags: input.tags,
    compatibility: ["Claude Code CLI", "Codex CLI"],
    images: input.images ?? [
      {
        id: `${input.slug}-cover`,
        kind: "cover",
        alt: `${input.title}概念封面`,
        visualKey: input.theme,
        sourceType: "catnip_css",
        sourceLabel: "Catnip 目录视觉",
      },
      ...(input.galleryTheme
        ? [
            {
              id: `${input.slug}-gallery-1`,
              kind: "gallery" as const,
              alt: `${input.title}流程效果示意`,
              visualKey: input.galleryTheme,
              sourceType: "catnip_css" as const,
              sourceLabel: "Catnip 目录视觉",
            },
          ]
        : []),
    ],
    coverTheme: input.theme,
    coverSize: input.size,
    features: input.features,
    useCases: input.useCases,
    childSkills: input.childSkills ?? [],
    usageSteps: input.usageSteps,
    promptExamples: input.promptExamples,
    results: input.results,
    risks: input.risks,
    relatedSlugs: input.relatedSlugs,
    governance: {
      publishStatus: "published",
      inRecommendationPool: true,
      recommendationWeight: input.recommendationWeight ?? 50,
      pinned: input.pinned ?? false,
      hidden: false,
      downloadEnabled: input.downloadEnabled ?? false,
      adminNotes: input.adminNotes ?? "管理员目录记录。",
      reviewState: input.reviewState ?? "unreviewed",
    },
    stats: {
      views: 0,
      downloadClicks: 0,
      installCopies: 0,
      sourceVisits: 0,
    },
  };
}

export const SKILL_SEEDS: readonly SkillResource[] = [
  createSeed({
    slug: "idea-to-production-vibecoding",
    title: "把产品想法安全推进到生产",
    originalName: "idea-to-production-vibecoding",
    summary: "把模糊想法转成产品真相、架构、施工文档、阶段实现与可回滚发布。",
    description: "这是一套面向长周期 VibeCoding 的完整工程治理工作流。它要求 Agent 先发现真实需求并固定产品边界，再建立架构和施工文档，检查 Git 与用户改动，按 Phase 实现、测试、截图验收和记录失败，最后留下下一位 Agent 可以无聊天记录接力的交接材料。",
    category: "产品与项目管理",
    tags: ["VibeCoding", "产品规划", "工程治理", "Codex CLI"],
    theme: "flow",
    size: "large",
    authorName: "Neil Bauman / Catnip 薄荷猫",
    authorUrl: "https://github.com/NeilBaumanMax/idea-to-production-vibecoding",
    sourceKind: "catnip_original",
    sourceLabel: "Neil Bauman / Catnip 原创 Skill",
    sourceUrl: "https://github.com/NeilBaumanMax/idea-to-production-vibecoding/tree/1ed2eb67325716f65deaee3bf7fcc8b7d998c282",
    repositoryUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main",
    repositoryPath: "content/skills/idea-to-production-vibecoding",
    releaseAssetUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.4.0/idea-to-production-vibecoding-1.0.0.zip",
    sourceCommit: "1ed2eb67325716f65deaee3bf7fcc8b7d998c282",
    license: "MIT",
    version: "1.0.0",
    downloadEnabled: true,
    recommendationWeight: 92,
    pinned: true,
    reviewState: "reviewed",
    adminNotes: "Catnip 内容主库 v0.3.0；Release workflow、SHA-256 与 ZIP 完整性已验证。",
    images: [
      {
        id: "idea-to-production-vibecoding-cover",
        kind: "cover",
        alt: "从想法、架构、代码与测试门禁通向生产发布的三维流程封面",
        url: "/skills/idea-to-production-vibecoding/cover.jpg",
        visualKey: "flow",
        sourceType: "ai_generated",
        sourceLabel: "Catnip AI 生成视觉",
      },
      {
        id: "idea-to-production-vibecoding-gallery-1",
        kind: "gallery",
        alt: "从需求发现到生产交付的六阶段工程流程示意",
        url: "/skills/idea-to-production-vibecoding/effect.png",
        visualKey: "map",
        sourceType: "ai_generated",
        sourceLabel: "Catnip AI 生成视觉",
      },
    ],
    features: [
      "通过访谈式澄清区分产品事实、假设、未知项与非目标",
      "建立架构、产品要求、施工计划、测试指标和回滚手册",
      "开工前识别用户改动并创建可验证的远端备份",
      "按 Phase 施工，记录失败测试、修复、复测和文档漂移",
      "为下一位 Agent 输出无需聊天记录即可接力的交接材料",
    ],
    useCases: ["从零启动一个 Agent 驱动产品", "接管已经混乱的 VibeCoding 仓库", "长周期、多轮 Codex CLI 开发", "需要审计、回滚和持续交接的生产项目"],
    usageSteps: [
      "把产品想法、目标用户和当前仓库状态交给 Agent。",
      "完成需求发现，确认目标、非目标、风险和验收定义。",
      "让 Agent 建立施工文档、Git 基线与开发前远端备份。",
      "按 Phase 实现，每轮执行测试、截图或运行验证并记录失败。",
      "审核交接与回滚信息，确认门禁通过后再发布。",
    ],
    promptExamples: [
      "使用 idea-to-production-vibecoding，把这个产品想法从需求发现推进到可施工计划。先不要写代码，先固定产品真相、非目标和验收标准。",
      "接管这个仓库。保护用户改动，建立开发前备份，然后按现有 Phase 文档继续施工、测试和交接。",
    ],
    results: [
      { title: "范围更稳定", description: "把聊天里的模糊愿望压缩为可追踪的产品边界与完成定义。" },
      { title: "施工可审计", description: "提交、测试、失败、备份和回滚目标形成连续证据链。" },
      { title: "跨会话可接力", description: "后续 Agent 不依赖旧聊天也能恢复上下文并继续工作。" },
    ],
    risks: ["完整治理会增加前期整理与验证时间，不适合一次性小脚本", "文档与检查清单不能替代真实运行测试、专业安全审核或用户验收"],
    relatedSlugs: ["apple-design", "dashi-ppt"],
  }),
  createSeed({
    slug: "apple-design",
    title: "让界面拥有流体般的自然反馈",
    originalName: "apple-design",
    summary: "把空间连续性、弹簧、手势、动量与可中断动画转译为可落地的 Web 交互。",
    description: "这套 Skill 总结了 Emil Kowalski 对 Apple 式界面物理感的工程化理解：界面元素从哪里来、如何响应按压与拖拽、松手后怎样保留速度、动画被打断时如何继续，以及何时应为减少动态效果的用户降级。它提供的是设计原则与 Web 实现方法，不复制任何 Apple 产品或商标。",
    category: "前端设计",
    tags: ["动效设计", "手势交互", "Spring", "Web UI"],
    theme: "interface",
    size: "large",
    authorName: "Emil Kowalski",
    authorUrl: "https://github.com/NeilBaumanMax/Apple_Design_SKILL",
    sourceKind: "third_party",
    sourceLabel: "Emil Kowalski 原作，经 Catnip 整理发布",
    sourceUrl: "https://github.com/NeilBaumanMax/Apple_Design_SKILL/tree/6bf24434f7730ad169077756cf9c7cd7bd675fc6/skills/apple-design",
    repositoryUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main",
    repositoryPath: "content/skills/apple-design",
    releaseAssetUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.4.0/apple-design-1.0.0.zip",
    sourceCommit: "6bf24434f7730ad169077756cf9c7cd7bd675fc6",
    license: "MIT",
    version: "1.0.0",
    downloadEnabled: true,
    recommendationWeight: 88,
    pinned: true,
    reviewState: "reviewed",
    adminNotes: "Catnip 内容主库 v0.3.0；保留原作者与 MIT License，视觉未使用 Apple 标志。",
    images: [
      {
        id: "apple-design-cover",
        kind: "cover",
        alt: "半透明界面层与弹簧运动轨迹组成的流体交互封面",
        url: "/skills/apple-design/cover.jpg",
        visualKey: "interface",
        sourceType: "ai_generated",
        sourceLabel: "Catnip AI 生成视觉（无 Apple 标志）",
      },
      {
        id: "apple-design-gallery-1",
        kind: "gallery",
        alt: "按压、拖拽、动量与可中断弹簧四种交互状态示意",
        url: "/skills/apple-design/effect.png",
        visualKey: "interface",
        sourceType: "ai_generated",
        sourceLabel: "Catnip AI 生成视觉（无 Apple 标志）",
      },
    ],
    features: [
      "用空间连续性解释弹层、卡片和导航元素的来源与去向",
      "为 press、drag、release 和 momentum 选择合适的反馈模型",
      "设计带初速度、可中断且不会跳变的弹簧动画",
      "控制模糊、缩放、透明度和阴影，避免过度装饰",
      "同时考虑 reduced motion、触控与键盘用户",
    ],
    useCases: ["手势驱动的卡片与面板", "移动端风格的 Web 导航", "高完成度弹窗和浮层", "审查已有动画是否自然且可访问"],
    usageSteps: [
      "描述用户动作、界面元素的空间关系和现有技术栈。",
      "判断反馈应使用即时状态、补间动画还是物理弹簧。",
      "明确持续时间、阻尼、初速度、中断行为和降级策略。",
      "在鼠标、触控、键盘及 reduced motion 下分别验证。",
    ],
    promptExamples: [
      "使用 apple-design 审查这个抽屉交互：它应从触发按钮所在空间自然展开，拖拽松手后保留速度，并能在反向操作时立即中断。",
      "把这个生硬的弹窗改成克制的物理反馈，同时给出 prefers-reduced-motion 的降级方案。",
    ],
    results: [
      { title: "动作有因果", description: "用户能从运动方向和连续性理解界面发生了什么。" },
      { title: "交互可打断", description: "快速连续操作不会等待旧动画结束，也不会出现跳帧。" },
      { title: "精致但克制", description: "动效服务于反馈和空间理解，而不是单纯展示技巧。" },
    ],
    risks: ["该 Skill 是面向 Web 的设计方法总结，不代表 Apple 官方规范或授权", "必须测试 prefers-reduced-motion；高频模糊和大面积动画可能影响性能与可访问性"],
    relatedSlugs: ["idea-to-production-vibecoding", "dashi-ppt"],
  }),
  createSeed({
    slug: "dashi-ppt",
    title: "生成可编辑、可导出的专业演示",
    originalName: "dashi-ppt",
    summary: "从内容结构到 HTML 预览、PDF 与 PPTX 导出，完成可继续编辑的专业演示文稿。",
    description: "Dashi PPT Skill 提供一套完整的演示文稿生产系统：先组织故事与页面角色，再从 12 套主题和约 1020 种布局中选择结构，生成可编辑的 HTML 演示，执行视觉预览与质量检查，并按需要导出 PDF 或 PPTX。内容包保留原项目和导出组件的许可证边界，适合真正需要交付文件的 Agent 工作流。",
    category: "自动化",
    tags: ["PPT", "演示文稿", "PPTX", "PDF"],
    theme: "release",
    size: "large",
    authorName: "chuspeeism",
    authorUrl: "https://github.com/NeilBaumanMax/dashi-ppt-skill-ZYY--Neil",
    sourceKind: "third_party",
    sourceLabel: "chuspeeism 原作，经 Catnip 完整镜像发布",
    sourceUrl: "https://github.com/NeilBaumanMax/dashi-ppt-skill-ZYY--Neil/tree/fdbb145517ea0e289000aef9b7906bcb3e0cd19a/skills/dashi-ppt",
    repositoryUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main",
    repositoryPath: "content/skills/dashi-ppt",
    releaseAssetUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.4.0/dashi-ppt-0.4.4.zip",
    sourceCommit: "fdbb145517ea0e289000aef9b7906bcb3e0cd19a",
    license: "AGPL-3.0（内含仅限随完整 Skill 使用和分发的专有导出组件）",
    version: "0.4.4",
    downloadEnabled: true,
    recommendationWeight: 94,
    pinned: true,
    reviewState: "reviewed",
    adminNotes: "Catnip 内容主库 v0.3.0 完整分发；不得单独提取 html-deck-to-pptx 专有组件。",
    images: [
      {
        id: "dashi-ppt-cover",
        kind: "cover",
        alt: "浮动演示页面、编辑画布、图表和导出控件组成的专业演示封面",
        url: "/skills/dashi-ppt/cover.jpg",
        visualKey: "release",
        sourceType: "ai_generated",
        sourceLabel: "Catnip AI 生成视觉",
      },
      {
        id: "dashi-ppt-gallery-1",
        kind: "gallery",
        alt: "Dashi PPT 原项目主题与版式效果网格",
        url: "/skills/dashi-ppt/effect.png",
        visualKey: "system",
        sourceType: "original_author",
        sourceLabel: "Dashi PPT 原项目效果图",
      },
    ],
    features: [
      "按受众、目的和叙事节奏规划整套演示结构",
      "提供 12 套主题与约 1020 种版式组合",
      "生成可在浏览器继续编辑和预览的 HTML 演示",
      "执行页面渲染、拼图预览、溢出和视觉质量检查",
      "导出 PDF 与可继续编辑的 PPTX 文件",
    ],
    useCases: ["商业方案与路演 Deck", "课程、培训和知识分享", "研究报告与项目汇报", "需要 PDF/PPTX 成品的 Agent 自动化"],
    usageSteps: [
      "确认本机具备 Node.js 20+；首次安装依赖和浏览器组件可能需要联网。",
      "描述受众、演示目标、页数、语言、资料与品牌约束。",
      "让 Skill 规划页面角色并选择主题与版式。",
      "生成 HTML 后运行预览与质量检查，修正文字溢出和视觉问题。",
      "确认效果后导出 PDF 或 PPTX，并在目标软件中复核可编辑性。",
    ],
    promptExamples: [
      "使用 dashi-ppt，把这些产品资料做成 12 页中文融资路演。先给出故事线和页面角色，再生成可编辑 HTML，截图检查后导出 PPTX。",
      "把这份研究报告压缩为 8 页高管汇报，使用克制的数据叙事，避免每页重复同一种版式，最终同时输出 PDF 和 PPTX。",
    ],
    results: [
      { title: "从内容到成品", description: "不止提供提纲，还覆盖排版、预览、检查与文件导出。" },
      { title: "版式更丰富", description: "主题和布局系统减少模板化、重复化的页面观感。" },
      { title: "文件可继续编辑", description: "HTML 与 PPTX 交付后仍可由团队进行二次修改。" },
    ],
    risks: ["完整 Skill 体积约 25.6 MB，安装依赖和浏览器组件需要额外磁盘、时间与可能的网络访问", "主项目采用 AGPL-3.0；html-deck-to-pptx 专有组件只能随完整 Dashi Skill 使用和分发，不得单独提取或再分发"],
    relatedSlugs: ["idea-to-production-vibecoding", "apple-design"],
  }),
  createSeed({
    slug: "zhihu",
    title: "把知乎知识接入 Agent 工作流",
    originalName: "zhihu",
    summary: "通过知乎官方 CLI 搜索社区与全网内容、查看热榜、调用直答，并按授权使用个人内容和知识库。",
    description: "知乎开放平台 Skill 把社区搜索、全网检索、热榜、知乎直答、个人创作与收藏、知识库和 API 额度查询组织成一套 Agent 可调用的 CLI 工作流。日常任务优先使用受控脚本定位官方 CLI；涉及个人数据、知识库上传或认证时，只在用户明确授权后读取最小范围，并避免在对话、日志或项目文件中暴露 Access Secret。这个页面镜像 Neil 指定的 0.5.3 beta 官方归档快照。",
    category: "编程开发",
    tags: ["知乎", "CLI", "内容搜索", "知识库", "RAG", "Codex CLI"],
    theme: "research",
    size: "tall",
    authorName: "知乎开放平台",
    authorUrl: "https://developer.zhihu.com/",
    sourceKind: "third_party",
    sourceLabel: "知乎开放平台官方 CDN 发布包，经 Neil’s Skill Hub 镜像",
    sourceUrl: "https://developer-cdn.zhihu.com/zhihu-cli/releases/beta/skill/0.5.3-beta.20260904115023/zhihu-cli-skill-0.5.3-beta.20260904115023.zip",
    repositoryUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main",
    repositoryPath: "content/skills/zhihu",
    releaseAssetUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.4.0/zhihu-0.5.3-beta.20260904115023.zip",
    sourceSha256: "f7b1de244c875749feec7fae5b134e2de5f26332198e6c73861140b2d72c4dd7",
    license: "知乎官方发布包（未声明独立开源许可证）",
    version: "0.5.3-beta.20260904115023",
    downloadEnabled: true,
    recommendationWeight: 90,
    pinned: true,
    reviewState: "reviewed",
    adminNotes: "Catnip 内容主库 v0.4.0；用户提供 ZIP 与知乎官方 CDN 同版本归档逐字节一致，使用 SHA-256 固定来源；官方未声明独立开源许可证。",
    images: [
      {
        id: "zhihu-cover",
        kind: "cover",
        alt: "终端连接问题卡片、知识节点和灵感灯泡的知乎开放平台 Skill 概念封面",
        url: "/skills/zhihu/cover.jpg",
        visualKey: "research",
        sourceType: "ai_generated",
        sourceLabel: "Catnip 使用 OpenAI imagegen 生成（无知乎商标）",
      },
      {
        id: "zhihu-gallery-1",
        kind: "gallery",
        alt: "从研究问题经过 CLI 分流到搜索、热榜、直答、收藏和知识库的效果示意",
        url: "/skills/zhihu/effect.png",
        visualKey: "interface",
        sourceType: "ai_generated",
        sourceLabel: "Catnip 使用 OpenAI imagegen 生成的概念效果图",
      },
    ],
    features: [
      "搜索知乎社区原始内容并保留标题、作者、摘要与原文链接",
      "独立检索全网来源、查看知乎热榜并调用知乎直答",
      "按最小权限读取当前用户自己的创作、关注与收藏",
      "列出、检索和上传知识库，并查询开放 API 当日剩余额度",
      "提供知乎黑客松选题、接口组合、OAuth 与交付检查指南",
    ],
    useCases: ["收集知乎社区的真实经验与观点", "对比社区讨论和外部权威证据", "整理个人创作与收藏", "搭建知识库/RAG 工作流", "开发知乎开放平台或黑客松作品"],
    usageSteps: [
      "首次调用先运行 Skill 自带的无副作用 status，确认 CLI 版本和认证状态。",
      "如未安装，得到用户明确同意后再由 setup 从知乎官方 HTTPS manifest 下载并校验 CLI。",
      "公共搜索、热榜或直答只调用完成问题所需的最小命令组合。",
      "需要个人内容、收藏或知识库时，再引导用户生成 Access Secret，并通过标准输入安全配置。",
      "展示结论时保留原始来源链接，额度或频率受限后停止重复调用。",
    ],
    promptExamples: [
      "使用 zhihu 搜索知乎上关于独立开发者冷启动的真实经验，保留最相关回答的作者、摘要和原文链接，再总结共识与分歧。",
      "使用 zhihu 分别检索知乎社区观点和全网权威资料，比较两类证据；不要用直答替代原始来源。",
      "使用 zhihu 查看我指定知识库中与 Agent Skill 设计相关的内容，只读取完成这次问题所需的最小范围。",
    ],
    results: [
      { title: "社区证据可追溯", description: "搜索结果保留作者、摘要和原文链接，便于回看真实语境。" },
      { title: "研究路径更完整", description: "知乎社区、全网来源、直答和知识库可以按任务分开调用再综合。" },
      { title: "个人数据边界清晰", description: "认证和本人内容读取遵循显式授权、最小范围与本地凭据原则。" },
    ],
    risks: [
      "这是 0.5.3 beta 的固定快照；知乎官方 beta manifest 已存在更新版本，功能和接口可能继续变化。",
      "首次安装会从知乎官方 CDN 下载 CLI；个人内容、收藏和知识库能力需要 Access Secret，凭据不得进入对话、日志或仓库。",
      "搜索、直答、认证验证和知识库操作可能消耗开放平台额度；遇到限流或结果未知时不得无条件重试。",
      "官方发布包没有声明独立开源许可证；本站仅镜像 Neil 指定的官方归档并如实标注，不作额外法律结论。",
    ],
    relatedSlugs: ["idea-to-production-vibecoding", "dashi-ppt"],
  }),
];

const REQUIRED_PUBLIC_SKILL_SLUGS = new Set([
  "idea-to-production-vibecoding",
  "apple-design",
  "dashi-ppt",
  "zhihu",
]);

export const REQUIRED_PUBLIC_SKILL_SEEDS: readonly SkillResource[] = SKILL_SEEDS.filter(
  (skill) => REQUIRED_PUBLIC_SKILL_SLUGS.has(skill.slug),
);
