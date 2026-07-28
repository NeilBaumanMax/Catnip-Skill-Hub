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

## 产品和 Phase 边界

- Skill 是产品主角，案例仅为详情页辅助内容。
- Phase 0 已完成：仓库、施工文档、产品/架构边界、品牌占位约定和最小可构建应用均已建立。
- Phase 0 不实现正式瀑布流、详情、搜索、下载、安装命令、后台、数据库、认证、导入、统计、正式 Logo 或吉祥物，也不引入复杂 UI/数据依赖。
- Phase 1 已完成：静态公共首页、文字品牌、五类目胶囊、静态 Skill 卡片瀑布流、基础导航和响应式已建立；展示数据仍是明确占位，不是正式领域数据。
- Phase 1 不实现真实搜索、筛选、随机算法、详情页、下载、安装命令、后台、数据库、认证、导入、统计、正式 Logo 或吉祥物。
- 当前暂停点位于 Phase 1 与 Phase 2 之间；收到 Neil Bauman 下一次明确继续指令后，仍需先执行新一轮开工计划和远端备份门禁。
