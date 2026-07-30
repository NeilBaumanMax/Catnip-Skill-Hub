# 开发进度

本文件按时间追加施工记录，不覆盖历史。

## 2026-07-27 04:58 CST / Phase 0 / 开工计划

### 本轮目标

建立可接力、可回滚、可测试的项目基础：完成施工与产品文档、工程边界、最小 Next.js 页面及基础质量门禁。

### 涉及层

- Foundation 与施工治理
- 公共前台的最小占位壳层
- 后续领域、安装、下载、存储、数据与认证层的边界定义（不实现业务）

### 当前仓库状态

- 当前目录为空目录初始化而来，无来源不明用户改动。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax。
- 远端此前为空，Bootstrap 已建立并推送。
- 工作区干净，当前分支为 main。

### 计划修改

- 创建 AGENTS.md、产品需求和完整施工文档结构。
- 定义 Phase 0 至 Phase 7、工程分层、依赖方向、测试与回滚规则。
- 创建最小 Next.js App Router、TypeScript、Tailwind CSS、ESLint 脚手架。
- 创建品牌资源约定、无真实凭据的 .env.example 和最小占位首页。

### 测试计划

- npm install
- npm run lint
- npm run typecheck
- npm run build
- git diff --check
- 检查是否存在 npm test；不存在则如实记录“单元测试脚本尚未建立”。

### GitHub 备份计划

- GitHub 仓库：
  NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：
  git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：533818fec7a8f2f3a4906183f92e58906d9e4792
- 备份分支：backup/pre-phase0-foundation-20260727-0456
- 备份 push 状态：成功；已通过 git ls-remote 核验远端分支。

### 回滚预案

本轮提交完成后如需撤销，优先对最终 Foundation 提交执行 `git revert <commit>`，随后复测 lint、typecheck 和 build。开发前原始基线保存在远端备份分支。

## 2026-07-27 05:07 CST / Phase 0 / 完成记录

### 完成范围

- 仓库、main Bootstrap 基线和远端开发前备份已建立。
- 产品、施工、架构、层契约、测试、回滚与交接文档结构完整。
- 最小 Next.js 16.2.12、TypeScript、Tailwind CSS、ESLint 应用和品牌约定已建立。
- 占位首页严格停留在 Phase 0，未实现后续业务。

### 验证状态

- npm install：成功。
- npm run lint：成功，漂移修正后复测成功。
- npm run typecheck：成功，漂移修正后复测成功。
- npm run build：首次受沙箱端口权限阻塞；同命令获准后复测成功。
- git diff --check：成功。
- 单元测试脚本尚未建立。

### 当前结论

Phase 0 工程与文档验收完成，等待 Git 交付收尾。下一轮只可在新的开工记录和开发前备份成功后进入 Phase 1。

## 2026-07-27 05:34 CST / Phase 0 / 文档优先范围修正开工计划

### 本轮目标

按 Neil Bauman 最新指令，将仓库收缩为“施工文档脚手架已建立、应用代码尚未开始”的可接力状态；在收到继续指令前不写应用代码。

### 涉及层

- Foundation 施工治理与文档事实修正
- 已生成应用脚手架的安全撤回

### 当前仓库状态

- 当前分支：main；工作区干净。
- 当前提交：`7eeb9d6ad47afcb7df21adf878e055396ef519ff`，与 `origin/main` 一致。
- SSH 已复验为 NeilBaumanMax；Remote 保持指定 SSH 地址。
- 当前存在已提交的 Next.js 应用、依赖和配置；这是本轮需要撤回的明确目标，不涉及来源不明用户文件。

### 计划修改

- 保留 AGENTS、docs、README、`.gitignore`、`.env.example` 和品牌资源说明。
- 删除 Next.js/TypeScript/Tailwind/ESLint 应用、依赖锁文件和构建配置。
- 修正规范中的 Phase 0 边界、测试门禁、当前 Phase 和交接事实。
- 不创建任何新应用代码、页面或依赖。

### 测试计划

- `git diff --check`
- 核对 docs 规定结构完整。
- 核对应用代码、package.json、锁文件和构建配置已不存在。
- 核对 Git、SSH、身份、品牌和 Remote 文本一致。
- 因代码与 package.json 将不存在，不执行或声称 npm lint、typecheck、build、test 通过。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`7eeb9d6ad47afcb7df21adf878e055396ef519ff`
- 备份分支：`backup/pre-phase0-docs-only-20260727-0534`
- 备份 push 状态：待执行

### 回滚预案

本轮完成后如需恢复撤回的应用脚手架，优先 revert 本轮范围修正提交；新的远端备份分支保留撤回前完整状态。

## 2026-07-27 05:37 CST / Phase 0 / 文档优先范围修正完成记录

### 完成范围

- 撤回已提交的 Next.js 应用、依赖、锁文件和构建配置。
- 删除本地可再生的 node_modules、.next 与 TypeScript 缓存。
- 修正当前 Phase、架构事实、施工计划、测试门禁、工具和回滚规范。
- 保留完整 docs 脚手架、AGENTS、README、品牌资源约定和安全环境示例。

### 验证状态

- `git diff --check`：成功。
- docs 结构检查：成功。
- 应用代码、package.json、锁文件和构建配置不存在。
- 身份、品牌和指定 SSH Remote 文本检查一致。
- lint、typecheck、build、test：当前无代码和 package.json，未执行且未声称通过。

### 当前结论

项目已暂停在写代码之前。只有收到 Neil Bauman 明确继续指令后，才可重新完成开工计划、开发前备份，并开始 Phase 0 最小应用脚手架。

## 2026-07-28 18:32 CST / Phase 0 / 应用脚手架开工计划

### 本轮目标

响应 Neil Bauman 的明确继续指令，完成 Phase 0 第二段：建立最小 Next.js App Router、TypeScript、Tailwind CSS、ESLint 应用和基础质量门禁；完成后停下汇报，不进入 Phase 1。

### 涉及层

- Foundation 工程基线
- 公共前台最小文字占位壳层（仅 Phase 0 三项规定文案）

### 当前仓库状态

- 当前分支：main；工作区干净。
- 当前提交：`594639767d947e93de0a1556f9d640b7c9510f6f`，与 `origin/main` 一致。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax；Remote 为指定 SSH 地址。
- `.DS_Store` 为已忽略的本地系统文件，不纳入施工或提交。

### 计划修改

- 使用当时稳定的官方 create-next-app 在隔离临时目录生成最小参考脚手架。
- 安全引入 Next.js App Router、TypeScript、Tailwind CSS、ESLint 与 npm 配置。
- 创建 `src/app` 最小页面，只显示 Catnip 薄荷猫、Agent Skill 独立站、Logo 与吉祥物将在后续接入。
- 提供 lint、typecheck、build 脚本和 package-lock.json。
- 不实现导航、卡片、瀑布流、详情、搜索、下载、安装、后台、数据库或认证。

### 测试计划

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- 检查 npm test 是否存在；不存在则记录“单元测试脚本尚未建立”。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`594639767d947e93de0a1556f9d640b7c9510f6f`
- 备份分支：`backup/pre-phase0-app-scaffold-20260728-1832`
- 备份 push 状态：待执行

### 回滚预案

本轮交付后如需撤销，优先 revert 本轮应用脚手架提交；开发前 docs-only 状态同时保存在远端备份分支。回滚后执行当前文档基线检查，恢复应用时执行 lint、typecheck 和 build。

## 2026-07-28 18:39 CST / Phase 0 / 应用脚手架完成记录

### 完成范围

- 使用官方稳定 create-next-app 16.2.12 作为隔离参考，建立 Next.js App Router、TypeScript、Tailwind CSS、ESLint 和 npm 基线。
- 使用 `src/` 目录创建最小占位首页和中文站点元数据。
- 提供 dev、start、lint、typecheck、build 脚本并生成 package-lock.json。
- 严格未实现 Phase 1 的导航、分类胶囊、Skill 卡片或响应式内容流。

### 验证状态

- `npm install`：成功；npm 报告 12 个 high severity 漏洞、两个 allowScripts 待审项和可选 WASM peer dependency 覆盖警告。
- `npm run lint`：成功。
- `npm run typecheck`：成功。
- `npm run build`：成功，首页和 not-found 静态预渲染。
- `git diff --check`：成功。
- 单元测试脚本尚未建立；未执行或虚报 npm test 通过。

### 当前结论

Phase 0 Foundation 已完成。按 Neil Bauman 的阶段汇报要求，本轮必须停下；只有收到下一次明确继续指令后才可进入 Phase 1。

## 2026-07-28 18:53 CST / Phase 1 / 开工计划

### 本轮目标

响应 Neil Bauman 的明确继续指令，完成 Phase 1 Public Web：建立 Catnip 公共页面外壳、文字品牌占位、分类胶囊、静态 Skill 卡片瀑布流、基础导航和响应式布局；完成后停下汇报，不进入 Phase 2。

### 涉及层

