# Catnip Skill Hub Agent 入口

## 项目身份

- 产品：Catnip Skill Hub，Catnip 薄荷猫 Agent Skill 发现站
- 项目负责人和管理员：Neil Bauman
- GitHub：NeilBaumanMax/Catnip-Skill-Hub
- SSH Remote：git@github.com:NeilBaumanMax/Catnip-Skill-Hub.git

## 最高优先级

Neil Bauman 最新明确指令 > `docs/construction/CODEX_MASTER_REQUIREMENTS.md` > `docs/product/PRODUCT_REQUIREMENTS.md` > 其他施工文档 > 旧代码 > Agent 偏好。

## 必读顺序

1. 本文件
2. `docs/construction/CODEX_MASTER_REQUIREMENTS.md`
3. `docs/product/PRODUCT_REQUIREMENTS.md`
4. `docs/construction/DEV_PROGRESS.md`
5. `docs/construction/LOG.md`
6. `docs/construction/GITHUB_ROLLBACK.md`
7. `docs/construction/TEST_METRICS.md`
8. `docs/construction/WORKFLOW.md`
9. 当前 Phase 对应层进度文件
10. `docs/construction/HANDOFF.md`

## 开工和收尾硬规则

- 先检查 Git 与用户改动，写本轮及当前层开工计划，并成功 push 开发前备份，再改真实代码。
- 失败测试必须记录、修复和复测；通过后必须检查文档漂移。
- 收尾更新 LOG、DEV_PROGRESS、当前层进度和 HANDOFF，提交并成功 push 后才可报告完成。
- 追加式文档保留历史；下一次 Codex 必须无需聊天记录即可接力。

## 当前 Phase

Phase 0 至 Phase 7 的功能与本地/局域网里程碑均已完成；服务器只读评估已记录，但 Neil Bauman 已明确暂停服务器部署。当前开发分支为 `UI_fix`，最新公共前台实现提交为 `6b0b786ce09d72f0cd57fea10a0f4240c8c58b12`，已完成顶部 Logo 去重、单层毛玻璃 header、分类单选和标签下拉多选；当前停点是等待 Neil Bauman 验收或给出下一条明确 UI 指令。`main`、`SKill-hub-ui`、`frontend/visual-optimization` 与 `backend-server-deployment` 均保留但不是当前分支。没有新的部署指令和重新完成服务器门禁前，不得恢复服务器写操作。

## 禁止事项

- 不覆盖、删除、回滚或擅自提交来源不明的用户改动。
- 不使用 force push、`git reset --hard`、`git clean -fd/-fx` 或破坏性恢复命令。
- 不提交密钥、Token、密码、SSH 私钥、真实凭据、`.env`、构建产物或依赖目录。
- 不使用其他姓名替代 Neil Bauman 作为管理员、负责人或产品所有者。
- 不伪造测试、远端备份、push 或完成状态。
- 不在当前前端优化工作流中执行服务器 Docker 安装、nginx 修改、公网部署、DNS、HTTPS、防火墙或生产秘密配置。
- 不触碰目标服务器上的既有 `catnip-intro` 工作区、未提交文件、上传内容或现有进程。
