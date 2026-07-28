# 架构说明

## 技术基线

当前技术基线为 Next.js 16.2.12 App Router、React 19.2.4、TypeScript、Tailwind CSS 4、ESLint 9 与 npm。应用采用 `src/` 目录，公开路由位于 `src/app`；当前只包含最小占位首页，不接数据库或外部服务。

后续目标技术包括 PostgreSQL、Drizzle ORM、Docker Compose、可替换的 S3 兼容存储和仅管理员认证；这些不属于 Phase 0 依赖。

## 目录与职责

- `src/app`：公共前台和未来管理端的路由组合、页面展示与交互。公共功能包括首页、分类、搜索、详情和推荐表单；管理端包括登录、资源 CRUD、状态、分类标签、文件图片和推荐线索。
- `src/lib/domain/skills`：Skill、Pack、子 Skill、资源类型、发布状态、分类标签、作者来源、版本和下载权限等纯领域规则。
- `src/lib/install`：两个 CLI、安装范围、参数验证和安装源选择。
- `src/lib/downloads`：ZIP 元数据、打包、Catnip 外层说明、下载授权和事件。
- `src/lib/storage`：本地开发与对象存储的统一文件接口及供应商适配。
- `src/lib/data`：数据库访问、Repository、查询和事务边界。
- `src/lib/auth`：管理员认证、会话和权限；不包含普通用户认证。
- `public/brand`：可替换 Logo、吉祥物、社交分享图及约定。

Phase 0 只创建最小 `src/app` 目录；其余领域和基础设施路径在对应 Phase 出现真实职责时创建，不预建空目录。

## 服务边界

页面通过用例/服务读取或发起动作；领域规则不依赖框架；数据、存储、下载、安装与认证以接口隔离外部实现。ZIP 打包、命令生成、持久化和授权不可藏在 UI 事件处理器中。

## 数据演进边界

资源模型首版支持 Skill 和 Skill Pack，并可表达单项、原生包、编辑包、父子关系、子项独立页面开关、单一主分类、多标签、草稿到发布状态、来源与版本、图片来源、下载开关、推荐池/权重/置顶/隐藏及低优先级统计字段。未来资源类型通过明确枚举扩展，首版前台不暴露未来类型。

## Phase 0 事实

- 已有最小应用、package.json、package-lock.json 和基础构建配置。
- 无数据库、ORM、认证、对象存储、搜索、ZIP、GitHub SDK、统计 SDK 或复杂状态库。
- 无正式品牌图像；首页使用文字品牌，`public/brand/README.md` 保留未来资源约定。
- 环境文件只有无真实值的 `.env.example`。