- 公共前台层：`src/app` 下的首页展示与基础交互语义。
- 品牌展示层：继续使用可替换的“Catnip 薄荷猫”文字品牌，不创建正式 Logo 或吉祥物。
- 静态展示数据：仅用于 Phase 1 卡片排版，不建立正式 Skill 领域模型或数据库访问。

### 当前仓库状态

- 当前分支：main；工作区干净。
- 当前提交：`8d7f2d0b4abe330bea44783b4bc69e50c2676a5b`，与 `origin/main` 一致。
- SSH 已认证为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 提交身份：Neil·Baumann `<2091760192@qq.com>`。

### 计划修改

- 将 Phase 0 最小占位页扩展为紧凑、图片感优先的静态发现首页。
- 增加文字品牌、探索/分类/推荐入口和无真实查询行为的顶部搜索外观。
- 增加五个固定主分类胶囊和静态 Skill 卡片瀑布流。
- 使用 CSS 视觉封面占位，不生成正式品牌资产，不下载网络猫图。
- 增加基础响应式、键盘焦点、语义结构和页脚来源说明。
- 不实现详情页、真实搜索、随机算法、下载、安装、后台、数据库、认证、导入或统计。

### 测试计划

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- 检查 npm test 是否存在；不存在则记录“单元测试脚本尚未建立”。
- 按 Phase 1 产品边界检查公开文案、分类、整卡链接、响应式样式和禁用范围。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`8d7f2d0b4abe330bea44783b4bc69e50c2676a5b`
- 备份分支：`backup/pre-phase1-public-web-20260728-1853`
- 备份 push 状态：待执行

### 回滚预案

本轮交付后如需撤销，优先 revert Phase 1 交付提交；开发前 Phase 0 状态保存在远端备份分支。回滚后重新执行 lint、typecheck、build 和 `git diff --check`。

## 2026-07-28 19:13 CST / Phase 1 / 完成记录

### 完成范围

- 建立紧凑公共首页、Catnip 薄荷猫文字品牌、基础导航和推荐入口。
- 建立五个固定主分类胶囊和十张静态 Skill 卡片瀑布流。
- 卡片包含 CSS 视觉封面、中文传播标题、简介、作者占位、分类和标签，整卡预留详情链接。
- 建立桌面/移动响应式、键盘焦点和 reduced-motion 处理。
- 搜索保持明确禁用的外观预览；未进入真实搜索、详情或后端施工。

### 验证状态

- `npm ci`：成功；保留 12 个 high 漏洞、allowScripts 和可选 WASM peer 警告。
- 首次 `npm run build`：因沙箱禁止 Turbopack 绑定本地端口而失败，已记录在 LOG。
- 授权环境同命令复测成功；随后全量 lint、typecheck、build、`git diff --check` 与边界核对全部成功。
- 单元测试脚本尚未建立；未执行或虚报 npm test 通过。

### 当前结论

Phase 1 Public Web 已完成。按 Neil Bauman 的阶段汇报要求，本轮必须停下；只有收到下一次明确继续指令后才可进入 Phase 2。

## 2026-07-28 19:42 CST / Phase 2 / 开工计划

### 本轮目标

响应 Neil Bauman 的明确继续指令，完成 Phase 2 Skill Domain：建立纯 TypeScript Skill 领域模型、Skill Pack 与子项关系、十条静态种子数据和静态详情页；完成后停下汇报，不进入 Phase 3。

### 涉及层

- Skill 领域层：`src/lib/domain/skills`。
- 公共前台层：首页从领域查询读取公开种子，新增 `src/app/skills/[slug]` 详情路由。
- 展示样式层：沿用 Phase 1 CSS 视觉语言，补充详情页、图片集和内容区样式。

### 当前仓库状态

- 当前分支：main；工作区干净。
- 当前提交：`37d463ebe4b48ca1fd2d37f5e4b87c8d56e73996`，与 `origin/main` 一致。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 提交身份：Neil·Baumann `<2091760192@qq.com>`。

### 计划修改

- 定义资源类型、子类型、发布状态、五个主分类、标签、作者来源、版本、图片、下载权限、推荐控制和统计预留。
- 表达单项 Skill、原生 Skill 包、编辑组合包、父子关系和子项独立页面开关。
- 将首页临时数组替换为领域层公开查询结果。
- 建立十条 Catnip 原创演示种子；明确关闭下载并避免虚构第三方作者、License、Commit 或仓库事实。
- 建立静态详情页，按产品顺序展示标题、来源、图片集、Phase 3 操作占位、功能、场景、子项、用法、效果、风险、来源与相关 Skill。
- 不实现 ZIP、安装命令、真实搜索、随机推荐、后台、数据库、认证、GitHub 导入或统计写入。

### 测试计划

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- 核验十条公开种子、三种子类型、Pack 子项关系、五个主分类和所有静态详情路由。
- 检查 npm test 是否存在；不存在则记录“单元测试脚本尚未建立”。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`37d463ebe4b48ca1fd2d37f5e4b87c8d56e73996`
- 备份分支：`backup/pre-phase2-skill-domain-20260728-1942`
- 备份 push 状态：待执行

### 回滚预案

本轮交付后如需撤销，优先 revert Phase 2 交付提交；Phase 1 完成状态保存在远端备份分支。回滚后重新执行 lint、typecheck、build、种子边界检查和 `git diff --check`。

## 2026-07-28 19:50 CST / Phase 2 / 完成记录

### 完成范围

- 建立纯 TypeScript Skill 领域类型、静态目录约束和公开查询。
- 建立十条 Catnip 原创演示种子，覆盖五类目、单项 Skill、原生包和编辑组合包。
- 建立 Pack 子项、独立页面开关、相关资源、图片来源、治理和统计预留。
- 首页改由领域查询供数；建立十个静态详情页及其 CSS 图片集、内容模块和来源说明。
- 下载与安装全部保持禁用并明确留给 Phase 3。

### 验证状态

- `npm ci`：成功；保留 12 个 high 漏洞、allowScripts 和可选 WASM peer 警告。
- `npm run lint`、`npm run typecheck`、`npm run build`、`git diff --check`：首轮全部成功。
- 构建静态生成 13 个页面，其中含首页、not-found 和十个 Skill 详情页。
- 领域依赖、类型覆盖、下载关闭和 Phase 边界核对成功。
- 单元测试脚本尚未建立；未执行或虚报 npm test 通过。

### 当前结论

Phase 2 Skill Domain 已完成。按 Neil Bauman 的阶段汇报要求，本轮必须停下；只有收到下一次明确继续指令后才可进入 Phase 3。

## 2026-07-28 22:22 CST / Phase 3 / 开工计划

### 本轮目标

响应 Neil Bauman 的明确继续指令，完成 Phase 3 Download and Install：实际核验 skills CLI、建立独立下载/安装服务、提供一个真实 Catnip 原创 Skill 夹具、生成标准 ZIP、接入详情页下载和安装命令选择；完成后停下汇报，不进入 Phase 4。

### 涉及层

- 下载层：`src/lib/downloads`，负责只读目录采集、ZIP 外层说明、来源 JSON、授权与归档。
- 安装层：`src/lib/install`，负责 Agent、范围、来源验证和命令生成。
- 公共前台层：详情页只消费服务结果，通过独立 API 下载，不在 React 组件内打包或拼命令。
- 测试层：建立真实单元测试脚本，验证命令矩阵、路径安全、ZIP 结构和原 Skill 内容不变。
- 内容夹具：`content/skills/project-brief`，使用 Skill 创建规范建立 Catnip 原创最小可分发 Skill。

### 当前仓库状态

- 当前分支：main；工作区干净。
- 当前提交：`72cfd8cd954c2c044f10c93b454f4149be9dead7`，与 `origin/main` 一致。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 提交身份：Neil·Baumann `<2091760192@qq.com>`。

### 计划修改

- 在远端备份完成后实际执行 `npx skills --help` 与 `npx skills add --help`，记录真实参数和 Agent 标识。
- 使用官方 Skill 初始化/校验脚本创建 `project-brief` 原创夹具，只包含必要 Skill 文件。
- 为该资源补齐仓库路径、明确 License、版本和管理员下载授权；其他演示种子继续关闭下载。
- 使用最小 ZIP 依赖建立服务，保持原 Skill 文件夹内部字节不变，Catnip 说明仅写入归档外层。
- 建立下载 API，严格限制到领域目录中已授权且路径安全的资源。
- 建立安装命令服务和可交互客户端面板，支持 Claude Code CLI/Codex CLI 与当前项目/全局范围。
- 新增真实 test 脚本和测试；不实现后台、数据库、认证、对象存储、GitHub 导入或统计。

### 测试计划

- `npm ci` 或依赖变更后的 `npm install`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- 实际检查四种安装命令、下载授权拒绝、路径逃逸拒绝、ZIP 顶层结构、原 SKILL.md 字节一致和 Catnip 元数据。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`72cfd8cd954c2c044f10c93b454f4149be9dead7`
- 备份分支：`backup/pre-phase3-download-install-20260728-2222`
- 备份 push 状态：待执行

