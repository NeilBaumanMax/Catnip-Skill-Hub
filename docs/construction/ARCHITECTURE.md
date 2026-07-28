# 架构说明

## 技术基线

当前技术基线为 Next.js 16.2.12 App Router、React 19.2.4、TypeScript、Tailwind CSS 4、ESLint 9 与 npm。应用采用 `src/` 目录；公开路由位于 `src/app`，Skill 纯领域层位于 `src/lib/domain/skills`，安装和下载服务分别位于 `src/lib/install` 与 `src/lib/downloads`。ZIP 使用无供应商绑定的 `fflate`；单元测试由 Node test runner 经 `tsx` 执行。当前不接数据库或外部服务。

后续目标技术包括 PostgreSQL、Drizzle ORM、Docker Compose、可替换的 S3 兼容存储和仅管理员认证；这些不属于 Phase 0 依赖。

## 目录与职责

- `src/app`：公共前台和未来管理端的路由组合、页面展示与交互。公共功能包括首页、分类、搜索、详情和推荐表单；管理端包括登录、资源 CRUD、状态、分类标签、文件图片和推荐线索。
- `src/lib/domain/skills`：Skill、Pack、子 Skill、资源类型、发布状态、分类标签、作者来源、版本和下载权限等纯领域规则。
- `src/lib/install`：两个 CLI、安装范围、参数验证和安装源选择。
- `src/lib/downloads`：ZIP 元数据、打包、Catnip 外层说明、下载授权和事件。
- `src/lib/storage`：本地开发与对象存储的统一文件接口及供应商适配。
- `src/lib/data`：数据库访问、Repository、查询和事务边界。
- `src/lib/auth`：管理员认证、会话和权限；不包含普通用户认证。
- `public/brand`：可替换 Logo、吉祥物、社交分享图及约定。

Phase 2 已建立 `src/lib/domain/skills`，由类型、静态种子、目录约束与公开查询组成。`src/app` 只能通过领域导出读取 Skill，不维护重复资源数组。其余基础设施路径在对应 Phase 出现真实职责时创建，不预建空目录。

## 服务边界

页面通过用例/服务读取或发起动作；领域规则不依赖框架；数据、存储、下载、安装与认证以接口隔离外部实现。ZIP 打包、命令生成、持久化和授权不可藏在 UI 事件处理器中。

## 数据演进边界

资源模型首版支持 Skill 和 Skill Pack，并可表达单项、原生包、编辑包、父子关系、子项独立页面开关、单一主分类、多标签、草稿到发布状态、来源与版本、图片来源、下载开关、推荐池/权重/置顶/隐藏及低优先级统计字段。未来资源类型通过明确枚举扩展，首版前台不暴露未来类型。

## Phase 0 事实

- 已有最小应用、package.json、package-lock.json 和基础构建配置。
- 无数据库、ORM、认证、对象存储、搜索、ZIP、GitHub SDK、统计 SDK 或复杂状态库。
- 无正式品牌图像；首页使用文字品牌，`public/brand/README.md` 保留未来资源约定。
- 环境文件只有无真实值的 `.env.example`。

## Phase 1 事实

- `src/app/page.tsx` 提供文字品牌、基础导航、禁用状态的搜索外观、五个主分类胶囊、十张静态展示卡片和页脚说明。
- `src/app/globals.css` 提供可替换 CSS 封面构图、瀑布流、响应式、键盘焦点和 reduced-motion 处理；未增加 UI 依赖或正式品牌图片。
- 卡片链接预留 `/skills/<slug>`；Phase 2 前尚无详情路由，搜索、分类和推荐入口也不执行数据操作。
- 无领域层、下载/安装层、数据层、存储层、认证层、数据库或外部服务。

## Phase 2 事实

- `src/lib/domain/skills/types.ts` 定义资源类型、三种子类型、发布状态、五个主分类、作者来源、版本、图片、Pack 子项、推荐控制、下载权限和统计预留。
- `seeds.ts` 提供十条 Catnip 原创演示种子，覆盖五类目、单项 Skill、原生 Skill 包和编辑组合包；全部 `downloadEnabled: false`。
- `catalog.ts` 在模块加载时验证唯一 ID/slug、公开类型、分类、单封面、八图上限、Pack 子项、独立子页、相关资源与待确认 License 下载禁令，并提供纯查询函数。
- `src/app/page.tsx` 从领域查询读取首页资源；`src/app/skills/[slug]/page.tsx` 使用 `generateStaticParams` 生成十个详情页。
- 详情页展示 CSS 图片集、功能、场景、子项、用法、Prompt、效果、风险、来源和相关 Skill；下载/安装仅为禁用的 Phase 3 说明。
- 领域层不依赖 React、Next.js、数据库或对象存储；仍无下载/安装、数据、存储、认证层或外部服务。

## Phase 3 事实

- `src/lib/install` 根据经实际核验的 skills CLI 1.5.20 参数生成 Claude Code CLI/Codex CLI × 当前项目/全局安装的四种命令；来源只接受仓库根级 GitHub HTTPS 地址，Skill 名称使用稳定原始名称。
- `src/lib/downloads` 只读取 `content/skills` 下的普通目录，拒绝目录逃逸、符号链接和非普通文件，并根据管理员 `downloadEnabled` 字段决定是否归档。
- ZIP 保持原 Skill 文件夹内容和字节不变；`Catnip-安装说明.md` 与 `Catnip-来源信息.json` 只放在归档外层。
- `src/app/api/skills/[slug]/download` 是 Node.js 下载入口；详情页客户端组件只消费预生成命令和下载 URL，不直接拼接命令或打包 ZIP。
- `content/skills/project-brief` 是经 Skill 校验脚本验证的 Catnip 原创 MIT 夹具，也是当前唯一显式开放镜像下载的资源；其余九条演示资源继续关闭下载。
- 当前无数据库、对象存储、管理员认证、GitHub 导入、统计写入、真实搜索或随机推荐。
