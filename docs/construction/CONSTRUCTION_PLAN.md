# 总体施工计划

任何 Phase 开始前均需完成文档读取、Git 安全检查、开工记录和远端开发前备份；结束时完成验证、漂移检查、交接、提交与 push。

## Phase 0：Foundation（已完成）

SSH 与 Git 基线、施工文档、产品和架构边界、品牌资源约定，以及最小 Next.js、TypeScript、Tailwind CSS、ESLint 脚手架和 lint/typecheck/build 门禁均已完成。

## Phase 1：Public Web（已完成）

公共页面外壳、文字品牌、正式工具栏 Logo、五类目胶囊、Skill 卡片瀑布流、基础导航、CSS 封面和响应式均已完成；后续 Phase 已接入真实领域、搜索与持久化能力。

## Phase 2：Skill Domain（已完成）

纯 TypeScript 领域模型、Pack 和子项关系、十条原创演示种子、十个静态详情页、CSS 图片集、功能、场景、用法、效果、风险和相关 Skill 均已完成。

## Phase 3：Download and Install（已完成）

ZIP 与 Catnip 外层说明、下载授权与路径安全、下载 API，以及经真实 CLI 核验的 Claude Code CLI/Codex CLI 项目级和全局安装命令均已完成并有单元测试。

## Phase 4：Admin CMS（已完成）

环境配置的预创建管理员认证、草稿/发布/下架、资源 CRUD、分类标签管理和受保护管理界面已完成；不增加普通用户认证。当前以可替换的进程内 Repository 验证闭环，不误报为持久化 CMS。

## Phase 5：Storage and Import（已完成）

GitHub 辅助导入、SKILL.md 信息读取、ZIP 和图片管理、推荐 Skill 线索表单已完成。导入仅生成固定 Commit 的受限预览，不自动发布；后续 Phase 7 已为生产形态建立 PostgreSQL 与 S3 兼容适配器，本段不再代表当前停点。

## Phase 6：Search and Discovery（已完成）

公开搜索、分类/标签组合筛选、受推荐池/权重/置顶治理的随机展示，以及阅读、下载点击、安装复制和来源跳转四类统计已完成；Phase 7 已把计数接入 PostgreSQL，但仍不误报为唯一访客或抗机器人分析。

## Phase 7：Deployment（本地与局域网里程碑已完成，服务器部署已暂缓）

本地已完成 PostgreSQL、Drizzle 迁移、Docker Compose、SeaweedFS S3、Caddy 反向代理、备份恢复、安全与重启持久化验收；局域网入口以显式 RFC1918 地址开放，并完成危险地址拒绝、Caddy 就绪等待和回环回滚。目标服务器已经只读评估，但因无云快照、既有站点恢复链脆弱、生产依赖高危漏洞和 amd64 适配未完成，Neil Bauman 已决定暂停服务器部署。

当前统一在 `main` 按 `SKILL_HUB_UI_PLAN.md` 承接后续明确开发任务；`UI_fix` 已于 2026-08-03 快进推广，`SKill-hub-ui` 与 `frontend/visual-optimization` 只保留历史。每个 UI 批次均需完整闭环并停下汇报，本地预览优先使用 `http://127.0.0.1:3000`，局域网地址必须按当时真实 RFC1918 地址重新核验。未来服务器施工仍属于 Phase 7，必须重新开工并依次完成依赖修复、多架构验证、云快照或明确批准的替代回滚、既有站点异机备份、资源与服务托管加固、隔离部署、旧站回归和新站验收。

## 层文件映射说明

层进度文件名沿既定结构保留：`05-search-discovery.md` 跟踪 Search/Discovery（路线 Phase 6），`06-storage-import.md` 跟踪 Storage/Import（路线 Phase 5）。阶段编号以本计划标题为准。
