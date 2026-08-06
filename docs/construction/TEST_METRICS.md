# 测试指标

## 代码施工前文档基线门禁（历史暂停状态）

| 命令/检查 | 成功标准 |
| --- | --- |
| `git diff --check` | 退出码 0，无空白错误或冲突标记 |
| docs 结构检查 | AGENTS、产品需求、全部施工规范与层进度文件存在 |
| 代码暂停检查 | 不存在 `src/app`、package.json、锁文件或构建配置 |
| 身份与远端检查 | Neil Bauman、NeilBaumanMax、Catnip 薄荷猫和指定 SSH Remote 一致 |

本门禁用于代码施工前的历史暂停状态；当前仓库已经完成应用脚手架，应使用下方 Phase 0 应用门禁。

## Phase 0 应用脚手架门禁（工程基线）

| 命令 | 成功标准 |
| --- | --- |
| `npm install`（新项目）或 `npm ci`（稳定锁文件） | 退出码 0，使用 npm 且生成/遵守 package-lock.json |
| `npm run lint` | 退出码 0，无 ESLint 错误 |
| `npm run typecheck` | 退出码 0，TypeScript `--noEmit` 无错误 |
| `npm run build` | 退出码 0，Next.js 生产构建成功 |
| `git diff --check` | 退出码 0，无空白错误或冲突标记 |

应用脚手架建立后，`package.json` 必须提供 lint、typecheck、build。存在真实 test 脚本时还要执行 `npm test`；不存在时必须写“单元测试脚本尚未建立”，并列出替代验证，不能声称单元测试通过。Phase 0 不建立空测试。

## Phase 1 Public Web 门禁（展示基线）

除工程基线全部命令外，还需确认：五个固定主分类全部出现；卡片整张链接预留稳定 slug；页面进入后快速出现 Skill 内容且没有大型搜索 Hero；正式搜索、详情、下载、安装、后台、数据库和认证均未实现；正式 Logo、吉祥物、网络猫图和真实凭据均不存在。搜索外观在 Phase 6 前不得被误报为可用搜索。

Phase 1 仍无单元测试脚本；以 lint、typecheck、生产构建、Git 差异检查和静态边界核对作为替代验证，不得写成单元测试通过。

## Phase 2 Skill Domain 门禁

除工程和展示基线全部命令外，还需确认：公开目录恰有十条唯一资源；覆盖五个主分类与单项、原生包、编辑包三种子类型；Pack 有子项且单项无子项；每条恰有一张封面、总图片不超过八张；独立子页和相关 slug 存在；待管理员确认 License 的种子不得开放下载；领域层不得依赖 React、Next.js、数据库或存储 SDK。

`npm run build` 必须成功静态生成首页和十个 `/skills/[slug]` 详情页。当前仍无单元测试脚本；模块加载领域断言、lint、typecheck、生产构建、Git 差异和静态边界核对属于替代验证，不能写成单元测试通过。

## Phase 3 Download and Install 门禁

除既有工程、展示和领域门禁外，还必须执行 `npm test` 并满足：

- 两个目标 Agent 与两个安装范围共四种命令严格来自实际核验的 skills CLI 参数，安装源为稳定仓库地址和原始 Skill 名称，不依赖中文传播标题。
- ZIP 包含完整原 Skill 文件夹，原 `SKILL.md` 字节一致；Catnip 安装说明和来源 JSON 只位于归档外层。
- 管理员关闭下载、未知资源、缺少来源、路径逃逸、符号链接和异常文件类型被服务端拒绝。
- 远端 Release 只接受固定内容主库、不可变 SemVer Tag 和与 slug/version 匹配的 ZIP；任意域名、latest、分支、查询参数、片段及文件名不匹配均被拒绝。
- 下载 API 对受信 Release 返回 `307` 和精确 `Location`，未配置 Release 的资源继续通过既有本地归档测试。
- UI 不直接打包 ZIP 或拼接命令；下载 API、安装层和下载层职责符合分层契约。
- `npm run build` 成功生成既有静态详情页和动态下载 API，且不保留文件追踪警告。

当前 `package.json` 已提供真实 `test` 脚本；不得再沿用“单元测试脚本尚未建立”的当前状态描述。历史 Phase 0 至 Phase 2 记录保持原事实。

## Phase 4 Admin CMS 门禁

除既有全部工程与产品门禁外，还必须满足：

- `npm test` 覆盖 scrypt 正误密码、缺失配置、管理员邮箱匹配、会话篡改与过期、同源写请求、匿名 401、真实登录 Cookie 和已认证 API。
- 所有新资源强制为草稿；合法发布/下架转换、已发布删除拒绝、空 Pack 发布拒绝、固定主分类和自由标签输入有验证。
- License 只保存信息，不自动决定发布或镜像下载；`downloadEnabled` 由管理员显式控制，但缺少实际可打包路径时必须阻止无效下载。
- 数据访问通过 Repository 端口且进程内实例隔离、返回深拷贝；UI 不直接写数据，数据层不依赖 React。
- `.env.example` 只有空占位；客户端、测试和仓库不含真实管理员邮箱、密码哈希或会话密钥。
- `npm run build` 成功生成管理员动态页面、会话 API、管理 API、既有公开页面和下载 API。

