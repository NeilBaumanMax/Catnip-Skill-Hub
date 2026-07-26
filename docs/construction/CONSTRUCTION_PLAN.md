# 总体施工计划

任何 Phase 开始前均需完成文档读取、Git 安全检查、开工记录和远端开发前备份；结束时完成验证、漂移检查、交接、提交与 push。

## Phase 0：Foundation（当前）

SSH 与 Git 基线、施工文档、产品和架构边界、最小 Next.js TypeScript/Tailwind/ESLint 脚手架，以及 lint、typecheck、build。禁止实现后续业务。

## Phase 1：Public Web

公共页面外壳、文字品牌占位、分类胶囊、静态 Skill 卡片瀑布流、导航和响应式；不接数据库。

## Phase 2：Skill Domain

领域模型、Pack 和子项关系、详情页、静态种子数据、图片集、功能和场景。

## Phase 3：Download and Install

ZIP 与 Catnip 外层说明；真实核验后生成 Claude Code CLI/Codex CLI 的项目级和全局安装命令，并测试。

## Phase 4：Admin CMS

预创建管理员认证、草稿/发布/下架、资源 CRUD、分类标签管理；不增加普通用户认证。

## Phase 5：Storage and Import

GitHub 辅助导入、SKILL.md 信息读取、ZIP 和图片管理、推荐 Skill 线索表单。

## Phase 6：Search and Discovery

搜索、分类/标签筛选、随机推荐、阅读量和基础统计。

## Phase 7：Deployment

PostgreSQL、Drizzle、迁移、Docker Compose、对象存储、反向代理、HTTPS、备份、安全与部署验收。

## 层文件映射说明

层进度文件名沿既定结构保留：`05-search-discovery.md` 跟踪 Search/Discovery（路线 Phase 6），`06-storage-import.md` 跟踪 Storage/Import（路线 Phase 5）。阶段编号以本计划标题为准。