### 回滚预案

本轮交付后如需撤销，优先 revert Phase 3 交付提交；Phase 2 完成状态保存在远端备份分支。回滚后执行 npm test、lint、typecheck、build、下载/安装边界检查和 `git diff --check`。

## 2026-07-28 22:39 CST / Phase 3 / 完成记录

### 完成范围

- 实际核验 skills CLI 1.5.20 的总帮助、add 帮助和版本，并在隔离临时项目中真实完成 Codex CLI 与 Claude Code CLI 的项目级安装。
- 建立 `src/lib/install` 命令服务，覆盖两个 Agent、两个范围、仓库地址与稳定 Skill 名称校验。
- 建立 `src/lib/downloads` 只读 ZIP 服务，包含管理员下载开关、`content/skills` 路径边界、文件类型保护和 Catnip 外层说明/来源元数据。
- 建立动态下载 API 和详情页操作面板；UI 不打包 ZIP，也不拼接安装命令。
- 使用 Skill 初始化规范建立并校验 Catnip 原创 `project-brief` 夹具；只有该资源开放下载，其余演示资源保持关闭。
- 建立真实 npm test 脚本与 7 项下载/安装单元测试。

### 验证状态

- `npm test`：7/7 通过。
- `npm run lint`、`npm run typecheck`、`git diff --check`：通过。
- `npm run build`：首次构建成功但出现动态文件追踪警告；收敛下载根目录后复测成功且警告消失。
- Skill 校验首次因系统 Python 缺少 PyYAML 失败；在 `/tmp` 隔离虚拟环境安装 PyYAML 后输出 `Skill is valid!`。
- `npm install` 成功；保留 12 个 high 漏洞、可选 peer 和三个 allowScripts 待审警告，不执行自动修复。

### 当前结论

Phase 3 Download and Install 已完成。按 Neil Bauman 的阶段汇报要求，本轮必须停下；只有收到下一次明确继续指令后才可进入 Phase 4 Admin CMS。

## 2026-07-28 23:07 CST / Phase 4 / 开工计划

### 本轮目标

响应 Neil Bauman 的明确继续指令，完成 Phase 4 Admin CMS：建立仅管理员使用的服务端认证、预创建账号配置、Skill 草稿/发布/下架状态机、最小 CRUD API 与管理界面；完成后停下汇报，不进入 Phase 5。

### 涉及层

- 认证层：`src/lib/auth`，负责环境配置、密码校验、签名会话和管理员授权。
- 数据访问层：`src/lib/data`，定义 Skill Repository，并提供 Phase 4 进程内开发适配器；不假装具备数据库持久化。
- 管理应用层：`src/lib/admin`，负责草稿优先、更新、发布、下架与删除用例。
- 管理后台层：`src/app/admin` 与受保护 API，只消费认证和应用服务，不直接写领域数据。
- 测试层：扩展真实单元测试，覆盖认证、会话、权限、状态转换、CRUD 和输入拒绝。

### 当前仓库状态

- 当前分支：main；工作区干净，`.DS_Store`、`.next` 和 `tsconfig.tsbuildinfo` 为已忽略或可再生产物。
- 当前提交：`c0ccd193c9a343cf101e5fe559251157d260bcad`，与 `origin/main` 一致且无领先/落后。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 提交身份：Neil·Baumann `<2091760192@qq.com>`。
- 仓库不存在 `.openai/hosting.json`，保留现有 Next.js 架构且本轮不部署。

### 计划修改

- 在远端备份成功后，为 `.env.example` 增加无真实值的管理员邮箱、scrypt 密码哈希和会话密钥占位。
- 使用 Node.js 标准加密能力建立密码哈希校验和带有效期、HttpOnly Cookie 的服务端签名会话；不提交默认密码或测试后门。
- 建立 Repository 契约和进程内适配器，清楚标记重启后复位，数据库持久化仍留给 Phase 7。
- 建立管理用例，强制新资源先进入草稿，并限制合法发布/下架转换。
- 建立登录页、受保护管理页及会话/Skill API；公开页面继续免登录。
- 建立最小管理界面，支持创建草稿、编辑核心字段、发布、下架和删除；不实现上传、GitHub 导入或推荐线索。
- 不引入 ORM、数据库、外部认证供应商、对象存储或普通用户认证。

### 测试计划

- `npm ci`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- 检查未配置认证时安全失败、错误密码拒绝、会话篡改/过期拒绝、未认证 API 401、草稿优先、状态转换、五类目约束和进程内仓储隔离。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`c0ccd193c9a343cf101e5fe559251157d260bcad`
- 备份分支：`backup/pre-phase4-admin-cms-20260728-2307`
- 备份 push 状态：待执行

### 回滚预案

本轮交付后如需撤销，优先 revert Phase 4 交付提交；Phase 3 完成状态保存在远端备份分支。回滚后执行 npm test、lint、typecheck、build、认证/管理边界检查和 `git diff --check`。

## 2026-07-28 23:21 CST / Phase 4 / 完成记录

### 完成范围

- 建立环境配置的预创建管理员、scrypt 密码哈希/验证、八小时签名会话、HttpOnly Cookie、同源写请求和服务端授权。
- 建立 `SkillRepository` 端口、深拷贝进程内适配器和运行时实例；明确状态非持久化。
- 建立草稿优先管理服务，支持创建、编辑、发布、下架和删除，以及固定分类、自由标签、GitHub 根地址、Pack 子项和下载路径边界。
- 建立登录页、受保护管理页、会话 API、Skill 管理 API 和响应式管理界面。
- `.env.example` 增加空安全占位；增加隐藏输入的管理员密码哈希工具，无真实凭据。
- 单元测试从 7 项扩展为 22 项，覆盖认证、会话、权限、API、状态机、Repository 及既有下载/安装能力。

### 验证状态

- `npm ci`：成功；保留 12 个 high 漏洞、可选 peer 覆盖和四个 allowScripts 待审项。
- `npm test`：最终 22/22 通过。
- `npm run lint`、`npm run typecheck`、`npm run build`、`git diff --check`：最终全部通过。
- typecheck 首次因 scrypt 重载、环境映射和只读测试写法失败；修正后复测与全量复测通过。
- 构建生成 `/admin`、`/admin/login`、会话/资源管理 API、既有公开详情与下载 API。

### 当前结论

Phase 4 Admin CMS 已完成其进程内开发闭环和安全边界。按 Neil Bauman 的阶段汇报要求，本轮必须停下；只有收到下一次明确继续指令后才可进入 Phase 5 Storage and Import。

## 2026-07-28 23:43 CST / Phase 5 / 开工计划

### 本轮目标

响应 Neil Bauman 的明确继续指令，完成 Phase 5 Storage and Import：建立安全 GitHub/SKILL.md 导入预览、可替换文件存储与 ZIP/图片管理、公开推荐 Skill 线索表单；完成后停下汇报，不进入 Phase 6。

### 涉及层

- 导入层：`src/lib/import`，负责 GitHub URL 规范化、固定 API 端点、超时/大小/数量限制、Commit 固定和 SKILL.md 安全解析。
- 存储层：`src/lib/storage`，负责文件端口、运行时开发适配器、类型/魔数/大小/哈希验证和元数据。
- 推荐线索层：`src/lib/recommendations`，负责字段验证、速率限制和非发布型线索记录。
- 管理后台/API：只允许管理员调用导入与文件管理；导入结果只作预览，不自动创建草稿。
- 公共前台/API：推荐表单无需登录，但需同源、蜜罐和限流；不会创建 Skill 页面。
- 测试层：覆盖 SSRF/URL、重定向、超时、响应限制、树截断、Commit 固定、恶意 SKILL.md、文件魔数/大小、匿名管理拒绝和推荐线索隔离。

### 当前仓库状态

- 当前分支：main；工作区干净，`.DS_Store`、`.next` 和 `tsconfig.tsbuildinfo` 为已忽略或可再生产物。
- 当前提交：`ca257f9fbf34e6c94091cfc7db603eb5623c889f`，与 `origin/main` 一致且无领先/落后。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 提交身份：Neil·Baumann `<2091760192@qq.com>`。
- 无 `.openai/hosting.json`、数据库或对象存储绑定；保留既有 Next.js 架构。

### 计划修改

- 在远端备份成功后，以原生 fetch 实现 GitHub REST 只读客户端，只访问 `api.github.com`，禁用重定向，支持可选服务端 Token。
- 先读取仓库与默认分支 Commit，再以固定 SHA 枚举树和读取最多 20 个 SKILL.md；拒绝截断树、超限响应和异常内容。
- 解析有限 frontmatter 字段，仅生成来源/名称/描述/路径预览；不执行仓库代码、不下载任意 URL、不自动创建草稿或发布。
- 建立文件存储端口与进程内开发适配器；ZIP 只保存原始字节不解压，图片按 MIME、扩展名和魔数校验，记录 SHA-256。
- 建立受保护的导入和文件管理 API及管理界面面板。
- 建立公开推荐表单、同源/蜜罐/字段校验和进程内限流；线索独立保存，不进入 Skill Repository。
- `.env.example` 只增加空的可选 GitHub Token 占位；不引入 GitHub SDK、上传库、数据库、对象存储 SDK、搜索或统计。