当前验收只证明进程内开发 CMS 和认证边界可用，不证明数据库持久化、跨实例一致性、公开目录实时发布、生产秘密配置或部署完成。

## Phase 5 Storage and Import 门禁

除既有全部工程与产品门禁外，还必须满足：

- `npm test` 覆盖 GitHub 根地址/固定 API 域名/禁重定向、Commit 固定、树/响应/文件数量与大小限制、SKILL.md UTF-8/NUL/frontmatter 校验。
- 导入预览显式声明不建稿、不发布，并且测试证明不会改变 Skill Repository；导入代码不执行仓库内容。
- ZIP 与图片按扩展名、MIME、魔数和大小验证，保存原字节副本与 SHA-256；匿名文件管理请求返回 401。
- 公开推荐只接受 HTTPS 链接，实施同源、蜜罐和每标识限流；线索独立存储，不创建 Skill 草稿且仅管理员可读取列表。
- 管理 Token、会话密钥和真实凭据不进入客户端或仓库；`.env.example` 只保留空占位。
- `npm run build` 成功生成导入/存储/推荐 API、管理动态页、公开 `/recommend` 页和既有路由。

当前验收只证明进程内开发适配器及边界，不证明文件/线索持久化、多实例限流、生产对象存储、GitHub 私有仓库访问或部署完成。

## Phase 6 Search and Discovery 门禁

除既有全部工程与产品门禁外，还必须满足：

- `npm test` 覆盖中文/英文查询、标题/原名/简介/作者/标签匹配、分类/标签/关键词组合、无效分类和空结果。
- 默认推荐只包含已发布、未隐藏、进入推荐池且正权重资源；置顶优先，随机源可注入，排序不修改原目录。
- 筛选状态由可分享 GET 参数表达；首页无大型搜索 Hero、卡片整张可点击且不直接提供下载。
- 统计只接受四种增量事件，拒绝任意指标、未知或未公开 slug；Repository 返回副本且实例隔离。
- 客户端只上报事件，不能提交绝对计数或直接写 Repository；事件 API 强制同源。
- `npm run build` 成功生成动态首页、新事件 API、既有静态详情及管理/下载/导入路由。

当前验收只证明静态目录搜索、服务端推荐和进程内匿名计数，不证明全文搜索质量、抗机器人、唯一访客、持久化、多实例一致性或生产分析准确性。

## Phase 7 Deployment 本地门禁（当前基线）

除既有门禁外，本地部署必须满足：

- `npm run db:check` 成功，空数据库迁移退出 0；PostgreSQL Repository 与统计增量跨实例持久化。
- S3 兼容适配器真实完成写、读、列、删，文件字节与元数据跨实例一致。
- `docker compose --env-file .env.local config --quiet` 成功；迁移一次性成功，PostgreSQL、对象存储和应用健康，反向代理只绑定一个经批准的回环或 RFC1918 地址，数据库与 S3 不暴露宿主端口。
- 应用、代理、对象存储与数据库进程使用各自非 root 身份；客户端无秘密，`.env.local` 权限为 `0600` 且被 Git 忽略。
- `/api/health` 返回 `postgres-s3`；首页经代理返回 200、品牌文本和安全响应头，不暴露 `X-Powered-By`。
- 服务停止并重启后数据仍在；数据库和对象卷各完成一次非破坏性的隔离恢复演练。
- `npm test`、lint、typecheck、生产 build、集成测试、shell 语法和 `git diff --check` 全部通过。

本门禁只证明当前 Mac Docker Desktop 的本地部署，不证明服务器、DNS、防火墙、公网 HTTPS、异机备份、告警或生产容量完成。

## Phase 7 局域网访问门禁

- 默认 Compose 配置继续绑定 `127.0.0.1`；局域网模式必须显式指定单个 RFC1918 IPv4，不能使用 `0.0.0.0`。
- 配置工具必须拒绝公网、链路本地、组播、IPv6 和无效输入，保留 `.env.local` 其他内容并维持 `0600` 权限。
- Caddy 只监听当前私网 IP 的 8080；PostgreSQL、S3 和 app 不新增宿主端口。
- Caddy 必须有真实健康检查，切换命令等待服务 healthy 后才执行访问验收，避免容器启动与代理就绪竞态。
- 私网健康接口、首页、品牌内容和安全响应头实测成功；管理员环境变量保持空值，不在局域网 HTTP 上启用管理登录。
- 必须记录 macOS 防火墙状态、当前私网地址可能漂移，以及恢复 `127.0.0.1` 的命令。

