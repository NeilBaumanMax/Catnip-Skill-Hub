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
typography:
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
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  control: "12px"
  media: "15px"
  panel: "16px"
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
- 左侧工具栏使用 48px 图形，移动端使用 44px，顶部文字标识使用 38px；均保持原始比例并以 `object-fit: cover` 填充软圆角容器。
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

桌面端使用 84px 固定左栏，主内容区在其右侧。内容顶部是单行品牌/分类/搜索/推荐控制，第二行承载可横向滚动的标签。瀑布流采用保持 DOM 顺序的 CSS Grid 和有限比例跨度：1440px 为 4 列，1024px 为 3 列，768px 为 2 列，390px 为 1 列。移动端取消固定左栏，改用紧凑顶部入口，搜索独占一行。

## Elevation & Depth

系统用三种材质权重表达层级：左栏最厚、顶部控制次之、Skill 卡片信息层最轻。全部使用同一深蓝黑半透明家族、白色细边与带方向的柔和阴影。Hover 最多上移 3px，不使用发光边框。

**The Environmental Glass Rule.** 玻璃必须让同一张山景在栏、控制与卡片之间保持连续，只用于承载工具和文字；标签、元数据与封面内部不得继续套玻璃。

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

### Cards / Containers

- **Corner Style:** 外壳 16px，媒体顶部 15px。
- **Background:** 封面保持内容实色或图片；文字区使用轻量深蓝玻璃底。
- **Shadow Strategy:** 单一向下柔和阴影，不使用零偏移彩色光晕。
- **Internal Padding:** 文字区使用 14-15px 的信息节奏。

### Inputs / Fields

- **Style:** 深蓝半透明表面、1px 白色低透明边线、12px 圆角、44px 最小高度。
- **Focus:** Catnip Mint 双层可见焦点，不只改变颜色。

### Navigation

桌面工具栏使用 Phosphor `regular` 线性图标，统一为 22px；默认只显示图标，悬停或键盘聚焦时在栏外显示中文提示。链接必须保留中文 `aria-label`。移动端保留全部五个等价入口，不显示普通用户登录。

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