### 测试计划

- `npm ci`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- 验证 GitHub 固定域名/根仓库 URL、Commit 固定、超时/重定向/响应和树数量限制、SKILL.md 大小/NUL/frontmatter、文件类型/魔数/大小/哈希、匿名 401、推荐表单限流与不自动建草稿。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`ca257f9fbf34e6c94091cfc7db603eb5623c889f`
- 备份分支：`backup/pre-phase5-storage-import-20260728-2343`
- 备份 push 状态：待执行

### 回滚预案

本轮交付后如需撤销，优先 revert Phase 5 交付提交；Phase 4 完成状态保存在远端备份分支。回滚后执行 npm test、lint、typecheck、build、导入/存储/推荐边界检查和 `git diff --check`。

## 2026-07-28 23:59 CST / Phase 5 / 完成记录

### 完成范围

- 建立固定 GitHub API、禁重定向、超时/响应/树/文件限制、Commit 固定和 SKILL.md 有限解析的只读导入预览。
- 建立 `AssetStorage` 端口、深拷贝进程内开发适配器、ZIP/图片校验、原字节保存、SHA-256 元数据和受保护管理 API。
- 建立公开推荐页与线索 API，包含同源、蜜罐、字段验证和进程内限流；线索与 Skill Repository 隔离。
- 管理页增加导入预览、文件管理和推荐线索面板；导入不会自动建稿或发布。
- `.env.example` 增加空的可选服务端 GitHub Token 占位；未增加 SDK、数据库、对象存储、搜索或统计依赖。
- 测试从 22 项扩展到 34 项，覆盖导入、存储、推荐和匿名管理边界。

### 验证状态

- `npm ci`：成功；保留 12 个 high 漏洞、可选 peer 覆盖和四个 allowScripts 待审项。
- `npm test`：首轮 33/33 成功；补充匿名导入门禁后最终 34/34 成功。
- `npm run lint`、`npm run typecheck`、`git diff --check`：首轮与收尾复测均成功。
- `npm run build`：沙箱内首次因 Turbopack 绑定内部端口被拒绝而失败；非沙箱环境使用同一命令复测成功，生成 20 个路由。

### 当前结论

Phase 5 功能、边界与最终全量复测已完成，正处于 Git 收尾阶段。完成提交与 main push 后必须暂停，等待 Neil Bauman 明确指令再进入 Phase 6。

## 2026-07-29 00:18 CST / Phase 6 / 开工计划

### 本轮目标

响应 Neil Bauman 的明确继续指令，完成 Phase 6 Search and Discovery：建立公开搜索、主分类和标签筛选、推荐池随机展示，以及低优先级的页面阅读和基础事件统计；完成后停下汇报，不进入 Phase 7。

### 涉及层

- 搜索发现层：`src/lib/discovery`，负责查询规范化、中文/英文匹配、分类/标签过滤、推荐池与权重、随机排序和稳定 DTO。
- 统计层：`src/lib/analytics`，负责页面阅读、ZIP 下载、安装命令复制和来源跳转的事件计数端口及进程内开发适配器。
- 公共前台：主页通过 URL 查询参数消费发现服务；详情页通过轻量客户端事件组件写入统计 API。
- API：仅接受已发布且未隐藏的资源 slug 和受限事件类型；不接受任意指标名或客户端绝对计数。
- 测试层：覆盖空白查询、大小写/中文匹配、分类/标签组合、隐藏/推荐池/置顶/权重、随机边界、无效事件、未知资源与计数隔离。

### 当前仓库状态

- 当前分支：main；工作区干净，`.DS_Store`、`.next` 和 `tsconfig.tsbuildinfo` 为已忽略或可再生产物。
- 当前提交：`0962395111eb58abce18d2b71620b388472ec4bf`，与远端 main 一致。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 提交身份：Neil·Baumann `<2091760192@qq.com>`。
- 无 `.openai/hosting.json`、数据库、搜索引擎或统计 SDK；保留现有 Next.js、静态目录和进程内适配器策略。

### 计划修改

- 建立纯 TypeScript 发现服务，不引入搜索引擎或客户端状态库；搜索中文传播标题、原始名称、简介、作者、分类和标签。
- 首页搜索、分类与标签使用可分享的 GET 查询参数；结果为空时明确反馈并允许清除条件。
- 默认无筛选时从 `inRecommendationPool` 的已发布可见资源中随机排序；置顶优先，正权重影响抽取顺序；不修改原始目录数组。
- 建立统计端口与进程内开发适配器；详情页访问、下载点击、安装复制和来源跳转只执行增量事件，不做用户追踪或唯一访客推断。
- 首页卡片显示当前进程内阅读量作为低优先级信息；种子统计仅作初始值。
- 不接数据库、外部搜索、分析 SDK、Cookie 追踪、用户画像、支付或部署设施。

### 测试计划

- `npm ci`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- 验证发现组合条件、推荐治理字段、随机函数注入、事件白名单、未知/隐藏资源拒绝、并发安全语义、UI 不直接改统计状态和 Phase 7 未越界。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`0962395111eb58abce18d2b71620b388472ec4bf`
- 备份分支：`backup/pre-phase6-search-discovery-20260729-0018`
- 备份 push 状态：待执行

### 回滚预案

本轮交付后如需撤销，优先 revert Phase 6 交付提交；Phase 5 完成状态保存在远端备份分支。回滚后执行 npm test、lint、typecheck、build、搜索/筛选/推荐/统计边界检查和 `git diff --check`。

## 2026-07-29 00:25 CST / Phase 6 / 完成记录

### 完成范围

- 建立纯 TypeScript 发现服务，支持中文/英文关键词、固定主分类、自由标签和组合过滤。
- 默认首页使用推荐池、正权重和置顶治理字段进行可测试随机排序；筛选结果保持稳定排序。
- 首页搜索框、分类胶囊和标签筛选已启用，状态写入 GET 参数，提供结果摘要、清除条件和空结果恢复。
- 建立四事件统计端口、进程内开发 Repository、同源事件 API、详情阅读、下载点击、安装复制和来源跳转上报。
- 首页卡片显示当前进程内阅读量；详情页显示并在客户端递增阅读计数。
- 未增加 npm 依赖、数据库、搜索引擎、分析 SDK、用户追踪或部署配置。
- 测试从 34 项扩展到 42 项，覆盖发现、治理字段、随机注入、统计白名单、匿名边界和 Repository 隔离。

### 验证状态

- `npm ci`：成功；保留 12 个 high 漏洞、可选 peer 覆盖和四个 allowScripts 待审项。
- `npm test`：42/42 成功。
- `npm run lint`、`npm run typecheck`、`git diff --check`：首轮与收尾复测均成功。
- `npm run build`：授权环境首轮与收尾复测均成功；首页为动态服务端路由，新增事件 API，十个详情页继续静态生成。

### 当前结论

Phase 6 功能、边界和最终全量复测已完成，正处于 Git 收尾阶段。完成提交与 main push 后必须暂停，等待 Neil Bauman 明确指令再进入 Phase 7。

## 2026-07-29 09:13 CST / Phase 7 / 本地部署开工计划

### 本轮目标

响应 Neil Bauman 的继续与本地优先指令，完成 Phase 7 的本地部署里程碑：安装并验收 Docker Desktop，建立 PostgreSQL/Drizzle 持久层、S3 兼容对象存储适配、Docker Compose、迁移、备份恢复、本地反向代理与安全验收。真实服务器、域名和公网 HTTPS 在服务器目标与权限明确后继续，不在本轮伪报完成。

### 涉及层

- 数据访问层：用 PostgreSQL/Drizzle 适配现有 Skill、推荐线索和统计端口，提供迁移与原子增量语义。
- 存储层：以 S3 兼容适配器替换进程内文件状态，同时保留可测试端口和本地开发适配器。
- 运行与部署层：Next.js 生产镜像、Compose 服务、数据库/对象存储健康检查、本地反向代理、备份恢复和安全配置。
- 文档与测试层：部署运行手册、秘密配置边界、迁移/备份验证、容器健康与既有 42 项回归基线。

### 当前仓库状态

- 当前分支：main；工作区干净。
- 当前提交：`c8c593ee04bb7e7f1062eb3d702b78a89b7b1ee9`，与 `origin/main` 一致且无领先/落后。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已认证为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 提交身份：Neil·Baumann `<2091760192@qq.com>`。
- Docker Desktop 4.84.0、Engine 29.6.2、Compose 5.3.1 已安装；默认 containerd 镜像存储保留。较大远端镜像的 CDN EOF 通过本地 Alpine 固定版本构建解决，`hello-world` 最终拉取与运行成功；不稳定的 classic 尝试已撤销。
- 尚无服务器地址、域名、DNS、生产证书或服务器 SSH 权限；本轮仅建立和验收本地部署。

