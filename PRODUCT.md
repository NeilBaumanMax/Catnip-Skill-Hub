# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要用户希望快速发现、理解并安装 Agent Skill。他们可能在编程开发、前端设计、产品管理、自动化或硬件原型工作中使用 Claude Code CLI 与 Codex CLI，不需要登录即可完成公开浏览、搜索、详情阅读、ZIP 下载和安装命令复制。

## Product Purpose

Catnip Skill Hub 是由管理员筛选、整理和发布的 Agent Skill 发现站。它用视觉封面、展示标题和简短解释降低理解门槛，并在详情页提供来源、风险、下载和安装信息。成功意味着用户能迅速判断某个 Skill 是否适合自己的真实工作流。

## Positioning

Catnip 不是开放社区或通用插件市场。它以管理员策展、人工审核、原作者与来源可追溯为核心，将 Skill 作为创意内容和精品数字资源来组织，同时保持安装与下载边界清楚。

## Operating Context

- 公开访客通过首页搜索、固定主分类、标签和推荐池持续浏览 Skill。
- 首页负责发现，详情页负责深入判断、ZIP 下载和 CLI 安装命令。
- 管理员 Neil Bauman 负责草稿、发布、下架、来源、许可、下载开关和推荐池治理。
- 第一版正式支持标准 Agent Skill 与 Skill Pack，安装目标为 Claude Code CLI 和 Codex CLI。

## Capabilities and Constraints

- Skill 始终是主角；案例只能作为详情页辅助内容。
- 第一版没有普通用户注册、收藏、评论、评分、用户发布、社区、付费或多语言切换。
- 每个 Skill 只有一个固定主分类，可有多个自由标签。
- 首页卡片整张进入详情，不直接提供下载或安装。
- 资源先进入草稿，再由管理员发布；推荐表单只收集线索。
- 正式 Logo、吉祥物与品牌视觉资产尚未提供，不得伪造。
- 服务器部署当前暂停；前端工作不得扩展到生产部署或服务器配置。

## Brand Commitments

- 产品名称：Catnip Skill Hub。
- 公开品牌：Catnip Skill Hub，使用 Neil Bauman 提供的正式 Catnip 图形。
- 项目负责人和管理员：Neil Bauman。
- 正式网页 Logo 与 favicon 使用 `public/brand/logo.png`；后续替换必须由 Neil Bauman 提供新版本。
- 首页体验以图片驱动、持续发现、克制但不呆板为原则。
- Neil Bauman 已将 Unsplash 的左侧功能入口、顶部分类/搜索/标签和中部瀑布流设为当前首页参考方向；这是一项结构与审美约束，不授权复制其品牌素材。

## Evidence on Hand

- 产品事实：`docs/product/PRODUCT_REQUIREMENTS.md`。
- 工程与施工边界：`docs/construction/`。
- 现有十条明确标记的 Catnip 演示 Skill 数据与真实应用路由。
- 一张有来源记录的 Unsplash 蓝调山景图片，可作为替换性演示内容，不是正式品牌资产。
- 当前已有 Neil Bauman 提供的正式网页 Logo；仍没有正式吉祥物、完整正式 Skill 封面库、用户证言或商业数据，未来工作不得虚构这些内容。

## Product Principles

1. 先让用户看见 Skill，再让用户理解技术细节。
2. 首页服务发现，详情页服务决策和行动。
3. 清晰表达负责降低门槛，原始名称与来源负责保持可信。
4. 管理员策展优先于社区规模，发布治理优先于数量。
5. 不用虚构内容、状态或视觉资产换取表面完整。

## Accessibility & Inclusion

公共页面需要键盘可操作、焦点可见、正文达到 WCAG AA 对比度、触控目标不小于 44px，并尊重 reduced-motion。标题与说明必须保持清晰识读，不能让展示字体承担长文本。
