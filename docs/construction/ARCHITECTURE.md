# 架构说明

## 技术基线

当前技术基线为 Next.js 16.2.12 App Router、React 19.2.4、TypeScript、Tailwind CSS 4、ESLint 9 与 npm。应用采用 `src/` 目录；公开及管理路由位于 `src/app`，Skill 纯领域层位于 `src/lib/domain/skills`，安装/下载服务位于 `src/lib/install` 与 `src/lib/downloads`，管理员用例、认证和数据端口位于 `src/lib/admin`、`src/lib/auth` 与 `src/lib/data`，导入、存储、推荐线索、发现查询和统计分别位于 `src/lib/import`、`src/lib/storage`、`src/lib/recommendations`、`src/lib/discovery` 与 `src/lib/analytics`。ZIP 使用 `fflate`；密码、会话和文件哈希只使用 Node.js 标准加密能力；单元测试由 Node test runner 经 `tsx` 执行。

Phase 7 本地运行模式以 `CATNIP_PERSISTENCE_MODE=postgres` 启用 PostgreSQL 18.4、Drizzle ORM 0.45.2 与 SeaweedFS 4.29 S3 适配器；Compose 通过内部 backend 网络隔离数据服务，通过 edge 网络让 Caddy 缺省只向 `127.0.0.1:8080` 暴露应用。局域网模式必须显式选择一个 RFC1918 私网 IPv4，不能监听 `0.0.0.0`。未启用持久化模式时仍保留进程内适配器用于单元测试和轻量开发。服务器只读评估已完成但写施工明确暂缓；当前使用专用前端分支和既有局域网栈进行视觉迭代，服务器部署与公网 HTTPS 尚未建立。

## 目录与职责

- `src/app`：公共前台和未来管理端的路由组合、页面展示与交互。公共功能包括首页、分类、搜索、详情和推荐表单；管理端包括登录、资源 CRUD、状态、分类标签、文件图片和推荐线索。
- `src/lib/domain/skills`：Skill、Pack、子 Skill、资源类型、发布状态、分类标签、作者来源、版本和下载权限等纯领域规则。
- `src/lib/install`：两个 CLI、安装范围、参数验证和安装源选择。
- `src/lib/downloads`：ZIP 元数据、打包、Catnip 外层说明、下载授权和事件。
- `src/lib/import`：不可信外部来源的安全读取、规范化、限制和导入预览；不得自动写 Skill。
- `src/lib/storage`：本地开发与对象存储的统一文件接口及供应商适配。
- `src/lib/recommendations`：公开推荐字段验证、滥用限制、独立线索端口与管理读取。
- `src/lib/discovery`：公开目录搜索、分类/标签筛选、推荐池和随机排序；保持纯 TypeScript 和可注入随机源。
- `src/lib/analytics`：匿名增量事件、计数端口和可替换适配器；不识别普通用户。
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

## Phase 4 事实

- `src/lib/auth` 从 `CATNIP_ADMIN_EMAIL`、`CATNIP_ADMIN_PASSWORD_HASH` 和 `CATNIP_SESSION_SECRET` 读取预创建管理员配置；缺失时安全拒绝，不提供默认账号。
- 管理员密码使用 scrypt 哈希验证；八小时会话使用 HMAC-SHA256 签名、HttpOnly、SameSite=Strict Cookie，写请求额外校验同源 Origin。
- `src/lib/data/skills` 声明 Repository 契约并提供深拷贝的进程内适配器；它只用于 Phase 4 管理闭环验证，进程重启会恢复十条种子，不等同数据库。
- `src/lib/admin/skills` 强制新记录先为草稿，允许编辑核心字段、分类标签和管理员下载开关；发布资源必须先下架才能删除，空 Skill Pack 不得发布。
- `/admin/login` 与 `/admin` 为动态服务端页面；会话及资源 API 全部服务端授权，客户端不读取密码哈希或会话密钥，也不直接访问 Repository。
- 管理端发布目前只改变进程内管理记录；公开首页和详情仍读取版本化静态种子，直到后续持久化与公共查询适配完成。
- Phase 4 无数据库、ORM、外部认证供应商、普通用户认证、文件上传、对象存储、GitHub 导入、搜索或统计写入。

## Phase 5 事实

- `src/lib/import/github` 只接受 github.com HTTPS 仓库根地址，以固定 `api.github.com` 读取仓库、分支 Commit、递归树和原始 SKILL.md；禁用重定向，并限制超时、响应、树条目、文件数量和文件大小。
- 导入以实际 Commit SHA 固定树和文件读取，只解析有限 frontmatter 字段，拒绝无效 UTF-8、NUL、异常名称和不完整文件；输出明确为不建稿、不发布的预览。
- `src/lib/storage` 声明 `AssetStorage` 端口并提供深拷贝进程内适配器；ZIP 不解压，图片和 ZIP 按 MIME、扩展名、魔数、大小验证，原字节不改写并记录 SHA-256。
- 受保护管理 API 和面板提供导入预览、文件上传/列表/下载/删除；管理员认证和同源写门禁沿用 Phase 4。
- `/recommend` 与公开 API 收集 Skill 链接、发现渠道、推荐理由和选填联系方式，并带同源、蜜罐和进程内每标识限流；线索与 Skill Repository 完全隔离。
- GitHub Token 仅为服务端可选空环境占位。当前文件、推荐线索和 CMS 数据仍不持久化；无对象存储、数据库、搜索、统计或自动发布。

