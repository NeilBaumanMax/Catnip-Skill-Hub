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

Phase 0 至 Phase 7、本地/局域网里程碑、首次腾讯云公网部署与无域名管理员私网入口均已完成。公共入口为 `http://118.195.247.102`；公网 nginx 对 `/admin` 与 `/api/admin` 返回 404，管理员只能从 Neil 的 Mac 经 SSH 隧道访问 `http://localhost:18443/admin/login`。生产环境只保存 scrypt 哈希，随机密码保存在 macOS 钥匙串 `Catnip Skill Hub Admin`；不得打印、提交或复制到服务器日志。当前分支为 `deployment/tencent-cloud-ubuntu-22-04-prep`，服务器发布提交为 `a578bca`；`main` 继续是公共开发基线。后续默认维护现状，不擅自开放公网管理路径、修改 SSH/防火墙/安全组、删除旧 `catnip-intro` 或执行新生产切换。

## 禁止事项

- 不覆盖、删除、回滚或擅自提交来源不明的用户改动。
- 不使用 force push、`git reset --hard`、`git clean -fd/-fx` 或破坏性恢复命令。
- 不提交密钥、Token、密码、SSH 私钥、真实凭据、`.env`、构建产物或依赖目录。
- 不使用其他姓名替代 Neil Bauman 作为管理员、负责人或产品所有者。
- 不伪造测试、远端备份、push 或完成状态。
- 不在普通前端优化工作流中擅自修改生产 Docker、nginx、DNS、HTTPS、防火墙、安全组或生产秘密。
- 不删除或修改目标服务器上保留的旧 `catnip-intro` 工作区、未提交文件和上传内容；旧进程已按 Neil Bauman 的明确授权停止。
