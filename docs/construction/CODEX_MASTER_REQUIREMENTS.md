# Codex 施工主要求

## 权威与身份

- 最新明确指令来自 Neil Bauman。
- 管理员和项目负责人始终为 Neil Bauman；团队品牌为 Catnip 薄荷猫；GitHub 用户为 NeilBaumanMax。
- 唯一目标仓库为 `NeilBaumanMax/Catnip-Skill-Hub`，origin 必须严格使用 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- 管理员身份不等于 Git 提交身份；不得编造或擅改全局 Git 配置。

## 施工门禁

1. 先读必读文档，再检查目录、文件、工具版本、Git、SSH、远端与提交身份。
2. 发现其他项目、未知且可能覆盖的改动、错误 SSH 身份、历史冲突、权限缺失或破坏性需求时停止并报告。
3. 在 DEV_PROGRESS 和当前层进度文件追加开工计划。
4. 从安全基线创建唯一时间戳备份分支，并成功 push 后再施工。
5. 限定在当前 Phase；变更后记录实际修改并执行真实验证。
6. 测试失败时停止扩展，记录首次失败、原因、修复和复测，不隐藏中间失败。
7. 验证成功后逐项检查产品、架构、脚本、Git、身份、品牌、密钥与 Phase 漂移。
8. 更新 LOG、DEV_PROGRESS、当前层进度和 HANDOFF，审阅差异，明确暂存、提交、push，再回写最终 Git 状态。

## 数据与安全

- 不覆盖、删除、回滚或自动暂存来源不明的用户文件；不使用 `git add .` 代替审查。
- 禁止 `git reset --hard`、`git clean -fd/-fx`、`git checkout -- <file>`、`git restore <file>` 和 force push，除非 Neil Bauman 后续明确授权且已证明不会丢失数据。
- 不读取、打印、复制或提交 SSH 私钥；不提交 `.env`、真实密钥、Token、密码或管理员凭据。
- 不把未建立的测试写成通过，不把仅本地分支写成 GitHub 备份，不把失败 push 写成已推送。

## 文档纪律

- `DEV_PROGRESS.md`、`LOG.md`、`HANDOFF.md` 与全部层进度文件只追加历史记录。
- 规范文档允许修正，但必须在 LOG 说明原因。
- 代码或运行事实优先被核验；发现文档漂移时先修正并复测。
- HANDOFF 必须让下一次 Codex 不读取聊天记录即可继续。

## 当前前端专项要求

- 当前前端开发分支为 `UI_fix`，施工前文档基线为 `fcf12d128caa7e0e0af76192781f0b5555ba1501`，开发前远端备份为 `backup/pre-ui-fix-cocoloop-20260731-2111`；旧 `SKill-hub-ui` 与 `frontend/visual-optimization` 分支保留，不删除。
- 前端施工以 `docs/construction/SKILL_HUB_UI_PLAN.md` 为专项依据：使用 WorkBuddy 的成熟信息架构、Marvis 的封面驱动浏览节奏和 Catnip 的管理员策展身份。
- 首次规划轮只写文档，不改 UI 代码；后续 UI-1 至 UI-4 每批完成施工闭环后必须停下向 Neil Bauman 汇报，未经继续指令不得进入下一批。
- 不因参考产品扩展专家、连接器、MCP、Prompt、社区、用户安装库或首页直接安装；Skill 仍是主角，下载和安装仍在详情页。

## 产品和 Phase 边界