### 计划修改

- 先完成官方文档与依赖安全审计，选择有版本约束的 PostgreSQL、Drizzle、S3 兼容服务和反向代理镜像。
- 为现有 Repository/Storage 端口增加持久化适配器与运行时选择，不把 ORM、对象存储或秘密暴露到 UI。
- 建立版本化数据库 schema、迁移、种子/初始目录策略及原子统计增量。
- 建立多阶段非 root Next.js 镜像、Compose、健康检查、命名卷、内部网络和本地反向代理。
- 建立无真实值的环境模板、数据库与对象存储备份/恢复命令及本地部署说明。
- 不执行真实服务器发布、不申请域名/证书、不提交真实管理员凭据或存储密钥。

### 测试计划

- `npm ci`
- `npm audit --omit=dev` 与必要的依赖风险记录（不自动执行 breaking-change 修复）
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Drizzle schema/migration 检查与数据库集成测试
- `docker compose config`
- Docker 镜像构建、Compose 启动、健康检查、本地 HTTP 访问、持久化重启和备份/恢复演练
- `git diff --check` 与 Phase 7 文档漂移检查

### GitHub 备份计划

- GitHub 仓库：
  NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：
  git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`c8c593ee04bb7e7f1062eb3d702b78a89b7b1ee9`
- 备份分支：`backup/pre-phase7-local-deployment-20260729-0913`
- 备份 push 状态：成功；远端已核验指向基线

### 回滚预案

本轮交付后如需撤销，优先 revert Phase 7 本地部署提交；开发前 Phase 6 完成状态保存在远端备份分支。回滚后执行 npm test、lint、typecheck、build、数据库迁移/Repository 集成、Compose 配置与本地健康检查。数据库和对象卷恢复必须使用本轮记录的显式备份流程，不以删除卷作为默认回滚手段。

## 2026-07-29 11:12 CST / Phase 7 / 本地部署完成记录

### 完成范围

- 建立 PostgreSQL 18.4、Drizzle schema/迁移、Skill/推荐线索/统计持久化适配器与运行时选择；初始迁移写入十条公开 Skill。
- 建立 SeaweedFS 4.29 S3 兼容存储适配器，文件元数据与原始字节跨应用实例和容器重启保持一致。
- 建立非 root Next.js standalone、迁移、集成测试、数据库、对象存储与 Caddy 镜像，以及内部 backend 网络和仅回环暴露的 edge 入口。
- 建立安全随机本地环境生成、健康检查、数据库/对象卷备份恢复脚本和本地/服务器部署手册。
- 完成真实备份、隔离数据库恢复、隔离对象卷恢复、服务停止/重启持久化和本地 HTTP 安全头验收。
- 真实服务器、域名、DNS、公网 HTTPS、异机备份和生产监控未开始。

### 验证状态

- 既有 42 项单元测试、lint、typecheck、Drizzle check、生产构建与 Git 差异门禁通过。
- Compose 配置有效；migration 退出 0，PostgreSQL、SeaweedFS 与 app 健康，Caddy 在 `127.0.0.1:8080` 提供 200 响应。
- Compose 内 PostgreSQL/S3 跨实例集成测试 1/1 通过；重启后十条 Skill 保留。
- 有效备份为 `backups/20260729-105916/`；数据库与对象数据均完成隔离恢复验证。

### 当前结论

Phase 7 本地部署里程碑完成。完成 Git 收尾后停止；服务器部署必须在 Neil Bauman 明确继续并提供服务器、域名、DNS 和权限信息后另开施工轮次。

## 2026-07-29 14:00 CST / Phase 7 / 局域网访问开工计划

### 本轮目标

按 Neil Bauman 最新指令，先让当前 Mac 上的 Catnip Skill Hub 可由同一局域网其他设备访问，再停下验收；不进入公网服务器部署。保持默认回环绑定，只有显式配置本机私网 IPv4 时才开放局域网入口。

### 涉及层

- 部署配置：为 Caddy 端口绑定增加受验证的显式地址配置，禁止默认监听全部网卡。
- 本地运维：增加不打印秘密的绑定地址切换工具和恢复回环流程。
- 安全边界：公开浏览可通过局域网 HTTP 使用；管理员保持未配置和禁用，不在明文 HTTP 上启用管理会话。
- 文档与测试：记录局域网 URL、macOS 防火墙现状、设备验收步骤和服务器部署停点。

### 当前仓库状态

- 当前分支：main；工作区干净。
- 当前提交：`7727c2a871c50f90f978e6472f7cca234f2e8af1`，与 `origin/main` 无领先或落后。
- Remote：`git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`；Git 身份为 Neil·Baumann `<2091760192@qq.com>`。
- 本机活动私网地址：`192.168.120.107/24`；当前 8080 仅监听 `127.0.0.1`。
- macOS 应用防火墙当前关闭；本轮只绑定指定私网地址，不使用 `0.0.0.0`，不修改系统防火墙设置。

### 计划修改

- Compose 端口绑定从固定回环地址改为经过环境变量提供的显式地址，缺省值继续为 `127.0.0.1`。
- 新增安全切换脚本：只接受 loopback 或 RFC1918 IPv4，更新 `.env.local` 时不输出其他秘密，并可恢复回环绑定。
- 更新 `.env.example`、package scripts、本地部署手册、测试门禁和交接文档。
- 重新创建 Caddy 容器，验证只监听 `192.168.120.107:8080`，并用该地址检查健康接口、首页和安全响应头。

### 测试计划

- 配置脚本单元测试与输入拒绝测试。
- `npm test`、`npm run lint`、`npm run typecheck`、`npm run build`、`npm run db:check`。
- `docker compose config --quiet`、Compose 服务健康、监听地址检查。
- `curl http://192.168.120.107:8080/api/health` 与首页/安全头检查。
- 确认 `127.0.0.1:8080` 不再监听、数据库与 S3 仍无宿主端口、管理员配置仍为空。
- `git diff --check`、秘密扫描和文档漂移检查。

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`7727c2a871c50f90f978e6472f7cca234f2e8af1`
- 备份分支：`backup/pre-phase7-lan-access-20260729-1400`
- 备份 push 状态：待执行

### 回滚预案

运行绑定工具恢复 `127.0.0.1` 并重新创建 Caddy，即可立即撤销局域网暴露；代码交付后如需整体撤销，优先 revert 本轮提交。回滚后复测 Compose 配置、回环健康接口、unit、lint、typecheck、build、db:check 和 `git diff --check`，不得删除数据卷。

## 2026-07-29 14:09 CST / Phase 7 / 局域网访问完成记录

### 完成范围

- Compose 缺省仍绑定 `127.0.0.1`，显式配置后只绑定当前 RFC1918 私网地址 `192.168.120.107:8080`；未使用 `0.0.0.0`。
- 新增局域网绑定工具，验证回环/RFC1918 IPv4、拒绝公网/链路本地/组播/IPv6/无效输入，原子更新 `.env.local` 并保持 `0600`。
- 新增 Caddy 健康检查和 Compose `--wait` 操作，消除端口切换后的就绪竞态。
- 实际完成危险地址拒绝、局域网健康/首页/安全头、回环回滚、局域网恢复和单一监听地址验收。
- 管理员邮箱与哈希仍为空；局域网 HTTP 仅用于公开浏览，不启用管理员会话。

### 验证状态

- `npm test`：45/45 成功；新增3项绑定地址测试。
- lint、typecheck、db:check、生产 build、Compose 配置和 1/1 PostgreSQL/S3 集成测试成功。
- Caddy、app、PostgreSQL、SeaweedFS 均 healthy；migration 退出 0。
- 私网健康接口返回 `postgres-s3`；首页 200 且安全头正常；`127.0.0.1:8080` 在局域网模式不监听。
- 代码侧与本机入口验收完成；其他物理设备的浏览器验收需 Neil Bauman 使用同一局域网打开 URL 确认。

### 当前结论

Phase 7 局域网访问里程碑完成，当前入口为 `http://192.168.120.107:8080`。Git 收尾后停止；服务器部署仍需独立开工计划、目标服务器信息和生产安全门禁。

## 2026-07-29 22:33 CST / Phase 7 / 服务器部署暂缓与前端分支准备开工计划

### 本轮目标

按 Neil Bauman 最新指令暂停服务器部署，把已核验的目标服务器现状、共存方案、风险和恢复施工条件写入部署与交接文档；完成文档漂移修正、验证、提交和 main push 后，从干净基线创建并推送专用前端优化分支，但不在本轮擅自修改前端视觉。

### 涉及层

- 部署治理层：记录服务器只读评估、暂缓决定和未来直接 IP 隔离部署方案。
- 公共前台施工治理：把当前主任务切换为局域网实时预览下的前端优化，并建立独立工作分支边界。
- Git 与交接层：保留 main 的文档决策基线，建立开发前远端备份和可接力前端分支。

