---
name: Catnip Skill Hub
description: Curated Agent Skill discovery gallery
colors:
  gallery-canvas: "#071421"
  gallery-surface: "rgb(9 23 37 / 0.72)"
  gallery-ink: "#f4f7f7"
  gallery-muted: "#bbc9cf"
  gallery-line: "rgb(255 255 255 / 0.16)"
  catnip-mint: "#96dfa8"
  rail-ink: "#07111c"
  rail-text: "#f4f8f6"
  ecosystem-claude: "#d97757"
  ecosystem-codex: "#74d8ad"
  ecosystem-notion: "#f2f1ed"
  ecosystem-figma: "#ff7262"
  ecosystem-arduino: "#18a8a8"
  ecosystem-raspberry: "#c51a4a"
  ecosystem-docker: "#2496ed"
  ecosystem-terminal: "#b6a8ff"
typography:
  brandDisplay:
    fontFamily: "ui-rounded, SF Pro Rounded, system-ui, sans-serif"
    fontSize: "clamp(3.7rem, 7.2vw, 6.7rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.075em"
  display:
    fontFamily: "LXGW WenKai Catnip, PingFang SC, sans-serif"
    fontSize: "clamp(2.1rem, 4.2vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
  micro:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 680
    lineHeight: 1.2
  caption:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 580
    lineHeight: 1.2
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  compact: "9px"
  chip: "10px"
  control: "12px"
  wordmark: "13px"
  action: "14px"
  media: "15px"
  panel: "16px"
  filter: "18px"
  navigation: "22px"
  stage: "24px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.rail-ink}"
    textColor: "{colors.rail-text}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  filter-selected:
    backgroundColor: "{colors.gallery-ink}"
    textColor: "{colors.gallery-surface}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
---

# Design System: Catnip Skill Hub

## 2026-08-01 Public Header Distillation Override

公共顶栏只允许一个环境材质层：`.discovery-header` 负责滚动自适应背景、底部分隔和阴影；其内部 `.discovery-topline` 只承担品牌、搜索与推荐入口的网格布局，不得拥有第二层背景、四边边框、圆角、阴影或 blur。

- 品牌/搜索行与分类/标签行使用留白和一条 hairline 分组，不创建包裹整行的卡片。
- 搜索输入组、按钮和展开后的标签面板是有交互边界的控件，可以保留必要边框与底色；这不构成环境玻璃嵌套。
- 标签入口静止态透明；hover、focus、展开或已选时才出现轻量状态面。
- 详情与推荐页 breadcrumb 只使用单条分隔和间距，不再拥有独立玻璃卡片。
- 顶部通透、滚动实体化与 reduced-transparency 回退继续由唯一的公共 header 承担。

本节覆盖下方任何允许 topline、分类上下文或 breadcrumb 各自拥有独立玻璃容器的旧描述；不改变搜索、分类、标签、推荐和公共路由行为。

## 2026-07-31 Shell Correction Override

**Creative North Star: "山景玻璃画廊中的任务搜索台"**

Neil Bauman 明确认可上一轮的 Catnip 大字标、中央任务搜索台、场景标签和彩色生态带，但否决其余公共外壳替换。当前实现因此恢复并继续采用蓝调山景、64px 左侧图标栏、滚动自适应毛玻璃顶栏、顶部分类/标签和毛玻璃 Skill 内容流；搜索舞台只作为首页内容模块，不再改写全站导航。

- 桌面恢复固定 64px 左侧工具栏；860px 以下转换为顶部图标导航。
- 首页、详情页和推荐页继续共享同一山景、工具栏、品牌与顶部搜索外壳。
- 顶栏在页面顶部相对通透，向下滚动时逐步接近不透明，避免内容穿透。
- 五个固定分类和热门标签位于公共顶栏；首页内容区不重复建立第二套分类面板。
- 已认可模块保留 Catnip 大字标、任务输入、六个真实标签快捷入口和彩色生态带；不显示没有真实功能差异的搜索模式切换。
- Skill 瀑布流与内页内容面板恢复毛玻璃材质；不得用生态带颜色扩张全站主题。
- 1440 x 900 首屏仍须看到“今日精选”入口，搜索舞台不能演化成独占整屏的营销 Hero。

本节是当前最高优先级视觉契约，并覆盖下方 2026-07-31 旧覆盖中“移除固定左栏”“玻璃仅用于导航和搜索台”的描述。其余品牌、可访问性、色彩、动效与产品边界继续适用。

## 2026-07-31 Superseded Search Gallery Direction

**Creative North Star: "Catnip 搜索画廊"**

当前首页以一个紧凑的品牌搜索舞台建立第一印象，再通过彩色生态兼容带自然进入固定分类、标签与 Skill 瀑布流。它吸收参考站点清晰的视觉层级，但保留 Catnip 自有 Logo、薄荷绿强调色、蓝调山景环境与管理员策展身份。