## Phase 7 服务器部署准备门禁

- `scripts/server-preflight.sh` 必须通过 `sh -n`，只包含只读系统/服务/端口/旧站状态检查，不安装包、不写配置、不读取环境秘密。
- SeaweedFS `linux/amd64` 镜像必须真实构建成功，SHA-256 校验通过，镜像架构为 `linux/amd64`，容器内 `weed version` 报告固定版本和 amd64。
- `docker compose --env-file deploy/server.env.template config --quiet` 成功；渲染结果只把 Caddy 发布到 `127.0.0.1:18080`，PostgreSQL、S3 和 app 仍无宿主端口。
- 服务器写施工前只读复核 Ubuntu、架构、CPU/内存/Swap、磁盘、Docker、nginx、监听端口和旧站未提交资产；任何漂移先停下记录。
- 腾讯云系统盘快照或经 Neil Bauman 明确选择且已验证的异机恢复方案是安装 Docker、修改 nginx 或安全组之前的硬门禁。
- 完整工程仍须执行 `npm test`、lint、typecheck、db:check、生产 build、Compose config、shell 语法和 `git diff --check`；服务器只读准备不等于公网部署验收。

## Phase 7 腾讯云首次部署门禁

- 写施工前必须有 Neil Bauman 确认的系统盘快照、已 push 的开发前 Git 备份和最新只读预检；生产环境文件必须在仓库外且为 `root:root 0600`。
- 所有生产镜像必须核验为 `linux/amd64`；迁移退出 0，PostgreSQL、SeaweedFS、app 与 Caddy healthy，数据库/S3/app 无宿主端口，Caddy 只监听 `127.0.0.1:18080`。
- nginx 修改前保留配置备份；`nginx -t` 成功后才 reload。公网只通过 80 访问，首页、详情、推荐和 `/api/health` 返回成功，健康接口明确为 `postgres-s3`。
- 反代后的同源写请求必须通过，伪造跨源仍返回 403；管理员配置为空时管理登录安全失败，不得在直接 IP HTTP 上启用真实管理员凭据。
- PostgreSQL custom dump 与 SeaweedFS 数据归档必须带校验和，并在隔离数据库和临时对象卷真实恢复；整套 Compose `down` / `up --wait` 后数据表数量和健康状态保持一致。
- 停止旧站前先完成新站 loopback 和公网验证；停止后确认 3000/4000 不再监听并再次公网复测。旧工作区默认保留，不以删除目录作为切换步骤。
- 执行 1440、1024、768、390 四视口的公网截图并读图；执行 `npm test`、lint、typecheck、db:check、production audit、生产构建与 `git diff --check`。沙箱造成的失败必须记录，使用等价非沙箱或 Docker 构建复测。
- 验收记录必须明确剩余的域名/HTTPS、系统补丁、UFW/安全组、异机备份、监控和管理员入口风险；直接 IP HTTP 浏览成功不等于完整生产安全验收。

## 前端视觉优化分支门禁

- 当前前端视觉修改只在 `main` 实施；`UI_fix` 已于 2026-08-03 经完整门禁后快进推广到 `main`。`UI_fix`、`SKill-hub-ui`、`frontend/visual-optimization` 和 `backend-server-deployment` 作为历史/隔离分支保留但不承接后续开发。
- 每轮先由 Neil Bauman 给出具体视觉目标，再记录 `01-public-web.md` 开工计划和开发前远端备份；不得把“优化前端”扩展成后端、数据、认证或部署重构。
- 每次可见修改后至少执行 `npm test`、lint、typecheck、生产 build，并通过当前局域网 URL 检查首页及受影响路由。
- 实时预览不替代提交前验证；不得在明文局域网环境启用真实管理员凭据。
- 每个 UI 批次检查 1440、1024、768、390 视口；首页、详情和推荐页至少各检查一条真实路由。
- 检查编辑式瀑布流 DOM/键盘顺序、焦点可见性、44px 触控目标、WCAG AA 对比、图片尺寸预留、空结果和 `prefers-reduced-motion`。
- 检查首页无下载/安装按钮、无大型搜索 Hero、无案例主线、无专家/连接器/MCP/Prompt 市场，并核对五个固定主分类。

## 失败记录格式

记录时间、命令、退出状态、错误摘要、原因、修复文件/动作、复测命令和结果。首次失败不可被最终成功覆盖；未复测不能判定通过。

## 漂移验收

验证通过后核对 ARCHITECTURE、LAYER_CONTRACT、CONSTRUCTION_PLAN、package 脚本、GITHUB_ROLLBACK、WORKFLOW、产品需求、管理员/品牌/GitHub/Remote、Phase 越界、案例定位、用户认证、品牌资产、真实密钥和用户文件。任何修正后重跑受影响门禁。
