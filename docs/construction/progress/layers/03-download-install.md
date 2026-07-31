# 03 Download and Install 进度

本文件按时间追加下载与安装层记录，不覆盖历史。

## 2026-07-27 / 基线

- 状态：未开始。
- 对应路线：Phase 3。
- 边界：ZIP 外层文件和经真实 CLI 帮助核验的安装命令。

## 2026-07-28 22:22 CST / Phase 3 / 开工计划

### 当前目标

在不让 UI 直接处理 ZIP 或拼接命令的前提下，完成可测试的下载与安装服务，并让至少一个具备真实文件、License、仓库路径和管理员授权的 Catnip 原创 Skill 可用。

### 计划改动

- 实际核验 `npx skills --help` 和 `npx skills add --help`。
- 建立一个经 Skill 创建规范验证的 `project-brief` 原创夹具。
- 建立 ZIP 归档、Catnip 安装说明和来源 JSON 服务。
- 建立下载 API 的授权、slug 和路径安全门禁。
- 建立两个 Agent × 两个范围的命令生成服务和详情页安装面板。
- 建立下载与安装单元测试，不引入数据库、对象存储或管理员系统。

### 验收指标

- 原 Skill 文件夹在 ZIP 内保持原样，Catnip 文件只在 ZIP 外层。
- 未授权资源、未知 slug 和目录逃逸全部被拒绝。
- 安装命令来自实际 CLI 参数，使用原始仓库和稳定 Skill 名称，不依赖中文标题。
- 四种命令组合都有测试，ZIP 结构和原文件字节一致有测试。
- 只有具有真实文件和明确管理员授权的资源开放下载；不自动按 License 作决定。
- npm test、lint、typecheck、build 与 `git diff --check` 全部成功。

## 2026-07-28 22:39 CST / Phase 3 / 完成记录

### 实际完成

- `src/lib/install` 生成并校验 Claude Code CLI/Codex CLI 的项目级与全局安装命令。
- `src/lib/downloads` 只读打包 `content/skills`，保持原文件字节不变，并只在 ZIP 外层增加 Catnip 文件。
- 下载 API 处理不存在、未授权和无效来源；详情页操作组件只消费服务结果。
- `content/skills/project-brief` 经官方 Skill 初始化和校验脚本验证，具备 MIT License、版本、仓库路径和显式下载授权。
- 7 项单元测试覆盖四种命令、中文标题隔离、参数拒绝、授权拒绝、路径逃逸和 ZIP 内容。

### 验收结果

- skills CLI 版本和参数已真实核验；Codex/Claude Code 项目级安装均在隔离目录成功。
- npm test、lint、typecheck、build 与 `git diff --check` 最终全部通过。
- 初次 Skill 校验环境缺少 PyYAML，隔离修复后通过；初次 build 的文件追踪警告经路径收敛后消除。
- 未进入后台、认证、数据库、对象存储、导入、搜索或统计范围。

### 下一状态

Phase 3 完成并暂停。下一轮只有在 Neil Bauman 明确继续后，才能按完整门禁进入 Phase 4 Admin CMS。

## 2026-07-31 18:26 CST / Phase 3 运维扩展 / GitHub Release 下载集成开工计划

### 当前目标

让公开下载从网站服务器本地打包扩展为“受信不可变 Release 优先、本地归档兼容”，降低服务器大量保存 Skill ZIP 的需求。

### 计划改动

- 来源模型增加可选 Release 资产 URL。
- 独立下载服务验证固定 owner/repo、Tag、slug、版本和 ZIP 文件名。
- API 对 Release 返回临时重定向，本地资源继续现有归档。
- `project-brief` 种子指向新主库真实 `v0.1.0`；补齐管理员录入和测试。

### 验收指标

- 任意域名、非 HTTPS、latest、分支 URL、错误 slug/版本或非 ZIP 均被拒绝。
- 页面组件不拼下载 URL；下载服务不修改原 Skill；管理员关闭下载仍优先拒绝。
- Release 重定向和本地 ZIP 兼容路径均有自动化验证。
- unit、lint、typecheck、db:check、build 与 diff check 全部成功。