- 页面类型：Agent Skill 公共发现首页。
- 受众：希望快速发现并判断 Skill 的创作者与开发者。
- 视觉参数：`DESIGN_VARIANCE 6`、`MOTION_INTENSITY 5`、`VISUAL_DENSITY 4`。
- 此段记录被后续 Shell Correction 覆盖的搜索画廊方向，不再作为当前外壳依据。
- 品牌搜索舞台高度受控，1440 × 900 首屏必须露出内容入口。
- 玻璃只用于导航和搜索台；Skill 卡片以图片、边线和空间组织为主。
- Catnip Mint 是唯一固定强调色；生态图标可以使用其原生颜色，蓝紫 AI 渐变禁止作为主题。
- 生态品牌色只允许出现在生态兼容带的图标、边线和名称中：Claude `#d97757`、Codex `#74d8ad`、Notion `#f2f1ed`、Figma `#ff7262`、Arduino `#18a8a8`、Raspberry Pi `#c51a4a`、Docker `#2496ed`、Terminal `#b6a8ff`；GitHub 使用既有近白文字色。
- 只允许一个缓慢生态图标 marquee；hover/focus 暂停，reduced-motion 静止。
- 生态标识不改变产品支持范围，正式安装目标仍为 Claude Code CLI 与 Codex CLI。
- 首页、推荐页和 Skill 详情页保持同一公共顶栏与环境背景；后台不采用该外壳。

本节关于搜索舞台、生态颜色和动效的规则仍适用；关于公共外壳、左栏和玻璃范围的规则已由上方 Shell Correction 覆盖。

## Overview

**Creative North Star: "山谷上方的策展影像墙"**

公共首页像一个悬浮在蓝调山谷上方的 Skill 内容画廊：操作入口稳定地退到左侧和顶部，封面流成为页面主体。它借鉴 Unsplash 的发现效率和内容优先，但保留 Catnip 的人工策展、来源可信与明确分类。山景负责环境，玻璃只负责功能层级；界面不依赖大型 Hero、蓝紫渐变、霓虹光晕或技术控制台装饰来制造氛围。

**Key Characteristics:**

- 半透明工具框架浮在同一张山景环境上。
- 图片和封面承担页面主要色彩。
- 搜索、分类和标签持续可见但不压过内容。
- 首页只负责发现，详情页才出现下载与安装。
- 正式 Catnip 图形与 `Catnip Skill Hub` 文字标识共同承担品牌识别。

## Brand Mark

- 唯一正式网页图形为 `/brand/logo.png`，来源是 Neil Bauman 于 2026-07-31 提供的 1078 × 1080 RGBA PNG。
- 桌面左侧工具栏使用 40px 图形，移动端使用 44px，顶部文字标识使用 34px；均保持原始比例并以 `object-fit: cover` 填充软圆角容器。
- 浏览器 icon 与 apple-touch-icon 使用同一稳定资源，标签页 title 精确为 `Catnip Skill Hub`。
- 不以字母、emoji、网络图片或重新生成的近似图形替代；Logo 链接必须提供可见文字或 aria 名称。

## Colors

低饱和蓝调山景承载多样封面，深蓝黑玻璃工具层提供稳定锚点，Catnip 薄荷绿只用于品牌、焦点和关键选中状态。

### Primary

- **Catnip Mint** (`#96dfa8`)：品牌识别、键盘焦点与少量关键状态。

### Neutral

- **Gallery Canvas** (`#071421`)：图片加载失败或减少透明度时的深蓝底色。
- **Gallery Surface** (`rgb(9 23 37 / 0.72)`)：卡片信息与功能面板玻璃底。
- **Gallery Ink** (`#f4f7f7`)：标题与主要操作。
- **Gallery Muted** (`#bbc9cf`)：作者、阅读量和辅助说明。
- **Rail Ink** (`#07111c`)：强对比控制和实色回退。
- **Gallery Line** (`rgb(255 255 255 / 0.16)`)：玻璃边缘与内容分隔。

**The Content Color Rule.** 页面色彩主要来自 Skill 封面。固定 UI 不使用蓝紫渐变、霓虹光晕或随机多色状态点。

## Typography

**Display Font:** LXGW WenKai Catnip，仅用于首页短标题。
**Body Font:** 系统无衬线字体栈。

展示字体提供有限的人格，工作型文字保持中性、紧凑和高识读。展示字体不能进入搜索、筛选、正文或元数据。

### Hierarchy

- **Display**（700，`clamp(2.1rem, 4.2vw, 4.5rem)`，1.02）：首页两行以内的发现标题。
- **Headline**（750，1.5-2.2rem，1.1）：内容区标题与空结果标题。
- **Title**（750，1-1.15rem，1.3）：Skill 卡片标题。
- **Body**（400，1rem，1.65）：说明文案，最大约 65ch。
- **Label**（700，0.8125rem，1.2）：导航、筛选与元数据。

## Layout

