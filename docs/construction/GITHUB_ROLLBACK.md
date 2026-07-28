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

## 历史安全

远端领先、分叉或无共同历史时停止分析；不盲目 push、合并不相关历史或 force push。不用 reset/clean/restore 解决分歧，不覆盖用户改动。

## 回滚策略

单个错误提交优先 `git revert <bad-commit>`；连续错误提交可在审阅范围后使用 `git revert <oldest-bad-commit>^..<newest-bad-commit>`。回滚提交后执行对应 Phase 的全量验证并正常 push。

当前文档基线回滚后最低复测：`git diff --check`、docs 结构检查和代码暂停检查。应用脚手架建立后，Phase 0 至 Phase 2 回滚最低复测再增加 `npm run lint`、`npm run typecheck`、`npm run build`；Phase 2 还需核对领域目录约束和静态详情路由。Phase 3 回滚还必须执行 `npm test`，并核对下载授权、路径安全、ZIP 原文件一致和四种安装命令。每轮 LOG 必须写是否需要回滚、目标、推荐命令及复测命令。

## 失败现场

确需保存不可用现场时使用 `wip/failing-<phase>-<yyyymmdd-hhmm>`，明确标为不可用且不得合并 main。失败 main push 时保留本地提交、记录错误并报告，不 force push。
