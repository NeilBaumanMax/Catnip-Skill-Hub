import type { CoverSize, CoverTheme, MainCategory, SkillResource, SkillSubtype } from "./types";

const repositoryUrl = "https://github.com/NeilBaumanMax/Catnip-Skill-Hub";

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
  galleryTheme?: CoverTheme;
  repositoryPath?: string;
  license?: string;
  version?: string;
  downloadEnabled?: boolean;
  sourceLabel?: string;
  adminNotes?: string;
}

function createSeed(input: SeedInput): SkillResource {
  const subtype = input.subtype ?? "single";

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
      name: "Catnip 薄荷猫",
      url: repositoryUrl,
    },
    source: {
      kind: subtype === "editorial_pack" ? "editorial_collection" : "catnip_original",
      label: input.sourceLabel ?? "Catnip Phase 2 原创演示目录",
      sourceUrl: repositoryUrl,
      repositoryUrl,
      repositoryPath: input.repositoryPath,
      license: input.license ?? "待管理员在正式发布前确认",
      version: input.version ?? "0.2.0-demo",
    },
    category: input.category,
    tags: input.tags,
    compatibility: ["Claude Code CLI", "Codex CLI"],
    images: [
      {
        id: `${input.slug}-cover`,
        kind: "cover",
        alt: `${input.title}概念封面`,
        visualKey: input.theme,
        sourceType: "catnip_css",
        sourceLabel: "Catnip Phase 2 CSS 占位视觉",
      },
      ...(input.galleryTheme
        ? [
            {
              id: `${input.slug}-gallery-1`,
              kind: "gallery" as const,
              alt: `${input.title}流程效果示意`,
              visualKey: input.galleryTheme,
              sourceType: "catnip_css" as const,
              sourceLabel: "Catnip Phase 2 CSS 占位视觉",
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
      recommendationWeight: 50,
      pinned: false,
      hidden: false,
      downloadEnabled: input.downloadEnabled ?? false,
      adminNotes: input.adminNotes ?? "Phase 2 原创演示种子；正式内容接入前不得开放下载。",
      reviewState: "unreviewed",
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
    slug: "deeper-reasoning",
    title: "让 Agent 思考得更深",
    originalName: "deeper-reasoning",
    summary: "通过反思、假设检查和多轮推理，减少过早给出浅层答案。",
    description: "为复杂问题建立结构化思考回路，让 Agent 在形成结论前主动检查假设、证据与替代解释。",
    category: "编程开发",
    tags: ["推理增强", "问题分析", "Codex CLI"],
    theme: "mind",
    size: "tall",
    features: ["拆分事实、假设与未知项", "生成替代解释并比较证据", "在输出前执行反思检查"],
    useCases: ["复杂技术方案评估", "难复现缺陷定位", "重要决策的反方检查"],
    usageSteps: ["提供问题、背景与约束", "要求先列假设再推理", "审阅反思结果后确认最终输出"],
    promptExamples: ["分析这个架构选择。先列出隐含假设，再给出至少两个替代方案，最后检查你的结论。"],
    results: [{ title: "更稳健的结论", description: "输出会显式区分证据与推测，方便继续验证。" }],
    risks: ["多轮反思会增加响应时间和上下文消耗", "结构化推理不能替代真实测试或专业审核"],
    relatedSlugs: ["codebase-map", "project-brief"],
    galleryTheme: "map",
  }),
  createSeed({
    slug: "interface-polish",
    title: "把界面细节做到位",
    originalName: "interface-polish",
    summary: "从层级、间距到交互状态，系统检查并改善前端完成度。",
    description: "用一致的审查框架覆盖视觉层级、排版节奏、响应式、键盘操作和状态反馈，帮助产品从能用走向完整。",
    category: "前端设计",
    tags: ["UI 审查", "响应式", "无障碍"],
    theme: "interface",
    size: "medium",
    features: ["检查视觉层级与间距节奏", "覆盖 hover、focus、disabled 等状态", "给出可直接执行的改进清单"],
    useCases: ["上线前界面验收", "设计稿落地复核", "移动端适配检查"],
    usageSteps: ["提供页面目标和现状", "指定重点设备与用户任务", "逐项实施并复核关键状态"],
    promptExamples: ["审查这个页面的层级、间距、键盘焦点和移动端表现，按影响程度排序建议。"],
    results: [{ title: "清晰的改进优先级", description: "把主观的‘不够精致’转化为可验证的问题列表。" }],
    risks: ["仍需在真实浏览器和设备中验证", "不应为了视觉统一牺牲产品任务效率"],
    relatedSlugs: ["design-system", "release-checklist"],
  }),
  createSeed({
    slug: "hardware-prototype",
    title: "快速搭出硬件原型",
    originalName: "hardware-prototype-pack",
    summary: "梳理器件、接线与固件步骤，让 Agent 陪你推进 IoT 原型。",
    description: "把 ESP32 原型从器件清单、接线约束、固件骨架到串口验证整理为连续工作流，适合快速验证硬件创意。",
    category: "VibeCoding 硬件",
    tags: ["ESP32", "IoT", "PlatformIO"],
    theme: "hardware",
    size: "large",
    subtype: "native_pack",
    features: ["生成器件与接口检查表", "组织固件模块和验证顺序", "保留电压、引脚和通信风险提示"],
    useCases: ["ESP32 传感器原型", "小型联网设备验证", "课程与工作坊硬件项目"],
    usageSteps: ["描述主控、器件和目标", "确认电气约束与接线", "分阶段烧录并记录串口结果"],
    promptExamples: ["我要用 ESP32 读取环境传感器并通过 Wi-Fi 上报。先检查器件兼容性，再给出分阶段原型计划。"],
    results: [{ title: "可逐步验证的原型路径", description: "每一步都有输入、预期结果和失败排查入口。" }],
    risks: ["接线前必须独立确认电压、电流和引脚能力", "Agent 输出不能替代数据手册与现场安全措施"],
    relatedSlugs: ["sensor-debug", "release-checklist"],
    childSkills: [
      { id: "esp32-planning", originalName: "esp32-planning", title: "ESP32 原型规划", summary: "整理器件、引脚与里程碑。", hasStandalonePage: false, sourceLabel: "Catnip 原创演示子项" },
      { id: "firmware-scaffold", originalName: "firmware-scaffold", title: "固件骨架生成", summary: "建立可分段验证的固件结构。", hasStandalonePage: false, sourceLabel: "Catnip 原创演示子项" },
      { id: "sensor-debug-child", originalName: "sensor-debug", title: "传感器故障定位", summary: "逐层排查采样链路。", hasStandalonePage: true, standaloneSlug: "sensor-debug", sourceLabel: "Catnip 原创演示子项" },
    ],
    galleryTheme: "sensor",
  }),
  createSeed({
    slug: "project-brief",
    title: "把模糊想法变成清晰任务",
    originalName: "project-brief",
    summary: "从目标、边界到验收标准，生成团队真正能执行的项目简报。",
    description: "通过连续澄清把想法压缩为目标、非目标、受众、约束、里程碑和验收标准，减少开工后的理解偏差。",
    category: "产品与项目管理",
    tags: ["需求拆解", "项目简报", "验收标准"],
    theme: "brief",
    size: "medium",
    features: ["区分目标与非目标", "识别关键依赖和未知项", "生成可测试的验收标准"],
    useCases: ["新功能立项", "跨团队任务交接", "Agent 开发任务说明"],
    usageSteps: ["描述原始想法", "回答关键澄清问题", "确认边界并锁定验收标准"],
    promptExamples: ["把下面的想法整理成项目简报。必须包含非目标、风险和可验证的完成定义。"],
    results: [{ title: "减少返工", description: "团队可以在写代码前发现范围和验收理解差异。" }],
    risks: ["简报质量依赖输入背景是否充分", "重大范围变化需要重新确认而不是静默追加"],
    relatedSlugs: ["release-checklist", "deeper-reasoning"],
    repositoryPath: "content/skills/project-brief",
    license: "MIT",
    version: "1.0.0",
    downloadEnabled: true,
    sourceLabel: "Catnip 原创 Skill",
    adminNotes: "Phase 3 可分发测试夹具；MIT License 已记录，管理员已显式开放镜像下载。",
  }),
  createSeed({
    slug: "automation-flow",
    title: "让重复工作自己流动",
    originalName: "automation-flow-pack",
    summary: "识别高频步骤并设计可复用的自动化工作流与失败处理。",
    description: "从触发条件、数据流、人工确认点和失败恢复四个角度设计自动化，让效率提升不以失控为代价。",
    category: "自动化",
    tags: ["工作流", "流程设计", "失败恢复"],
    theme: "flow",
    size: "tall",
    subtype: "editorial_pack",
    features: ["识别适合自动化的重复步骤", "定义人工确认与失败回退", "为每个节点记录输入输出"],
    useCases: ["内容整理与分发", "日常研发检查", "跨工具数据搬运"],
    usageSteps: ["列出现有人工流程", "标记风险和不可逆动作", "从只读步骤开始逐步自动化"],
    promptExamples: ["分析这个每周流程，找出可自动化节点，并为每个节点设计失败恢复和人工确认。"],
    results: [{ title: "可控的自动化蓝图", description: "明确哪些动作可以自动执行，哪些必须由人确认。" }],
    risks: ["不可逆外部操作必须保留权限门禁", "上游数据结构变化可能导致流程失效"],
    relatedSlugs: ["research-digest", "release-checklist"],
    childSkills: [
      { id: "workflow-mapping", originalName: "workflow-mapping", title: "工作流映射", summary: "记录触发、节点和输出。", hasStandalonePage: false, sourceLabel: "Catnip 编辑组合演示子项" },
      { id: "failure-recovery", originalName: "failure-recovery", title: "失败恢复设计", summary: "为异常路径定义恢复动作。", hasStandalonePage: false, sourceLabel: "Catnip 编辑组合演示子项" },
      { id: "research-digest-child", originalName: "research-digest", title: "资料行动摘要", summary: "把输入资料整理为行动线索。", hasStandalonePage: true, standaloneSlug: "research-digest", sourceLabel: "Catnip 编辑组合演示子项" },
    ],
    galleryTheme: "release",
  }),
  createSeed({
    slug: "codebase-map",
    title: "先看懂代码，再开始修改",
    originalName: "codebase-map",
    summary: "快速建立代码地图，标记入口、依赖关系与高风险改动区域。",
    description: "在写代码前定位应用入口、领域边界、数据流、关键脚本和质量门禁，为后续修改建立可验证的导航图。",
    category: "编程开发",
    tags: ["代码导航", "架构理解", "影响分析"],
    theme: "map",
    size: "large",
    features: ["识别应用入口和核心路径", "追踪模块依赖与数据流", "标记高风险耦合和验证命令"],
    useCases: ["接手陌生仓库", "大型重构前调查", "缺陷影响范围分析"],
    usageSteps: ["提供仓库目标和当前任务", "读取入口与配置文件", "形成地图后再制定改动计划"],
    promptExamples: ["先不要改代码。请画出这个仓库的入口、主要模块、数据流和测试门禁，并标记与目标功能相关的文件。"],
    results: [{ title: "更小的误改范围", description: "在施工前明确哪些文件必须改、哪些边界应保持不动。" }],
    risks: ["静态阅读可能遗漏运行时行为", "代码地图需要随架构变化及时更新"],
    relatedSlugs: ["deeper-reasoning", "release-checklist"],
    galleryTheme: "mind",
  }),
  createSeed({
    slug: "design-system",
    title: "从零散页面提炼设计系统",
    originalName: "design-system-pack",
    summary: "归纳颜色、字体、组件与状态规则，减少界面越做越乱。",
    description: "从现有界面抽取设计 token、组件构成、交互状态和内容规则，形成可渐进采用的轻量设计系统。",
    category: "前端设计",
    tags: ["Design System", "设计 Token", "组件规范"],
    theme: "system",
    size: "tall",
    subtype: "native_pack",
    features: ["盘点颜色、字体和间距 token", "归纳高频组件及状态", "生成渐进迁移建议"],
    useCases: ["多页面视觉收敛", "前端组件库规划", "设计与研发协作对齐"],
    usageSteps: ["收集代表性页面", "标记重复模式和例外", "先统一高频 token 再收敛组件"],
    promptExamples: ["根据这些页面提取最小设计系统，列出 token、组件、状态和迁移顺序。"],
    results: [{ title: "可持续的界面语言", description: "新页面可以复用规则，而不是继续复制局部样式。" }],
    risks: ["过早追求完整组件库会拖慢产品迭代", "需要保留有业务理由的视觉例外"],
    relatedSlugs: ["interface-polish", "project-brief"],
    childSkills: [
      { id: "token-audit", originalName: "token-audit", title: "设计 Token 盘点", summary: "归纳颜色、排版和间距。", hasStandalonePage: false, sourceLabel: "Catnip 原创演示子项" },
      { id: "component-states", originalName: "component-states", title: "组件状态审查", summary: "覆盖交互与异常状态。", hasStandalonePage: false, sourceLabel: "Catnip 原创演示子项" },
    ],
    galleryTheme: "interface",
  }),
  createSeed({
    slug: "sensor-debug",
    title: "定位传感器的隐形故障",
    originalName: "sensor-debug",
    summary: "按电源、通信、采样和环境因素逐层排查硬件异常。",
    description: "把传感器故障拆成电源、接线、总线、驱动、采样和环境六层，优先使用最小可证伪实验定位根因。",
    category: "VibeCoding 硬件",
    tags: ["传感器", "I2C", "故障排查"],
    theme: "sensor",
    size: "medium",
    features: ["建立分层排查顺序", "设计最小复现实验", "记录读数、环境和固件变量"],
    useCases: ["I2C 设备无响应", "采样漂移和噪声", "间歇性硬件故障"],
    usageSteps: ["记录器件和现象", "从电源与接线开始排除", "每次只改变一个变量"],
    promptExamples: ["这个 I2C 传感器偶发返回零值。请按电源、总线、驱动、采样和环境设计排查实验。"],
    results: [{ title: "可复现的故障证据", description: "将‘偶尔不工作’变成带变量和观察结果的排查记录。" }],
    risks: ["带电测量和接线操作必须遵守硬件安全规范", "不要用软件补偿掩盖尚未定位的电气问题"],
    relatedSlugs: ["hardware-prototype", "deeper-reasoning"],
  }),
  createSeed({
    slug: "release-checklist",
    title: "每次发布都更有把握",
    originalName: "release-checklist",
    summary: "把质量、安全、回滚与沟通整理成可重复执行的发布清单。",
    description: "围绕变更范围、验证结果、数据兼容、权限、安全、回滚和通知建立发布前后检查点。",
    category: "产品与项目管理",
    tags: ["发布管理", "回滚", "质量门禁"],
    theme: "release",
    size: "large",
    features: ["按风险调整发布门禁", "强制记录回滚目标和复测", "覆盖发布前后沟通"],
    useCases: ["Web 应用发布", "配置与依赖升级", "跨团队功能上线"],
    usageSteps: ["列出本次变更和影响范围", "执行对应质量门禁", "确认回滚点后再发布"],
    promptExamples: ["根据这次变更生成发布清单，必须包含安全检查、回滚命令、发布后观察和负责人。"],
    results: [{ title: "可审计的发布记录", description: "后续可以追溯检查、决策、版本和复测结果。" }],
    risks: ["清单不能代替对真实风险的判断", "未经验证的回滚命令不应在生产环境直接使用"],
    relatedSlugs: ["project-brief", "automation-flow"],
    galleryTheme: "brief",
  }),
  createSeed({
    slug: "research-digest",
    title: "把资料整理成行动线索",
    originalName: "research-digest",
    summary: "从分散来源提取观点、证据和待验证问题，形成清晰摘要。",
    description: "把多来源材料整理为结论、证据、分歧、未知项和行动建议，并保留来源线索方便复核。",
    category: "自动化",
    tags: ["信息整理", "研究摘要", "证据追踪"],
    theme: "research",
    size: "tall",
    features: ["区分观点、事实和推断", "合并重复信息并保留分歧", "为行动建议关联证据"],
    useCases: ["技术选型研究", "用户反馈整理", "竞品与趋势资料摘要"],
    usageSteps: ["提供材料与研究问题", "要求逐条保留来源线索", "人工复核关键结论后再行动"],
    promptExamples: ["整理这些资料：先列共识与分歧，再列证据不足的判断，最后给出下一步验证动作。"],
    results: [{ title: "从阅读转向行动", description: "摘要不仅压缩内容，还明确下一步需要验证什么。" }],
    risks: ["摘要可能遗漏来源语境，应保留原文入口", "时效性信息必须在实际使用前重新核验"],
    relatedSlugs: ["automation-flow", "deeper-reasoning"],
  }),
];
