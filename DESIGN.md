---
name: Catnip Skill Hub
description: 中文 Agent Skill 的内容发现画廊
colors:
  gallery-canvas: "#f4f5f2"
  gallery-surface: "#ffffff"
  gallery-ink: "#171a18"
  gallery-muted: "#6b716d"
  gallery-line: "#dde1dc"
  catnip-mint: "#2f7d53"
  rail-ink: "#111512"
  rail-text: "#f2f5f2"
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
  media: "14px"
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

**Creative North Star: "策展工作台旁的影像墙"**

公共首页像一个专注于 Skill 的内容画廊：操作入口稳定地退到左侧和顶部，封面流成为页面主体。它借鉴 Unsplash 的发现效率和内容优先，但保留 Catnip 的中文策展、来源可信与明确分类。界面不依赖大型 Hero、蓝紫渐变、通用玻璃卡片或技术控制台装饰来制造氛围。

**Key Characteristics:**

- 紧凑工具框架包围开放内容画布。
- 图片和封面承担页面主要色彩。
- 搜索、分类和标签持续可见但不压过内容。
- 首页只负责发现，详情页才出现下载与安装。

## Colors

冷中性浅色画布承载多样封面，深色工具栏提供稳定锚点，Catnip 薄荷绿只用于品牌、焦点和关键选中状态。

### Primary

- **Catnip Mint** (`#2f7d53`)：品牌识别、键盘焦点与少量关键状态。

### Neutral

- **Gallery Canvas** (`#f4f5f2`)：首页连续内容画布。
- **Gallery Surface** (`#ffffff`)：搜索、控制和需要明确边界的表面。
- **Gallery Ink** (`#171a18`)：标题与主要操作。
- **Gallery Muted** (`#6b716d`)：作者、阅读量和辅助说明。
- **Rail Ink** (`#111512`)：桌面工具栏与强对比控制。

**The Content Color Rule.** 页面色彩主要来自 Skill 封面。固定 UI 不使用蓝紫渐变、霓虹光晕或随机多色状态点。

## Typography

**Display Font:** LXGW WenKai Catnip，仅用于首页短标题。
**Body Font:** 系统无衬线中文字体栈。

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

系统以平面和间距为主。粘性顶部控制可使用轻微背景模糊和单一环境阴影，Skill 卡片静止时不悬浮；Hover 只增强封面遮罩和标题关联，不大幅上移。

**The Flat Content Rule.** Skill 内容在画布上自然排列，不把每个条目包进通用玻璃面板。

## Shapes

控件使用 12px 圆角，媒体使用 14px 圆角，筛选使用全圆角。桌面左栏接近方正并以间距组织，避免全站所有元素都变成胶囊。

## Components

### Buttons

- **Shape:** 12px；标签不得换行。
- **Primary:** 深墨背景、浅色文字，最小高度 44px。
- **Hover / Focus:** 只调整亮度与边线；焦点使用 Catnip Mint 外轮廓。

### Chips

- **Style:** 未选中为浅色画布上的文本与细边线。
- **State:** 选中为深墨实底；类别名称必须与固定五分类一致。

### Cards / Containers

- **Corner Style:** 媒体 14px。
- **Background:** 卡片文字区与页面同底，不额外制造容器。
- **Shadow Strategy:** 默认无阴影。
- **Internal Padding:** 封面下使用 10-14px 的纵向信息节奏。

### Inputs / Fields

- **Style:** 白色表面、1px 冷灰边线、12px 圆角、44px 最小高度。
- **Focus:** Catnip Mint 双层可见焦点，不只改变颜色。

### Navigation

桌面工具栏使用图形缩写与可见文字提示；顶部控制保持一行。移动端保留品牌、探索、分类和推荐的等价入口，不显示普通用户登录。

### Skill Waterfall

封面比例从有限的 portrait、standard、wide 集合中选择。DOM 顺序、键盘顺序与屏幕阅读器顺序一致；封面下只显示标题、简介、作者、分类/标签和低优先级阅读量。

## Do's and Don'ts

### Do:

- **Do** 让 Skill 封面占据首屏主要面积。
- **Do** 保持搜索、分类、标签与清除条件真实可用。
- **Do** 使用来源明确的图片或清楚标记的演示封面。
- **Do** 在移动端明确重排工具栏与瀑布流。

### Don't:

- **Don't** 放置占据首屏的大型搜索 Hero 或海报式标题。
- **Don't** 在首页加入下载、安装、收藏、普通用户登录或账户系统。
- **Don't** 复制 Unsplash 的品牌、图标、图片或文案。
- **Don't** 使用蓝紫渐变、霓虹光晕、装饰状态点或玻璃卡片堆叠。
- **Don't** 让案例、专家、连接器、MCP 或 Prompt 成为首页主线。
