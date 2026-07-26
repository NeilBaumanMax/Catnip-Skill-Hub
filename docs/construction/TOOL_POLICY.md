# 工具与依赖策略

- 包管理器由锁文件决定；当前尚无应用和锁文件。收到继续指令且仍无既有锁文件时默认 npm，之后禁止混用 pnpm、yarn 或 bun。
- 依赖版本以官方脚手架和实际安装结果为准；新增前核对当前 Phase、必要性、许可证与维护风险。
- Phase 0 禁止 PostgreSQL、Drizzle、认证、对象存储 SDK、搜索引擎、shadcn/ui、图片上传、ZIP、GitHub API SDK、复杂状态和统计 SDK。
- 外部 CLI 的命令格式必须在实现 Phase 实际查看帮助；安装命令 Phase 3 前执行 `npx skills --help` 与 `npx skills add --help`。
- 不运行来源不明脚本，不打印环境密钥或 SSH 私钥；命令输出写日志时先确认无凭据。
- 修改文件使用可审阅方式；Git 暂存明确列出文件。不得用破坏性 Git 命令或 force push。
- 长跑进程应可控并在收尾停止。网络、安装、推送与权限操作遵守 Codex CLI 授权门禁。