## Phase 6 事实

- `src/lib/discovery` 对已发布且未隐藏目录执行搜索；关键词覆盖中文标题、原始名称、简介、详细描述、作者、主分类和标签，GET 参数支持关键词、单一主分类和单一自由标签组合。
- 默认无筛选时仅从 `inRecommendationPool=true` 且正权重资源中随机排序；置顶组始终先于普通组，权重参与无放回随机顺序，随机源可注入测试且不修改种子数组。
- 首页改为动态服务端路由以便每次请求形成推荐顺序；筛选结果稳定排序，URL 可分享，空结果提供恢复入口，卡片仍整体链接且不提供直接下载。
- `src/lib/analytics` 声明四种事件和 Repository 端口，进程内适配器记录阅读、下载点击、安装复制和来源跳转；客户端只提交事件，不能提交绝对计数或任意指标名。
- 详情页访问通过客户端轻量事件写入，首页和详情读取计数快照；写 API 强制同源且拒绝未知或未公开 slug。
- 当前统计为匿名原始事件计数，不做 Cookie 追踪、唯一访客或去重保证；服务重启或多实例会丢失/分散。无数据库、搜索引擎、分析 SDK 或部署设施。

## Phase 7 本地部署事实

- `src/lib/data/db` 定义 Drizzle schema 与 postgres.js 连接；版本化 SQL 位于 `drizzle/`，迁移容器成功后应用才启动。
- Skill、推荐线索与统计端口在持久模式下使用 PostgreSQL 适配器；统计增量使用数据库原子 upsert，公开首页、详情、下载与管理端读取同一运行时 Skill Repository。
- `S3AssetStorage` 将文件元数据保存在 PostgreSQL、原始字节保存在 SeaweedFS S3，保持 Phase 5 的 `AssetStorage` 契约。
- 本地镜像以 Alpine 3.23 为小型固定基础，从 Alpine 官方仓库安装 Node 24.17.0、PostgreSQL 18.4 与 Caddy 2.11.4；SeaweedFS 4.29 arm64 上游归档以固定 SHA-256 校验。该 SeaweedFS 镜像只用于当前 Apple Silicon 本地里程碑，服务器架构必须重新确认。
- 长期进程实际以 UID 1001、Caddy 用户、UID 10001 和 PostgreSQL 用户运行；数据库/S3 无宿主端口，Caddy 只绑定一个显式本机地址。默认回环，当前局域网入口为 `192.168.120.107:8080`。
- `scripts/set-local-bind-address.mjs` 是本地暴露控制边界：只接受回环或 RFC1918 IPv4，原子更新被忽略的 `.env.local` 并保持 `0600`；Caddy 健康检查与 Compose `--wait` 防止切换后过早验收。
- `.env.local` 由脚本生成、权限为 `0600` 且被 Git 忽略；仓库只含空 `.env.example`。管理员邮箱和密码哈希为空时管理登录安全拒绝。
- `scripts/backup-local.sh` 生成 PostgreSQL custom dump、SeaweedFS 归档与 manifest；恢复脚本有显式确认门禁。真实备份已在隔离数据库和临时卷恢复验证。
- 当前完成的是本地生产式部署，不等于服务器、域名、公网 HTTPS、异机备份、监控或生产安全验收完成。

## 服务器评估后的预定共存边界

- 目标主机为 Ubuntu 22.04、x86_64、2 vCPU、约 3.6 GiB RAM、无 Swap；现有 nginx 独占宿主机 80，并代理既有 Next.js `3000` 与 Go `4000` 服务。
- 未来无域名临时预览不得复用 80 或使用路径前缀；预定由 Catnip 容器入口仅绑定 `127.0.0.1:18080`，宿主 nginx 新增独立 `8080` server block，再以 `http://118.195.247.102:8080` 暴露。
- Docker 不得直接绑定 `0.0.0.0`；PostgreSQL、S3、Next.js 均不得暴露宿主公网端口。现有 3000/4000 公网可达风险应通过腾讯云安全组收口，但变更前必须核对 80 回源。
- 当前 SeaweedFS 构建固定为 arm64，服务器部署前必须建立 amd64 或多架构产物并核验 checksum；不得把本机产物直接搬到服务器。
- 既有站点仓库含未提交及未跟踪内容，运行进程缺少完整 systemd 托管；部署工具不得进入、暂存、清理、重启或覆盖该工作区。
