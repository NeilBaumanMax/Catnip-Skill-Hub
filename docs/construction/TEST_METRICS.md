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

## Phase 3 Download and Install 门禁（当前基线）

除既有工程、展示和领域门禁外，还必须执行 `npm test` 并满足：

- 两个目标 Agent 与两个安装范围共四种命令严格来自实际核验的 skills CLI 参数，安装源为稳定仓库地址和原始 Skill 名称，不依赖中文传播标题。
- ZIP 包含完整原 Skill 文件夹，原 `SKILL.md` 字节一致；Catnip 安装说明和来源 JSON 只位于归档外层。
- 管理员关闭下载、未知资源、缺少来源、路径逃逸、符号链接和异常文件类型被服务端拒绝。
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

## Phase 5 Storage and Import 门禁（当前基线）

除既有全部工程与产品门禁外，还必须满足：

- `npm test` 覆盖 GitHub 根地址/固定 API 域名/禁重定向、Commit 固定、树/响应/文件数量与大小限制、SKILL.md UTF-8/NUL/frontmatter 校验。
- 导入预览显式声明不建稿、不发布，并且测试证明不会改变 Skill Repository；导入代码不执行仓库内容。
- ZIP 与图片按扩展名、MIME、魔数和大小验证，保存原字节副本与 SHA-256；匿名文件管理请求返回 401。
- 公开推荐只接受 HTTPS 链接，实施同源、蜜罐和每标识限流；线索独立存储，不创建 Skill 草稿且仅管理员可读取列表。
- 管理 Token、会话密钥和真实凭据不进入客户端或仓库；`.env.example` 只保留空占位。
- `npm run build` 成功生成导入/存储/推荐 API、管理动态页、公开 `/recommend` 页和既有路由。

当前验收只证明进程内开发适配器及边界，不证明文件/线索持久化、多实例限流、生产对象存储、GitHub 私有仓库访问或部署完成。

## 失败记录格式

记录时间、命令、退出状态、错误摘要、原因、修复文件/动作、复测命令和结果。首次失败不可被最终成功覆盖；未复测不能判定通过。

## 漂移验收

验证通过后核对 ARCHITECTURE、LAYER_CONTRACT、CONSTRUCTION_PLAN、package 脚本、GITHUB_ROLLBACK、WORKFLOW、产品需求、管理员/品牌/GitHub/Remote、Phase 越界、案例定位、用户认证、品牌资产、真实密钥和用户文件。任何修正后重跑受影响门禁。