桌面端使用 64px 固定左栏，主内容区在其右侧。宽屏顶部使用 62px 品牌/搜索/推荐行；五分类保持横向单选导航，标签收敛为右侧 44px 下拉入口，两者维持同一控制行。标签选项在浮层内部纵向滚动，不因视口或标签数量拆出第二行。瀑布流采用保持 DOM 顺序的 CSS Grid 和有限比例跨度：1440px 为 4 列，1024px 为 3 列，768px 为 2 列，390px 为 1 列。860px 以下取消固定左栏，改用 64px 顶部入口，搜索独占一行。

## Elevation & Depth

系统用三种材质权重表达层级：左栏最厚、顶部控制次之、Skill 卡片信息层最轻。全部使用同一深蓝黑半透明家族、白色细边与带方向的柔和阴影。粘性顶栏在页面顶部为 38% 深蓝背景，根滚动前 240px 内线性增厚到 96%；24px blur 保持稳定，避免滚动时持续重算大面积模糊。不支持 scroll timeline 时默认使用 90% 安全背景。Hover 最多上移 3px，不使用发光边框。

**The Environmental Glass Rule.** 玻璃必须让同一张山景在栏、控制与卡片之间保持连续，只用于承载工具和文字；标签、元数据与封面内部不得继续套玻璃。

**The Scroll Material Rule.** 页面顶部可以通透以展示环境；内容开始进入粘性栏下方后，栏必须逐步实体化，不能让标题、分类或卡片文字穿透影响工具可读性。减少透明度或减少动效偏好直接使用近不透明状态。

## Shapes

控件使用 12px 圆角，媒体使用 15px 圆角，玻璃面板使用 16px 圆角，筛选使用全圆角。桌面左栏接近方正并以间距组织，避免全站所有元素都变成胶囊。

## Components

### Buttons

- **Shape:** 12px；标签不得换行。
- **Primary:** 近白实底、深蓝文字，最小高度 44px。
- **Hover / Focus:** 只调整亮度与边线；焦点使用 Catnip Mint 外轮廓。

### Chips

- **Style:** 未选中为玻璃工具层上的高对比文本。
- **State:** 选中为近白实底与深蓝文字；类别名称必须与固定五分类一致。
- **Filter distinction:** 主分类使用 44px 全圆角单选胶囊；自由标签入口使用 Tag 图标、12px 圆角和已选计数，展开后的复选面使用 44px 热区与 9px 圆角边线。面板采用两列桌面/单列手机布局和内部纵向滚动，禁止恢复顶栏水平标签带。标签字号使用 Micro/Label 层级，辅助计数只使用 Caption。

### Cards / Containers

- **Corner Style:** 外壳 16px，媒体顶部 15px。
- **Background:** 封面保持内容实色或图片；文字区使用轻量深蓝玻璃底。
- **Shadow Strategy:** 单一向下柔和阴影，不使用零偏移彩色光晕。
- **Internal Padding:** 文字区使用 14-15px 的信息节奏。

### Inputs / Fields

- **Style:** 深蓝半透明表面、1px 白色低透明边线、12px 圆角、44px 最小高度。
- **Focus:** Catnip Mint 双层可见焦点，不只改变颜色。

### Navigation

桌面工具栏使用 Phosphor `regular` 线性图标，统一为 22px；默认只显示图标，悬停或键盘聚焦时在栏外显示中文提示。链接必须保留中文 `aria-label`。首页、探索、分类、关于属于同一组首页位置导航，推荐 Skill 属于由分隔线隔开的独立操作，不得伪装成等价页面区域。首页位置由滚动区域决定持久选中，推荐页由路径决定选中；hover、focus 与 selected 分别表达。页面内位置使用 `aria-current="location"`，独立页面使用 `aria-current="page"`。

公共首页、推荐页和 Skill 详情页必须使用同一个 `PublicShell`：蓝调山景、左栏、品牌与顶部搜索保持连续。推荐页在内容区显示线索表单，详情页以“探索”为父级上下文；切换公开路由不能突然进入无左栏、无顶栏的另一套视觉系统。移动端保留四个首页位置入口和一个分组推荐操作，不显示普通用户登录。

### Skill Waterfall

封面比例从有限的 portrait、standard、wide 集合中选择。DOM 顺序、键盘顺序与屏幕阅读器顺序一致；封面下只显示标题、简介、作者、分类/标签和低优先级阅读量。

## Do's and Don'ts

### Do:

- **Do** 让 Skill 封面占据首屏主要面积。
- **Do** 保持搜索、分类、标签与清除条件真实可用。
- **Do** 使用来源明确的图片或清楚标记的演示封面。
- **Do** 在移动端明确重排工具栏与瀑布流。
- **Do** 为 `backdrop-filter` 不可用和 `prefers-reduced-transparency` 提供深蓝实色回退。

### Don't:

- **Don't** 放置占据首屏的大型搜索 Hero 或海报式标题。
- **Don't** 在首页加入下载、安装、收藏、普通用户登录或账户系统。
- **Don't** 复制 Unsplash 的品牌、图标、图片或文案。
- **Don't** 使用蓝紫渐变、霓虹光晕、装饰状态点或玻璃嵌套。
- **Don't** 让案例、专家、连接器、MCP 或 Prompt 成为首页主线。
