# GitHub 备份与回滚

## 固定仓库

- 仓库：NeilBaumanMax/Catnip-Skill-Hub
- origin：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git
- SSH 身份：必须从认证输出确认 NeilBaumanMax，不能只看退出码。

## 开发前备份

从干净且历史明确的开发基线创建 `backup/pre-<phase>-<topic>-<yyyymmdd-hhmm>`，push 成功并用远端引用核验后切回开发分支。不得复用分支名、在备份分支常规开发，或把仅本地分支称为 GitHub 备份。

Phase 0 基线：`533818fec7a8f2f3a4906183f92e58906d9e4792`；远端备份：`backup/pre-phase0-foundation-20260727-0456`。

Phase 0 应用脚手架施工前 docs-only 基线：`594639767d947e93de0a1556f9d640b7c9510f6f`；远端备份：`backup/pre-phase0-app-scaffold-20260728-1832`。

Phase 1 Public Web 施工前基线：`8d7f2d0b4abe330bea44783b4bc69e50c2676a5b`；远端备份：`backup/pre-phase1-public-web-20260728-1853`。

Phase 2 Skill Domain 施工前基线：`37d463ebe4b48ca1fd2d37f5e4b87c8d56e73996`；远端备份：`backup/pre-phase2-skill-domain-20260728-1942`。

Phase 3 Download and Install 施工前基线：`72cfd8cd954c2c044f10c93b454f4149be9dead7`；远端备份：`backup/pre-phase3-download-install-20260728-2222`。

Phase 4 Admin CMS 施工前基线：`c0ccd193c9a343cf101e5fe559251157d260bcad`；远端备份：`backup/pre-phase4-admin-cms-20260728-2307`。

Phase 5 Storage and Import 施工前基线：`ca257f9fbf34e6c94091cfc7db603eb5623c889f`；远端备份：`backup/pre-phase5-storage-import-20260728-2343`。

Phase 6 Search and Discovery 施工前基线：`0962395111eb58abce18d2b71620b388472ec4bf`；远端备份：`backup/pre-phase6-search-discovery-20260729-0018`。

Phase 7 本地部署施工前基线：`c8c593ee04bb7e7f1062eb3d702b78a89b7b1ee9`；远端备份：`backup/pre-phase7-local-deployment-20260729-0913`，已 push 并远端核验。

## 历史安全

远端领先、分叉或无共同历史时停止分析；不盲目 push、合并不相关历史或 force push。不用 reset/clean/restore 解决分歧，不覆盖用户改动。

## 回滚策略

单个错误提交优先 `git revert <bad-commit>`；连续错误提交可在审阅范围后使用 `git revert <oldest-bad-commit>^..<newest-bad-commit>`。回滚提交后执行对应 Phase 的全量验证并正常 push。

当前文档基线回滚后最低复测：`git diff --check`、docs 结构检查和代码暂停检查。应用脚手架建立后，Phase 0 至 Phase 2 回滚最低复测再增加 `npm run lint`、`npm run typecheck`、`npm run build`；Phase 2 还需核对领域目录约束和静态详情路由。Phase 3 回滚还必须执行 `npm test`，并核对下载授权、路径安全、ZIP 原文件一致和四种安装命令。Phase 4 回滚必须再核对认证配置安全失败、会话验证、匿名 API 拒绝、草稿优先状态机和 Repository 隔离。Phase 5 回滚还必须核对 GitHub 固定来源/Commit、导入不写 Skill、文件魔数/大小/哈希、匿名管理拒绝和推荐线索隔离。Phase 6 回滚还必须核对搜索组合、治理字段推荐排序、事件白名单、未知资源拒绝和计数 Repository 隔离。Phase 7 本地部署回滚还必须执行 `npm run db:check`、Compose 配置、迁移、集成测试和本地健康检查；代码回滚不等同于数据回滚，生产式数据优先向前修复，确需恢复时只使用已核验备份并先在隔离目标演练。每轮 LOG 必须写是否需要回滚、目标、推荐命令及复测命令。

## 失败现场

确需保存不可用现场时使用 `wip/failing-<phase>-<yyyymmdd-hhmm>`，明确标为不可用且不得合并 main。失败 main push 时保留本地提交、记录错误并报告，不 force push。