### 当前仓库状态

- 当前分支：`main`；工作区干净。
- 当前提交：`d5b8cc6e9f504f58a1b2143c447feb40501eec36`，与 `origin/main` 一致。
- Node.js：v24.18.0；npm：11.16.0。
- SSH 已复验为 NeilBaumanMax；Remote 为 `git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- 本地完整栈继续通过 `http://192.168.120.107:8080` 向受信任局域网开放。

### 计划修改

- 修正 AGENTS、主要求、总体计划、架构、服务器部署手册、Phase 7 进度及交接中的当前暂停点。
- 记录目标服务器 `118.195.247.102` 的只读核验事实、现有站点保护边界、无快照风险、依赖审计和 amd64 适配要求。
- 明确未来临时直接 IP 方案为独立 `8080` 入口，保留现有 nginx/80/3000/4000 应用，不在本轮执行服务器安装或配置。
- 完成文档提交和 main push 后创建并推送 `frontend/visual-optimization`，后续只按 Neil Bauman 的具体视觉指令修改前端。

### 测试计划

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run db:check`
- `docker compose config --quiet`
- 本地局域网健康接口与首页访问检查
- `git diff --check`、身份/品牌/Remote/Phase/秘密/服务器暂缓决策文档漂移检查

### GitHub 备份计划

- GitHub 仓库：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- 当前分支：main
- 基线提交：`d5b8cc6e9f504f58a1b2143c447feb40501eec36`
- 备份分支：`backup/pre-frontend-docs-20260729-2233`
- 备份 push 状态：待执行

### 回滚预案

文档决策如需撤销，优先 revert 本轮文档提交；开发前状态由远端备份分支保留。前端分支尚未产生视觉变更时可直接停止使用而不影响 main。回滚或切换后复测 unit、lint、typecheck、build、db:check、Compose 配置和局域网健康入口，不删除数据卷。

## 2026-07-29 22:43 CST / Phase 7 / 服务器部署暂缓与前端分支准备完成记录

### 完成范围

- 将目标服务器只读评估、旧站保护边界、无快照风险、生产依赖漏洞、amd64 门禁和未来直接 IP 隔离拓扑写入部署手册。
- 修正 AGENTS、主要求、架构、施工计划和测试指标中的当前暂停点；服务器部署正式暂缓，当前主任务切换为独立前端分支。
- 没有连接服务器执行写操作，没有安装 Docker、修改 nginx、防火墙或旧站文件，也没有修改任何前端页面、样式和应用代码。
- 远端开发前备份 `backup/pre-frontend-docs-20260729-2233` 已成功 push，指向开发前基线。

### 验证状态

- `npm test`：45/45 成功；lint、typecheck、db:check 成功。
- `npm run build`：受限环境首次因 Turbopack 内部端口权限失败，获准环境同命令复测成功。
- Compose 配置首次因未传 `.env.local` 被必填变量门禁拒绝；使用手册规定命令复测成功。Docker 状态首次受 socket 权限限制，获准只读复测显示全部长期服务 healthy。
- 局域网 `/api/health` 返回 `postgres-s3`，首页返回 HTTP 200；现有实时预览未中断。
- 文档漂移检查已修正 Compose 门禁命令、当前 Phase、服务器事实和前端分支边界。

### 当前结论

服务器部署讨论已完整落盘并暂停。完成 Git 收尾后创建并推送 `frontend/visual-optimization`，停在不修改前端代码的干净起点，等待 Neil Bauman 的具体前端修改指令。
## 2026-07-30 08:27 CST / 前端视觉规划 / 开工计划

### 本轮目标

在指定基线 `059ab6a50f5cba20aa756811e36d2ad1afee2c28` 的后继分支 `SKill-hub-ui` 上，完成 Marvis 与 WorkBuddy Skill 广场的对照分析，形成 Catnip 新一轮前端信息架构、视觉系统、瀑布流策略、响应式与验收规划。本轮只修改施工文档，不修改前端代码。

### 涉及层

- 公共前台层：规划首页、详情页与推荐页的统一体验。
- Skill 领域层：只核对现有字段是否足以支持视觉表达，不修改领域逻辑。
- 施工文档层：建立本轮可接力、可回滚、可测试的 UI 施工依据。

### 当前仓库状态

- 当前分支：`SKill-hub-ui`。
- 当前 HEAD：`059ab6a50f5cba20aa756811e36d2ad1afee2c28`。
- origin：`git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- SSH 认证：`NeilBaumanMax`。
- Git 提交身份：`Neil·Baumann <2091760192@qq.com>`。
- 未跟踪的 `.agents/`、`.codex/`、`skills-lock.json` 属于用户工具配置，本轮不读取业务内容、不修改、不暂存、不提交。

### 计划修改

- 新建 Catnip Skill Hub UI 专项规划文档。
- 记录 Marvis 与 WorkBuddy 的可借鉴模式、拒绝模式和 Catnip 合成原则。
- 明确首页信息架构、编辑式瀑布流、卡片内容、搜索筛选、详情页、视觉令牌、动效、响应式、无障碍和性能门禁。
- 修正施工规范中的旧前端分支指向，并更新 LOG、HANDOFF 与公共前台层进度。

### 测试计划

- 文档结构、身份、品牌、Remote、Phase 边界和需求一致性检查。
- `git diff --check`。
- 本轮不改代码，因此不把既有应用测试写成本轮代码验证；收尾仍执行现有 `npm test`、lint、typecheck 与 build，确认文档施工没有伴随代码漂移。

### GitHub 备份计划

- GitHub 仓库：`NeilBaumanMax/Catnip-Skill-Hub`
- SSH Remote：`git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`
- 当前分支：`SKill-hub-ui`
- 基线提交：`059ab6a50f5cba20aa756811e36d2ad1afee2c28`
- 备份分支：`backup/pre-skill-hub-ui-plan-20260730-0827`
- 备份 push 状态：待执行

### 回滚预案

- 本轮仅文档提交；如规划需撤销，优先 `git revert <本轮文档提交>`。
- 不使用 reset、clean、force push，不删除旧前端分支。
- 回滚后执行 `git diff --check`，并核对施工文档入口与 HANDOFF。

### 开工门禁更新

- 备份分支 `backup/pre-skill-hub-ui-plan-20260730-0827` 已成功 push 到 origin。
- 首次创建备份分支因受限环境无法写 `.git/refs` 失败；未产生分支。获准后原命令复测成功，并已切回 `SKill-hub-ui`。

## 2026-07-30 08:32 CST / 前端视觉规划 / 完成记录

### 已完成

- 建立 `SKILL_HUB_UI_PLAN.md`，形成 WorkBuddy 信息架构、Marvis 瀑布流节奏与 Catnip 产品边界的合成方案。
- 明确 Design Read、设计参数、借鉴/拒绝清单、首页与详情信息架构、编辑式瀑布流、视觉令牌、动效、响应式、无障碍、性能和四个施工批次。
- 将当前前端分支从旧实验分支修正为 `SKill-hub-ui`，旧分支保持不删除。
- 本轮未修改 `src/`、依赖、数据库、部署或运行环境。

### 验证结果

- `npm test`：45/45 成功。
- `npm run lint`：成功。
- `npm run typecheck`：成功。
- `npm run db:check`：成功。
- `npm run build`：受限环境首次因 Turbopack 无权绑定内部端口失败；获准环境同命令复测成功。
- `git diff --check`：成功。
- 浏览器视觉验收：本轮没有可见代码修改，因此只完成参考截图分析，不把它写成 Catnip 页面视觉通过。

### 当前结论

前端规划轮完成，停在 UI-1 代码施工前。下一轮必须重新执行开工计划与开发前备份，然后只实施视觉令牌和全站骨架；完成 UI-1 后停下汇报。

## 2026-07-30 10:18 CST / SKill-hub-ui / UI-1 开工计划

### 本轮目标

根据 Neil Bauman 的最新深色方向完成 UI-1：建立不依赖紫蓝渐变和 AI 光晕的 Catnip 深色视觉令牌，重构全站基础外壳、顶部导航和首页紧凑引导。完成工程验证和浏览器视觉验收后停下，不进入 UI-2 瀑布流施工。

### 涉及层

- 公共前台层：全站令牌、页面背景、顶部导航、首页引导和基础响应式。
- 详情与推荐页：只接受全局令牌和共享外壳带来的基础变化，不在本轮重排内容结构。
- 施工文档层：记录案例研究、深色方向修订、测试、漂移与交接。

### 当前仓库状态

- 当前分支：`SKill-hub-ui`。
- 当前基线：`7780c645e702f20470305a2c96239516feb443bb`。
- origin：`git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`。
- Git 身份：`Neil·Baumann <2091760192@qq.com>`。
- 未跟踪 `.agents/`、`.codex/`、`skills-lock.json` 保持不修改、不暂存、不提交。

