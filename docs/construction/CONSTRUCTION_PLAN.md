# 总体施工计划

任何 Phase 开始前均需完成文档读取、Git 安全检查、开工记录和远端开发前备份；结束时完成验证、漂移检查、交接、提交与 push。

## Phase 0：Foundation（已完成）

SSH 与 Git 基线、施工文档、产品和架构边界、品牌资源约定，以及最小 Next.js、TypeScript、Tailwind CSS、ESLint 脚手架和 lint/typecheck/build 门禁均已完成。

## Phase 1：Public Web（已完成）

公共页面外壳、文字品牌占位、五类目胶囊、十张静态 Skill 卡片瀑布流、基础导航、CSS 封面和响应式均已完成；未接数据库。

## Phase 2：Skill Domain（已完成）

纯 TypeScript 领域模型、Pack 和子项关系、十条原创演示种子、十个静态详情页、CSS 图片集、功能、场景、用法、效果、风险和相关 Skill 均已完成。

## Phase 3：Download and Install（已完成）

ZIP 与 Catnip 外层说明、下载授权与路径安全、下载 API，以及经真实 CLI 核验的 Claude Code CLI/Codex CLI 项目级和全局安装命令均已完成并有单元测试。

## Phase 4：Admin CMS（已完成）

环境配置的预创建管理员认证、草稿/发布/下架、资源 CRUD、分类标签管理和受保护管理界面已完成；不增加普通用户认证。当前以可替换的进程内 Repository 验证闭环，不误报为持久化 CMS。

## Phase 5：Storage and Import（已完成）

GitHub 辅助导入、SKILL.md 信息读取、ZIP 和图片管理、推荐 Skill 线索表单已完成。导入仅生成固定 Commit 的受限预览，文件与线索使用可替换的进程内开发适配器；不误报为数据库、对象存储或自动发布。当前停在 Phase 5 与 Phase 6 之间，等待 Neil Bauman 下一次明确继续指令。

## Phase 6：Search and Discovery

搜索、分类/标签筛选、随机推荐、阅读量和基础统计。

## Phase 7：Deployment

PostgreSQL、Drizzle、迁移、Docker Compose、对象存储、反向代理、HTTPS、备份、安全与部署验收。

## 层文件映射说明

层进度文件名沿既定结构保留：`05-search-discovery.md` 跟踪 Search/Discovery（路线 Phase 6），`06-storage-import.md` 跟踪 Storage/Import（路线 Phase 5）。阶段编号以本计划标题为准。
