# Catnip Skill Hub Agent 入口

## 项目身份

- 产品：Catnip Skill Hub，Catnip 薄荷猫 Agent Skill 独立站
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

Phase 3：Download and Install 已完成，包含独立安装命令层、只读 ZIP 下载层、下载 API、详情页操作面板、真实 Catnip 原创 Skill 夹具和单元测试。当前必须停下并向 Neil Bauman 汇报；只有收到下一次明确继续指令后，才可进入 Phase 4，且仍需先执行开工计划和开发前备份。

## 禁止事项

- 不覆盖、删除、回滚或擅自提交来源不明的用户改动。
- 不使用 force push、`git reset --hard`、`git clean -fd/-fx` 或破坏性恢复命令。
- 不提交密钥、Token、密码、SSH 私钥、真实凭据、`.env`、构建产物或依赖目录。
- 不使用其他姓名替代 Neil Bauman 作为管理员、负责人或产品所有者。
- 不伪造测试、远端备份、push 或完成状态。
- 未收到 Neil Bauman 的下一次明确继续指令前，不开始 Phase 4 或后续功能。