### 计划修改

- 更新 CSS 颜色、字体、间距、圆角、焦点、表面和动效令牌。
- 重构首页与详情页共享的文字品牌表达和顶部导航材质。
- 把首页大型旧引导收敛为紧凑、不居中的编辑式引导。
- 保持搜索、分类、详情、下载、安装、统计和推荐表单逻辑不变。
- 不实现精选推荐、正式编辑式瀑布流、真实品牌资产或新依赖。

### 测试计划

- `npm test`、lint、typecheck、db:check、生产 build、`git diff --check`。
- 浏览器检查首页、一个详情页和推荐页。
- 检查 1440、1024、768、390 视口、键盘焦点、触控目标、对比度和 reduced-motion。

### GitHub 备份计划

- 基线提交：`7780c645e702f20470305a2c96239516feb443bb`
- 备份分支：`backup/pre-skill-hub-ui-1-dark-shell-20260730-1018`
- 备份 push 状态：待执行

### 回滚预案

- 视觉修改与文档收尾形成有意义提交；需要撤销时优先 `git revert <UI-1提交>`。
- 回滚后重跑全部工程门禁并检查首页、详情和推荐页。
- 不删除旧分支、不使用 reset、clean 或 force push。

### 2026-07-30 10:29 CST / UI-1 验证暂停

- 深色令牌、全站公共外壳、顶部导航和首页紧凑引导已实现为未提交工作区改动。
- 45 项测试、lint、typecheck、db:check、生产 build 与三个公开路由 HTTP 200 验证成功。
- 浏览器控制入口没有返回任何可用浏览器，无法执行本轮要求的真实截图、多视口与视觉层级检查；未把 UI-1 标记为完成，未提交或 push 代码。
- 实时预览运行于 `http://192.168.0.109:3000`，等待浏览器入口恢复或 Neil Bauman 提供当前页面截图后继续视觉复核。

### 2026-07-30 / UI-1 色彩修正

- Neil Bauman 反馈首版深色外壳颜色过少、观感奇怪。
- 将单一薄荷强调扩展为有语义的分类色：硬件琥珀、开发鲜绿、前端珊瑚、产品淡紫、自动化青绿；品牌主操作仍保持薄荷色。
- 分类按钮、Skill 卡片信息区、详情页分类强调和推荐入口按语义使用色彩；不增加紫蓝渐变、光晕或随机彩色背景。
- lint、typecheck 与 `git diff --check` 复测成功；继续等待 Neil Bauman 刷新实时预览后的视觉反馈。

### 2026-07-30 16:17 CST / UI-1 蓝调山景与玻璃修正

- Neil Bauman 指定主页改为蓝色基调山峰风景背景，并让瀑布流使用毛玻璃，不再采用深绿色画布。
- 已引入可追溯的 Unsplash 山景为本地静态资源，并在首页页脚及 `public/images/README.md` 保存摄影师、原页面和许可信息。
- 导航、分类控制和瀑布流卡片形成同一环境中的三层玻璃；增加无模糊支持与减少透明度偏好的实色降级。
- lint、typecheck 和 `git diff --check` 成功；开发服务热更新成功，等待 Neil Bauman 在 Edge 刷新后进行真实视觉反馈。
- 全量复测为 unit 45/45、lint、typecheck、db:check 成功；受限构建因端口权限失败后，获准环境同命令复测成功。
- UI-1 仍未提交、未 push，浏览器多视口门禁仍未完成。

### 2026-07-31 / UI-1 标题排版修正计划

- 反馈证据：Neil Bauman 提供 Edge 实机截图；当前标题被右侧窄列挤成四行，视觉重心过度靠右。
- 本轮目标：将标题向左展开到约 75% 的首页内容宽度，稳定为两行；为首页主标题引入自托管中文展示字体，形成艺术性但保持识读。
- 修改边界：只调整首页引导区网格、主标题字体角色、换行和响应式；不修改标题文案、搜索、分类、瀑布流数据、详情页、后端或部署。
- 字体门禁：必须使用许可证可追溯的开源字体，保存许可信息；不得依赖远程字体热链或用户电脑已安装字体。
- 验证计划：字体机械扫描、lint、typecheck、unit、db:check、生产 build、首页 HTTP 和 Edge 实机反馈。
- 备份：继续使用已成功 push 的 UI-1 开发前备份 `backup/pre-skill-hub-ui-1-dark-shell-20260730-1018`；当前 UI-1 尚未形成新提交，不创建无法包含未提交工作的虚假备份。

### 2026-07-31 / UI-1 标题修正执行状态

- 已将宽屏主标题列扩大为内容宽度约 75%，保持两行文案；900px 以下恢复单列。
- 已自托管霞鹜文楷粗体的 4 个标题字符分片，保存 SIL OFL 1.1 和来源说明；字体请求不依赖外部域名。
- unit 45/45、lint、typecheck、db:check、获准生产 build、首页与字体 HTTP 200、`git diff --check` 均成功；受限 build 端口权限失败已保留。
- 当前等待 Edge 视觉反馈，不把工程通过等同于 UI-1 完成。

## 2026-07-31 04:15 CST / SKill-hub-ui / Unsplash 发现框架重构开工计划

### 本轮目标

按 Neil Bauman 最新明确指令，将当前未交付的 UI-1 方向替换为以 Unsplash 内容发现逻辑为参考的 Catnip 首页：左侧功能栏、顶部分类/搜索/标签控制、中部 Skill 瀑布流。保留 Catnip 产品事实、真实筛选、详情、推荐与统计能力，不复制 Unsplash 品牌或扩大用户系统。

### 涉及层

- 公共前台层：首页导航、发现控制、瀑布流卡片与响应式结构。
- 共享视觉层：只调整首页需要的令牌和组件语义；详情与推荐页保持可用，不重构后端。
- 设计治理层：补齐 Impeccable 的产品记录、设计契约与首页表面约束，并修正专项计划漂移。

### 当前仓库状态

- 当前分支：`SKill-hub-ui`；HEAD `7780c645e702f20470305a2c96239516feb443bb`，与 `origin/SKill-hub-ui` 一致。
- SSH 已复验为 `NeilBaumanMax`；origin 为指定 SSH Remote；Git 身份为 `Neil·Baumann <2091760192@qq.com>`。
- 当前跟踪改动和 `public/fonts/`、`public/images/` 均与既有 UI-1 日志一致，属于已知未交付 WIP；`.agents/`、`.codex/`、`skills-lock.json` 是用户工具文件，继续不修改、不暂存。

### 计划修改

- 桌面端建立固定左侧功能栏，承载首页、探索、分类、推荐和关于；移动端折叠为紧凑顶部导航。
- 顶部建立持续可见的分类、搜索和标签控制；第一版不增加普通用户登录，右侧保留推荐 Skill。
- 删除占据首屏的大型山景 Hero，把内容瀑布流提升为首页视觉主角；保留图片来源记录但不强制继续作为背景。
- 重做 Skill 卡片：封面驱动、比例错落、整卡进入详情，文字元数据保持克制，首页无下载或安装。
- 保持 GET 搜索/筛选、空结果、统计、详情路由和推荐表单逻辑不变；不修改数据库、认证、下载、安装、部署或服务器。