- Skill 是产品主角，案例仅为详情页辅助内容。
- Phase 0 已完成：仓库、施工文档、产品/架构边界、品牌占位约定和最小可构建应用均已建立。
- Phase 0 不实现正式瀑布流、详情、搜索、下载、安装命令、后台、数据库、认证、导入、统计、正式 Logo 或吉祥物，也不引入复杂 UI/数据依赖。
- Phase 1 已完成：静态公共首页、文字品牌、五类目胶囊、静态 Skill 卡片瀑布流、基础导航和响应式已建立；展示数据仍是明确占位，不是正式领域数据。
- Phase 1 不实现真实搜索、筛选、随机算法、详情页、下载、安装命令、后台、数据库、认证、导入、统计、正式 Logo 或吉祥物。
- Phase 2 已完成：纯 TypeScript Skill 领域模型、单项/原生包/编辑包、父子关系、十条 Catnip 原创演示种子、详情内容和静态详情路由已建立。
- Phase 2 的种子是透明标记的演示目录，不是已验证的第三方资源；全部关闭下载，未绑定真实 License、Commit、ZIP 或安装参数。
- Phase 2 不实现 ZIP、安装命令、真实搜索/随机推荐、后台、数据库、认证、导入或统计写入。
- Phase 3 已完成：真实核验 skills CLI 1.5.20，建立独立安装命令层、只读 ZIP 下载层、下载 API、详情页操作面板和一个经校验的 Catnip 原创 Skill 夹具。
- Phase 3 只对管理员显式开放且具备真实本地文件的 `project-brief` 提供镜像下载；其他演示资源继续关闭。Catnip 附加文件只存在于 ZIP 外层，命令不依赖中文标题。
- Phase 3 不实现后台、认证、数据库、对象存储、GitHub 导入、搜索、随机推荐或统计写入。
- Phase 4 已完成：环境配置的预创建管理员、scrypt 密码验证、签名会话、服务端授权、草稿优先管理用例、Skill CRUD/发布/下架 API 和管理页面已建立。
- Phase 4 数据通过 Repository 契约访问；当前适配器仅为进程内开发状态，重启后恢复种子基线，不能写成数据库持久化或公开目录实时发布。
- 管理员真实邮箱、密码哈希和会话密钥只在部署环境配置；仓库无默认凭据或测试后门。普通访客继续无需登录。
- Phase 4 不实现数据库、对象存储、上传、GitHub 导入、推荐线索、搜索、随机推荐或统计写入。
- Phase 5 已完成：GitHub 导入只访问固定官方 API、固定来源 Commit、限量读取并仅生成预览；ZIP/图片经类型、扩展、魔数、大小和哈希验证后存入可替换端口；公开推荐仅形成独立线索。
- Phase 5 的文件、推荐线索和 Skill 管理记录仍是进程内开发状态，不是数据库或对象存储；导入不得自动创建草稿、发布或执行仓库内容。
- Phase 5 不实现搜索、筛选、随机推荐、阅读量、统计写入、PostgreSQL、Drizzle、对象存储供应商或部署。
- Phase 6 已完成：公开搜索覆盖标题、原名、简介、作者、分类和标签；分类/标签与关键词可组合；默认推荐只使用已发布、可见、进入推荐池且正权重的资源，并保持置顶优先。
- Phase 6 统计只接受阅读、ZIP 下载点击、安装命令复制和来源跳转四种增量事件；当前 Repository 为匿名进程内开发状态，不做唯一访客、用户画像或持久化承诺。
- Phase 6 不实现 PostgreSQL、Drizzle、对象存储、外部搜索/分析服务、Docker Compose、代理、HTTPS 或部署。
- Phase 7 本地部署和局域网访问里程碑已完成：Docker Desktop、PostgreSQL/Drizzle、SeaweedFS S3、Compose、Caddy 健康检查、备份恢复、重启持久化、显式 RFC1918 地址绑定与回环回滚均有真实验收。默认仍为回环绑定，不得使用 `0.0.0.0`。
- Phase 7 服务器只读评估已完成但服务器写施工尚未开始；Neil Bauman 已明确暂停服务器部署。不得执行或声称 Docker 安装、nginx 变更、公网部署、HTTPS 或生产验收完成。
- 当前主任务是在 `UI_fix` 分支完成 CocoLoop 启发的 Catnip 搜索画廊视觉优化，并通过已验收的局域网入口实时预览；不得借机重构后端或部署栈。
- 恢复服务器施工必须收到 Neil Bauman 新的明确指令，重新执行开工计划和远端备份，并满足 `docs/deployment/SERVER_DEPLOYMENT.md` 的回滚、架构、依赖和既有站点保护门禁。
