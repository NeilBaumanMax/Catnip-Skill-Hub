# 06 Storage and Import 进度

本文件按时间追加存储导入层记录，不覆盖历史。

## 2026-07-27 / 基线

- 状态：未开始。
- 对应路线：Phase 5（文件编号沿既定结构保留）。
- 边界：GitHub 辅助导入、SKILL.md 读取、ZIP/图片与推荐线索。

## 2026-07-28 23:43 CST / Phase 5 / 开工计划

### 当前目标

在不引入数据库或对象存储供应商的前提下，建立安全导入预览、可替换文件端口和独立推荐线索闭环；所有外部输入默认不可信且不得自动发布。

### 计划改动

- 固定 GitHub API 域名、仓库 URL 解析、超时/重定向/大小/数量限制和 Commit 固定。
- SKILL.md 有限字段解析与最多 20 项预览，不执行任何仓库内容。
- ZIP/图片文件端口、进程内适配器、大小/MIME/扩展/魔数/SHA-256 验证。
- 受保护导入/文件 API 与管理面板。
- 公开推荐线索表单、同源检查、蜜罐、字段验证和进程内限流。
- 不自动创建草稿、发布、解压 ZIP、生成图片、接数据库或引入供应商 SDK。

### 验收指标

- 任意非 GitHub 根仓库 URL、重定向、超时、超限响应、截断树和异常 SKILL.md 均被拒绝。
- 导入来源固定到实际 Commit，结果只返回预览且不会改变 Skill Repository。
- 上传只接受受支持图片或 ZIP，文件字节不被修改并记录哈希；匿名管理请求返回 401。
- 推荐线索不创建 Skill 草稿、不公开，且具备基本滥用防护。
- 进程内适配器明确非持久化，供应商存储仍留给后续 Phase。
- npm test、lint、typecheck、build 和 `git diff --check` 全部成功。

## 2026-07-28 23:59 CST / Phase 5 / 完成记录

### 实际完成

- GitHub URL 只接受 HTTPS 仓库根地址；服务端请求固定 `api.github.com`、禁重定向、八秒超时并限制响应大小。
- 以默认分支实际 Commit 固定递归树和 SKILL.md 读取；拒绝截断、5000 条以上树、20 个以上 SKILL.md、256 KB 以上文件和异常文本。
- 导入只返回名称、描述、路径、来源、Commit 与 License 预览，明确不建稿、不发布、不执行仓库内容。
- 建立 ZIP/图片存储端口、进程内适配器、格式/大小/魔数/SHA-256 验证和管理员文件 API/面板。
- 建立推荐表单、公开线索 API、同源/蜜罐/限流与管理员只读列表；线索不进入 Skill Repository。

### 验收结果

- 导入、存储、推荐及匿名管理边界均有真实单元测试。
- lint、typecheck 与 `git diff --check` 首轮成功；生产构建在沙箱首次受端口权限阻塞，授权环境同命令复测成功。
- 文件、线索、CMS 和限流均明确为进程内非持久化；没有引入数据库、对象存储 SDK、搜索或统计。
- 最终 34/34 单元测试、lint、typecheck、生产构建和 `git diff --check` 全部成功；Git push 状态见同轮 LOG 与 HANDOFF 最新记录。

## 2026-07-31 16:58 CST / Phase 5 运维扩展 / 独立 Skill 主库开工计划

### 当前目标

将 `neilbauman666/Catnip-skill-hub-main` 跑通为独立、空白起步的 Skill 内容主库，不替换网站代码仓库，不把现有网站历史推入新仓库。

### 计划改动

- 以 `NeilBaumanMax` 协作者 SSH 身份验证新仓库读写。
- 对空仓库执行最小 README/ignore Bootstrap 并推送 `main`。
- 在 `/Users/neil/Documents/Project/Catnip-skill-hub-main` 建立独立本地副本。
- 本轮只建立连接与 Git 基线，不提前实现目录规范、CI、Release 或网站下载适配。

### 验收指标

- 新仓库 `main` 只有独立 Bootstrap 历史，不包含网站代码提交。
- SSH push 成功，远端 main、HEAD、origin 和本地副本一致。
- 网站代码仓库 origin、分支和已有用户改动不受影响。
- 无密钥、Token、密码、`.env` 或生成文件进入新仓库。