### 测试计划

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run db:check`
- `npm run build`
- `git diff --check`
- 首页、`/skills/project-brief`、`/recommend` HTTP 检查；首页 1440、1024、768、390 视口视觉检查。
- 检查键盘顺序、焦点、44px 触控、空结果、reduced-motion、首页无下载/安装与无普通用户登录。

### GitHub 备份计划

- GitHub 仓库：`NeilBaumanMax/Catnip-Skill-Hub`
- SSH Remote：`git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`
- 当前分支：`SKill-hub-ui`
- 基线提交：`7780c645e702f20470305a2c96239516feb443bb`
- 备份分支：`backup/pre-unsplash-discovery-ui-20260731-0415`
- 备份 push 状态：待执行。因当前 WIP 已被施工日志明确识别，本轮将用隔离 Git index 生成只存在于备份分支的快照提交，不改当前 index 或工作区。

### 回滚预案

- 新备份分支完整保存改造前已知 UI-1 WIP；当前分支最终变更如需撤销，优先 `git revert <本轮提交>`。
- 回滚后执行 unit、lint、typecheck、db:check、build、首页/详情/推荐 HTTP 和多视口复测。
- 不使用 reset、clean、restore 或 force push，不暂存用户工具文件。

## 2026-07-31 04:35 CST / SKill-hub-ui / Unsplash 发现框架工程交付

### 当前状态

- 首页已替换为 Catnip 自有的内容发现画廊：84px 左侧功能栏、粘性搜索/分类/标签控制、紧凑介绍和封面驱动瀑布流。
- 搜索、主分类、标签、空结果、详情链接和推荐入口沿用真实数据能力；首页没有普通用户登录、下载或安装按钮。
- 工程、生产构建和局域网 HTTP 门禁完成；可控浏览器列表为空，1440/1024/768/390 自动视觉门禁未完成，本批只能标记为工程交付、视觉待验收。

### 验证摘要

- `npm test`：45/45 成功；lint、typecheck、db:check、获准环境 build、diff check 成功。
- `npm run test:integration`：获准环境正常启动，1 项因 PostgreSQL/S3 环境未配置而跳过，不记为通过。
- 首页、搜索、分类、详情、推荐、山景图片与真实字体路径均为 HTTP 200。
- 受限 build 与 integration 首次权限失败、错误字体探测 URL 的 404 均已在 LOG 保留并完成对应复测。

### 停点

本轮不进入详情页视觉统一、后台界面或服务器部署。Edge 打开当前局域网预览后，由 Neil Bauman 进行真实观感反馈；下一轮只处理该反馈或完成多视口视觉验收。

## 2026-07-31 04:44 CST / SKill-hub-ui / 正式 Logo 与站点命名开工计划

### 本轮目标

接入 Neil Bauman 本轮提供的正式 Catnip 图形作为网页 Logo 和浏览器标签页图标；将浏览器标题统一为 `Catnip Skill Hub`，移除公开界面中“中文 Agent Skill 独立站”“中文传播标题”等定位性表述。

### 涉及层

- 公共前台层：首页、详情页、推荐页的共享品牌入口和公开文案。
- 应用 metadata 层：站点 title、description 与 favicon。
- 品牌资源层：`public/brand` 的正式图片和来源约定。
- 产品与设计文档层：把“仅文字占位”修正为“正式 Logo 已由 Neil Bauman 提供”。

### 当前仓库状态

- 当前分支：`SKill-hub-ui`；HEAD `201b5e4036a464221bd87106f7822645eda9916b`，与 `origin/SKill-hub-ui` 一致。
- SSH 已复验为 `NeilBaumanMax`；origin 为指定 SSH Remote；Git 身份为 `Neil·Baumann <2091760192@qq.com>`。
- 工作区只有 `.agents/`、`.codex/`、`skills-lock.json` 三项已知用户工具文件，本轮继续不修改、不暂存。
- 用户提供图片为 1078 × 1080 RGBA PNG，适合作为正方形品牌图；不重新生成、不改变图形内容。

### 计划修改

- 保存正式 Logo 到稳定公开路径，并使用同一资源生成网页 Logo 与浏览器 icon metadata。
- 建立共享品牌组件，替换首页字母 `C`、详情和推荐页的文字占位图形；保留可访问名称和稳定首页链接。
- 浏览器标签页只显示 `Catnip Skill Hub`；公开副标题改为不含“中文 Agent Skill 独立站”的产品描述。
- 更新 `public/brand/README.md`、PRODUCT、DESIGN 与产品需求的品牌事实；保留中文内容能力，不把品牌定位写成“中文 Skill”。
- 不修改路由、搜索、Skill 数据标题、后台字段、下载、安装、数据库、认证或部署。

### 测试计划

- `npm test`、`npm run lint`、`npm run typecheck`、`npm run db:check`、`npm run build`、`git diff --check`。
- 首页、详情、推荐、Logo 和 favicon HTTP 检查；核对页面 metadata title。
- 检查 Logo 替代文本、尺寸预留、圆角、触控、浅深背景可读性和公开文案扫描。

### GitHub 备份计划

- GitHub 仓库：`NeilBaumanMax/Catnip-Skill-Hub`
- SSH Remote：`git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`
- 当前分支：`SKill-hub-ui`
- 基线提交：`201b5e4036a464221bd87106f7822645eda9916b`
- 备份分支：`backup/pre-brand-logo-20260731-0444`
- 备份 push 状态：待执行

### 回滚预案

- 如需撤销，优先 `git revert <本轮品牌提交>`；开发前状态由远端备份分支保存。
- 回滚后复测 unit、lint、typecheck、db:check、build、三个公开路由、Logo/favicon 和 metadata。
- 不使用 reset、clean、restore 或 force push。

## 2026-07-31 04:53 CST / SKill-hub-ui / 正式 Logo 与站点命名工程完成

### 已完成

- 将 Neil Bauman 提供的 1078 × 1080 RGBA PNG 原样保存为 `public/brand/logo.png`；仓库文件、运行态返回文件与上传原图 SHA-256 均为 `ccce8d284a7323d0353c5939045f6de8be3b656bc4ba87fd21000545b5798f2f`。
- 新建共享 `BrandLogo` 组件，替换首页左栏、顶部文字标识、详情页和推荐页的字母占位。
- 根 metadata title 精确改为 `Catnip Skill Hub`，icon 与 apple-touch-icon 统一使用正式 Logo。
- 公开副标题、页脚和安装说明移除旧语言市场定位与旧标题术语；搜索、数据标题和后台业务不变。
- 品牌资源、产品需求、PRODUCT、DESIGN、专项计划和施工入口已按最新正式品牌事实修正。

### 验证摘要

- `npm test` 45/45、lint、typecheck、db:check、获准环境 build 和 diff check 成功。
- 受限 build 首次因 Turbopack 内部端口权限失败，已记录并在获准环境同命令复测成功。
- 首页、详情、推荐和 Logo 均为 HTTP 200；HTML title、icon、apple-touch-icon 精确匹配；公开禁用表述扫描为空。
- Impeccable 技术审计为 18/20；可控浏览器列表为空，真实标签栏像素和多视口视觉检查仍需 Edge 人工验收。

### GitHub 备份

- 开发前基线：`201b5e4036a464221bd87106f7822645eda9916b`。
- 备份分支：`backup/pre-brand-logo-20260731-0444`，已成功 push 并远端核验。

### 停点

本轮只交付正式品牌资产与站点命名，不进入详情视觉统一、瀑布流再设计、后台或服务器。Git 收尾并打开 Edge 后停下等待 Neil Bauman 视觉确认。
## 2026-07-31 05:04 CST / SKill-hub-ui / 山景玻璃与线性导航开工计划

### 本轮目标

在保留 Unsplash 式发现结构和真实搜索/筛选能力的前提下，恢复蓝调山景环境画布，将左侧功能栏、顶部发现控制和瀑布流信息层改为克制的网页磨砂玻璃；导航只显示与正式 Catnip Logo 线条气质一致的简约线性图标，文字仅在悬停或键盘聚焦时出现。

### 涉及层

- Phase 1 公共前台：首页发现框架、响应式导航、Skill 瀑布流视觉层。
- 品牌表现：只延续正式 Logo 的简约线条气质，不修改或派生 Logo 图形。
- 施工文档：同步当前视觉约束、验证结论与接力状态。

### 当前仓库状态

- 当前分支：`SKill-hub-ui`。
- 基线提交：`133cdfe10d234ec2ce53d59da043d8f7eead0f9e`，与 `origin/SKill-hub-ui` 一致。
- 已知未跟踪用户工具文件：`.agents/`、`.codex/`、`skills-lock.json`；本轮不修改、不暂存。
- GitHub SSH 已验证为 `NeilBaumanMax`，origin 为指定 SSH Remote，远端历史可读。

### 计划修改

- 使用允许的线性图标库替换左栏“首/探/类/荐/介”文字缩写，补齐 hover/focus tooltip 与可访问名称。
- 以 `public/images/catnip-blue-mountain.jpg` 作为固定环境背景，并通过深蓝遮罩保证文字对比。
- 将左栏、顶部栏、筛选控制和卡片信息层收敛为分级玻璃材质，提供无 blur 与减少透明度降级。
- 保持五分类、标签、搜索、推荐入口、瀑布流 DOM 顺序和所有后端边界不变。
- 更新 `DESIGN.md` 与专项 UI 计划，消除“浅色不透明画布”与最新指令之间的文档漂移。

### 测试计划

- `npm test`、`npm run lint`、`npm run typecheck`、`npm run db:check`、`npm run build`、`git diff --check`。
- 首页、详情页、推荐页、山景图片的 HTTP 回归；检查搜索、分类、标签与空结果路径。
- 检查图标 aria-label、tooltip 键盘路径、44px 触控目标、响应式和 reduced-transparency 降级。
- 尝试真实浏览器视觉复核；若浏览器控制仍不可用，明确保留 Edge 人工视觉门禁。

### GitHub 备份计划

- GitHub 仓库：`NeilBaumanMax/Catnip-Skill-Hub`
- SSH Remote：`git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git`
- 当前分支：`SKill-hub-ui`
- 基线提交：`133cdfe10d234ec2ce53d59da043d8f7eead0f9e`
- 备份分支：`backup/pre-glass-icon-navigation-20260731-0504`
- 备份 push 状态：待开工计划提交后创建并核验。

### 回滚预案

- 本轮提交若产生回归，优先使用 `git revert <本轮提交>`，不得 reset、clean 或 force push。
- 回滚后至少复测 unit、lint、typecheck、db:check、build 和首页 HTTP。
- 不删除现有失败前端分支或任何历史备份分支。
