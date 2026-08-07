# Catnip Skill 提交与公网发布说明书

> 适用对象：接手 Catnip Skill Hub 的 Codex、Claude Code 或其他工程 Agent
> 产品负责人和最终发布批准人：Neil Bauman
> 内容主库：`neilbauman666/Catnip-skill-hub-main`
> 网站仓库：`NeilBaumanMax/Catnip-Skill-Hub`
> 最后核对：2026-08-07

本说明书描述一个 Skill 从外部 GitHub 来源进入 Catnip 内容主库、生成不可变 ZIP、出现在网站详情页、提供 Agent 安装命令并最终发布到公网的完整流程。

它是执行手册，不是生产授权。任何服务器写入、Tag 发布、Release 创建或公网切换，仍须满足仓库 `AGENTS.md`、施工文档和 Neil Bauman 最新明确指令。

## 目录

1. [先理解两个仓库](#1-先理解两个仓库)
2. [完成定义](#2-完成定义)
3. [开工与 Git 备份](#3-开工与-git-备份)
4. [审计原始 Skill](#4-审计原始-skill)
5. [整理 Skill 标准目录](#5-整理-skill-标准目录)
6. [录入内容主库 manifest 与图片](#6-录入内容主库-manifest-与图片)
7. [验证内容和构建 ZIP](#7-验证内容和构建-zip)
8. [发布不可变 GitHub Release](#8-发布不可变-github-release)
9. [验证真实下载与 Agent 安装](#9-验证真实下载与-agent-安装)
10. [把 Skill 接入网站](#10-把-skill-接入网站)
11. [运行网站测试和截图验收](#11-运行网站测试和截图验收)
12. [部署生产服务器](#12-部署生产服务器)
13. [公网最终验收](#13-公网最终验收)
14. [施工文档和收尾提交](#14-施工文档和收尾提交)
15. [常见失败与处理](#15-常见失败与处理)
16. [最终检查表](#16-最终检查表)

## 1. 先理解两个仓库

Catnip 采用“内容与网站分离”的结构。

| 仓库 | 本机路径 | 职责 |
| --- | --- | --- |
| 内容主库 | `/Users/neil/Documents/Project/Catnip-skill-hub-main` | 保存可安装 Skill 原目录、作者/许可/来源、目录 manifest、封面、效果图、确定性 ZIP 和 GitHub Release |
| 网站仓库 | `/Users/neil/Documents/Project/Catnip-Skill-Hub` | 保存中文传播内容、详情页数据、网站图片、下载重定向、安装命令、PostgreSQL 种子与生产部署代码 |

不要把它们混成一个仓库：

- 原始可安装文件进入内容主库。
- 网站不在请求时重新打包远程源码，而是下载固定 Release 资产。
- 中文标题不作为安装名；稳定 `slug/originalName` 才是 CLI 标识。
- 内容主库 Release 成功之前，不允许网站声称该 Skill 可下载。

每次开工先分别阅读两个仓库的 `AGENTS.md` 和它列出的文档。路径、分支、生产 SHA 和服务器恢复点可能变化，本说明书中的版本只能作为示例。

## 2. 完成定义

一个 Skill 只有同时满足以下条件才算“已提交到网站”：

1. 原作者、原始 URL、固定 Git Commit 和 License 已核验。
2. 内容主库中存在完整、可安装的 Skill 目录。
3. `SKILL.md`、`agents/openai.yaml`、封面和 manifest 通过验证。
4. 新的 SemVer Tag 生成不可变 ZIP、`SHA256SUMS`、manifest 和构建摘要。
5. 远端 ZIP 真实下载、SHA-256 和解压检查通过。
6. 至少在隔离目录真实安装到一个目标 Agent。
7. 网站中存在完整领域数据、封面、效果图、下载和安装入口。
8. 本地测试、构建和桌面/手机截图通过。
9. 已获服务器写授权时，生产数据库、容器和公网路由完成验收。
10. 两个仓库的施工日志和 HANDOFF 能让下一位 Agent 无聊天记录接力。

只完成其中一部分时，必须明确写成“内容已入库”“Release 待发布”或“网站本地已接入”，不能写成公网完成。

## 3. 开工与 Git 备份

### 3.1 检查工作区

分别在两个仓库执行：

```bash
git status --short --branch
git rev-parse HEAD
git remote -v
git rev-list --left-right --count HEAD...@{upstream}
```

遇到来源不明的修改或未跟踪文件：

- 视为用户资产。
- 不覆盖、不删除、不格式化。
- 不使用 `git add .`。
- 后续只显式暂存本轮文件。
- 如果目标文件本身已有用户修改且无法安全合并，停下请求 Neil Bauman 决定。

### 3.2 写开工计划

先在当前仓库 `docs/construction/DEV_PROGRESS.md` 追加：

- Skill 名称和源仓库。
- 计划导入的具体子目录。
- 作者、许可和再分发风险。
- 计划版本和 Release Tag。
- 需要修改的内容、网站、图片、测试和部署范围。
- 预定备份分支名。

计划提交必须先 push。

### 3.3 创建开发前备份

使用唯一分支名，不切换到备份分支施工：

```bash
git branch backup/pre-add-skill-YYYYMMDD-HHMM HEAD
git push origin backup/pre-add-skill-YYYYMMDD-HHMM
git ls-remote origin refs/heads/backup/pre-add-skill-YYYYMMDD-HHMM
```

只有 `ls-remote` 返回的 SHA 与计划提交一致，才可以修改真实内容。两个仓库都要改时，两个仓库分别建立备份。

## 4. 审计原始 Skill

### 4.1 在隔离目录取得源码

不要直接在目标仓库中试探性 clone。使用临时目录：

```bash
CATNIP_SOURCE_DIR=$(mktemp -d /private/tmp/catnip-skill-source.XXXXXX)
git clone https://github.com/OWNER/REPOSITORY "$CATNIP_SOURCE_DIR/source"
git -C "$CATNIP_SOURCE_DIR/source" rev-parse HEAD
find "$CATNIP_SOURCE_DIR/source" -name SKILL.md -print
```

记录完整的 40 位小写 Commit。网站和内容 manifest 必须固定到该 Commit，不能使用 `main`、`master`、`latest` 或浮动分支作为来源证据。

### 4.2 确定实际导入边界

源仓库可能包含：

- 一个根级 Skill。
- `skills/` 下多个独立 Skill。
- 原生 Skill Pack。
- Skill 依赖的 scripts、references、assets、模板、字体或二进制组件。

只导入 Neil 指定的 Skill，但必须保留该 Skill 运行所需的完整子树。不要为了减小 ZIP 随意删除依赖文件。

如果一个子组件有独立、更严格的许可证，记录它的使用和分发边界。不得把受限组件单独抽取后重新发布。

### 4.3 审计作者和许可证

至少检查：

```bash
rg --files "$CATNIP_SOURCE_DIR/source" | rg '(^|/)(LICENSE|COPYING|NOTICE)(\.|$)|SKILL\.md$|package\.json$'
rg -n "license|copyright|author|proprietary|redistribut" "$CATNIP_SOURCE_DIR/source"
```

必须区分：

- 原作者。
- GitHub 仓库所有者。
- Catnip 整理或镜像发布者。

它们不一定是同一个人。

停工条件：

- 没有许可证，且 Neil 不能确认自己拥有并明确授权公开分发。
- 许可证禁止再分发或要求尚未满足。
- 作者身份或来源无法核验。
- Skill 依赖缺失、只剩文档而无法实际使用。
- 存在需要秘密才能运行、且无法安全移除的配置。

第三方 Skill 不得改写作者后冒充 Catnip 原创。商标或官方身份也不得暗示，例如 Apple 风格内容必须明确“非 Apple 官方”。

### 4.4 检查危险内容

在导入前检查：

- `.env`、Token、密码、SSH 私钥、Cookie 和真实凭据。
- 符号链接、路径逃逸和绝对路径。
- 安装时会自动执行的不明脚本。
- 超大文件和不必要的构建产物。
- 嵌套 Git 仓库或 `.git` 目录。

发现风险先记录和判断，不要静默删除后声称保留了原作。

## 5. 整理 Skill 标准目录

### 5.1 目录位置

单项 Skill 放在内容主库：

```text
content/skills/<skill-slug>/
```

当前首版约束：

- 文件夹名使用小写字母、数字和连字符。
- `slug`、`originalName`、文件夹名和 `SKILL.md` 的 `name` 相同。
- 名称长度和格式应符合 skill-creator 规则。
- 不使用中文标题作为目录名。

### 5.2 标准结构

```text
<skill-slug>/
├── SKILL.md                         # 必须
├── agents/
│   └── openai.yaml                 # Catnip 内容主库要求必须
├── scripts/                        # 可选；可执行的确定性工具
├── references/                     # 可选；按需读取的详细资料
├── assets/                         # 可选；模板、图像、字体等输出资源
└── LICENSE                         # 按来源和许可要求保留
```

如果原作者已有必要的 README、NOTICE 或 manifest，可以原样保留。新建 Catnip Skill 时不要额外堆砌 README、安装手册、快速参考或 CHANGELOG；核心说明放在 `SKILL.md`，详细资料放 `references/`。

不要把以下两个文件写入原 Skill 目录：

- `Catnip-安装说明.md`
- `Catnip-来源信息.json`

Release builder 会把它们自动放到 ZIP 根层。

### 5.3 `SKILL.md` 要求

frontmatter 只能包含 `name` 和 `description`：

```markdown
---
name: example-skill
description: Describe what the skill does and the concrete situations that should trigger it.
---

# Example Skill

Use imperative instructions here.
```

要求：

- `name` 与稳定 slug 完全一致。
- `description` 同时描述能力和触发场景。
- 触发条件放在 description，不要只藏在正文。
- 正文使用祈使式，写 Agent 真正需要执行的知识。
- 控制上下文体积；复杂细节拆到 `references/`。
- 脚本必须实际运行测试，不能只检查文件存在。

### 5.4 `agents/openai.yaml` 要求

示例：

```yaml
interface:
  display_name: "Example Skill"
  short_description: "Do one clear, useful thing."
  default_prompt: "Use $example-skill to complete this task."
```

`default_prompt` 必须引用 `$<skill-slug>`。优先使用当前 `skill-creator` 的 `init_skill.py` 或 `generate_openai_yaml.py` 生成，不手写过期字段。

### 5.5 保留原始字节

第三方文件默认按原字节复制。不要运行全仓格式化器改写它们，也不要为了通过 `git diff --check` 机械删除上游有意义的空白。

如果上游字节触发仓库空白门禁，应对确切文件建立可审计例外，并在 LOG 中说明；不要给整个目录关闭门禁。

## 6. 录入内容主库 manifest 与图片

### 6.1 更新 catalog 版本

编辑：

```text
catalog/manifest.json
```

版本规则：

- PATCH：文案或兼容修正。
- MINOR：新增 Skill 或向后兼容能力。
- MAJOR：目录、manifest 或安装契约不兼容变化。

资源 `version` 与 `catalogVersion` 独立。例如目录发布 `v0.3.0` 可以包含 `example-skill-1.0.0.zip`。

新增 Skill 的 manifest 示例：

```json
{
  "slug": "example-skill",
  "type": "skill",
  "subtype": "single_skill",
  "title": "中文传播标题",
  "originalName": "example-skill",
  "summary": "一句话说明它解决什么问题。",
  "category": "编程开发",
  "tags": ["标签一", "标签二"],
  "author": "真实原作者",
  "license": "真实许可证",
  "version": "1.0.0",
  "sourcePath": "content/skills/example-skill",
  "coverPath": "catalog/covers/example-skill.png",
  "galleryPaths": ["catalog/gallery/example-skill/effect.png"],
  "imageSource": "封面与效果图的真实来源",
  "repositoryUrl": "https://github.com/neilbauman666/Catnip-skill-hub-main",
  "sourceUrl": "https://github.com/OWNER/REPOSITORY/tree/FULL_COMMIT/path/to/example-skill",
  "sourceCommit": "40位小写GitCommit",
  "licensePath": "content/skills/example-skill/LICENSE",
  "downloadEnabled": true
}
```

固定主分类只能从以下值选择：

- `VibeCoding 硬件`
- `编程开发`
- `前端设计`
- `产品与项目管理`
- `自动化`

`sourceUrl` 和 `sourceCommit` 必须同时出现；第三方来源尤其不能省略。

只有在许可明确、内容完整、Neil 允许镜像后，才把 `downloadEnabled` 设为 `true`。

### 6.2 内容主库图片

内容主库使用：

```text
catalog/covers/<skill-slug>.png
catalog/gallery/<skill-slug>/<image-name>.png
```

当前实践：

- 封面为 1254 × 1254 PNG。
- 效果图优先使用真实运行结果或原作者素材。
- 没有合适素材时，使用图像生成工具创建，并记录 `imageSource`。
- 生成图不得伪造产品截图、作者背书、官方 Logo 或未获授权商标。
- 每张图必须人工读图，检查文字乱码、水印、错误界面和视觉瑕疵。

验证器会检查 PNG 文件头；只改扩展名不能通过。

## 7. 验证内容和构建 ZIP

进入内容主库：

```bash
cd /Users/neil/Documents/Project/Catnip-skill-hub-main
```

### 7.1 单 Skill 验证

使用当前 `skill-creator`：

```bash
CATNIP_SKILL_CREATOR=/Users/neil/.codex/skills/.system/skill-creator
python3 "$CATNIP_SKILL_CREATOR/scripts/quick_validate.py" "content/skills/<skill-slug>"
```

如果缺少 PyYAML，在 `/private/tmp` 建隔离虚拟环境，不把临时依赖写进内容仓库。必须记录首次失败、修复和复测。

### 7.2 全仓门禁

按顺序执行：

```bash
python3 scripts/validate_repository.py
python3 scripts/build_release.py --clean
python3 scripts/inspect_release.py
git diff --check
```

预期产物位于被 Git 忽略的 `dist/`：

```text
dist/
├── <slug>-<version>.zip
├── SHA256SUMS
├── manifest.json
└── build-summary.json
```

ZIP 契约：

- 原 Skill 目录位于 `<originalName>/...`。
- 原 `SKILL.md` 字节保持一致。
- Catnip 安装说明和来源 JSON 只在 ZIP 根层。
- 无绝对路径、`..`、反斜杠、重复条目或符号链接。
- ZIP 文件名严格为 `<slug>-<version>.zip`。

### 7.3 确定性复测

至少连续构建两次，并比较 `SHA256SUMS` 和 `build-summary.json`。相同 Commit 的两次 clean build 应一致。

不要提交 `dist/`。Release workflow 会从 Tag 对应 Commit 重建。

## 8. 发布不可变 GitHub Release

### 8.1 提交和 push 内容实现

只暂存本轮内容：

```bash
git add catalog/manifest.json \
  catalog/covers/<skill-slug>.png \
  catalog/gallery/<skill-slug>/ \
  content/skills/<skill-slug>/ \
  scripts/ \
  docs/construction/
git diff --cached --check
git diff --cached --stat
git commit -m "feat: add <skill-slug>"
git push origin main
```

只有确实修改了验证器时才暂存 `scripts/`。始终用 `git status --short` 确认没有把用户文件或秘密带入提交。

### 8.2 等 main CI

`.github/workflows/validate.yml` 会运行：

1. repository validation。
2. 确定性 Release build。
3. ZIP inspect。

必须通过 GitHub Actions 页面、`gh`（若可用）或 GitHub 官方 API 核验对应 head SHA 为 `completed/success`。

### 8.3 创建新 Tag

确认 Tag 不存在，并且名称等于 `v<catalogVersion>`：

```bash
git ls-remote --tags origin "refs/tags/v<CATALOG_VERSION>"
git tag -a "v<CATALOG_VERSION>" -m "Catnip Skill Library v<CATALOG_VERSION>"
git push origin "v<CATALOG_VERSION>"
```

Tag workflow 只有在 Tag 与 manifest 版本完全一致时才发布。

禁止事项：

- 不移动旧 Tag。
- 不覆盖旧 Release。
- 不对失败发布 force push。
- 修复时提高 SemVer，创建新 Tag。

### 8.4 核验 Release

确认：

- workflow 为 `completed/success`。
- Release 不是 draft 或 prerelease，除非 Neil 明确要求。
- 每个 `downloadEnabled: true` 资源有对应 ZIP。
- `SHA256SUMS`、`manifest.json`、`build-summary.json` 都已上传。
- 资产状态为 uploaded。

## 9. 验证真实下载与 Agent 安装

### 9.1 下载并验证 ZIP

不能只检查 API 元数据或网站 307。必须真实下载字节：

```bash
CATNIP_RELEASE_URL="https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v<CATALOG_VERSION>/<skill-slug>-<skill-version>.zip"
CATNIP_RELEASE_FILE="/private/tmp/<skill-slug>-<skill-version>.zip"
curl -fL "$CATNIP_RELEASE_URL" -o "$CATNIP_RELEASE_FILE"
shasum -a 256 "$CATNIP_RELEASE_FILE"
unzip -tq "$CATNIP_RELEASE_FILE"
```

摘要必须与 Release 中的 `SHA256SUMS` 完全一致。

### 9.2 隔离安装

不要直接污染 Neil 的全局 Agent 配置。使用临时项目：

```bash
CATNIP_INSTALL_TEST_DIR=$(mktemp -d /private/tmp/catnip-install-test.XXXXXX)
cd "$CATNIP_INSTALL_TEST_DIR"
npx skills add https://github.com/neilbauman666/Catnip-skill-hub-main \
  --skill <skill-slug> \
  --agent codex \
  --yes \
  --full-depth
test -f ".agents/skills/<skill-slug>/SKILL.md"
```

当前项目安装不加 `--global`；全局命令在最后追加 `--global`。Claude Code 使用 `--agent claude-code`。

大型 Skill clone 较慢不能直接判定失败；等待命令完成并核对目标 `SKILL.md`。

## 10. 把 Skill 接入网站

内容 Release 已验证后，进入网站仓库：

```bash
cd /Users/neil/Documents/Project/Catnip-Skill-Hub
```

### 10.1 增加完整领域数据

编辑：

```text
src/lib/domain/skills/seeds.ts
```

新增 `createSeed({...})` 时至少完整填写：

- `slug`、`title`、`originalName`。
- `summary` 和完整 `description`。
- 固定主分类、标签、封面主题和卡片尺寸。
- 真实作者、作者 URL、来源类型和来源说明。
- 固定 Commit 的 `sourceUrl`。
- 内容主库根 URL 与 `repositoryPath`。
- 精确的 `releaseAssetUrl`。
- 40 位 `sourceCommit`、真实 License 和资源版本。
- 封面与效果图元数据。
- 功能、使用场景、步骤、Prompt 示例、结果、风险和相关 Skill。
- `downloadEnabled: true`、`reviewState: "reviewed"`。
- 推荐权重和是否置顶；不得无判断地把所有资源置顶。

Release URL 格式必须是：

```text
https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v<CATALOG_VERSION>/<slug>-<skill-version>.zip
```

目录 Release 版本与 Skill 版本可以不同，但文件名必须严格匹配 slug 和 Skill 版本。

第三方来源使用 `sourceKind: "third_party"`，并在 `sourceLabel` 说明原作者与 Catnip 的整理关系。

### 10.2 让现有生产数据库收到新 Skill

当前生产 PostgreSQL 不为空时，只会补入：

```text
REQUIRED_PUBLIC_SKILL_SEEDS
```

因此必须在 `src/lib/domain/skills/seeds.ts` 的 `REQUIRED_PUBLIC_SKILL_SLUGS` 中加入新 slug。

`src/lib/data/skills/postgres.ts` 使用 `onConflictDoNothing`：

- 新 slug 会安全插入。
- 已存在 slug 不会被覆盖。
- 如果要更新生产中同 slug 的内容，必须走经审阅的管理员更新或独立迁移，不能把 `onConflictDoNothing` 偷改成全量覆盖。

忘记这一步会出现“本地页面有，生产旧数据库没有”的典型问题。

### 10.3 增加网站图片

放置：

```text
public/skills/<skill-slug>/cover.jpg
public/skills/<skill-slug>/effect.png
```

网站封面建议使用经过压缩的高质量 JPEG，效果图保留 PNG。原因是公网冷加载时，大体积 PNG 封面会拖慢首页和截图。

在 seed 的 `images` 中使用：

```typescript
images: [
  {
    id: "<skill-slug>-cover",
    kind: "cover",
    alt: "准确描述封面内容",
    url: "/skills/<skill-slug>/cover.jpg",
    visualKey: "interface",
    sourceType: "ai_generated",
    sourceLabel: "Catnip AI 生成视觉",
  },
  {
    id: "<skill-slug>-gallery-1",
    kind: "gallery",
    alt: "准确描述效果图内容",
    url: "/skills/<skill-slug>/effect.png",
    visualKey: "system",
    sourceType: "original_author",
    sourceLabel: "原作者效果图",
  },
],
```

`sourceType/sourceLabel` 必须反映真实来源。不要把 AI 图写成原作者截图，也不要把原作者图写成 Catnip 生成。

### 10.4 更新测试

至少覆盖：

- `tests/discovery.test.ts`：中文/英文/作者/标签可搜索，图片、来源、License 和审核状态完整。
- `tests/downloads.test.ts`：精确 Release URL、307、错误域名、latest 和文件名不匹配继续拒绝。
- `tests/install.test.ts`：Codex 与 Claude Code、项目与全局命令包含正确 slug。
- 管理或目录测试：不要硬编码旧资源数量，使用真实目录长度或明确的目标集合。

如果添加的是新页面结构而不只是数据，再增加相应组件和 API 测试。

## 11. 运行网站测试和截图验收

### 11.1 修改前基线截图

修改 `src/app/` 或 `globals.css` 前，按项目 `AGENTS.md` 先截图。没有 dev server 时启动：

```bash
npm run dev -- -H localhost -p 3000
```

然后：

```bash
SCREENSHOT_URL=http://localhost:3000 npx tsx scripts/screenshots.ts
```

不要杀掉 dev server，项目要求保留给下一轮。

### 11.2 工程门禁

代码完成后依次执行：

```bash
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
```

涉及数据库 schema 时额外运行：

```bash
npm run db:check
```

不要把并行运行 build 与 typecheck 造成的 `.next/types` 竞态写成产品缺陷；build 完成后单独复跑 typecheck。

### 11.3 修改后截图和读图

再次运行标准截图，并额外截新详情页的桌面与手机视口。

重点读图：

- 首页桌面 1440 × 900。
- 首页手机 390 × 844。
- 新 Skill 详情桌面。
- 新 Skill 详情手机。

检查：

- 封面是否真实显示，而不是 CSS 占位或优化加载空白。
- 标题、图片、安装命令和版本栏是否重叠。
- 手机端长 License、Commit 和命令是否溢出。
- 效果图是否拉伸、裁切或错配。

注意：当前截图脚本即使某页打印 `✗ 失败`，仍可能退出 0 并打印“完成”。所以不能只看退出码；必须检查输出中是否有失败，并打开 PNG 读图。

标准脚本被 `networkidle` 拖住时，可用同一 Playwright Chromium 显式等待 `main` 再截图，且必须在 LOG 记录这是替代验证。

## 12. 部署生产服务器

### 12.1 授权边界

只有 Neil Bauman 明确要求上线或继续部署时，才执行服务器写操作。

先读当前：

- `docs/deployment/SERVER_DEPLOYMENT.md`
- `docs/construction/HANDOFF.md`
- `docs/construction/progress/layers/07-deployment.md`

不得根据本说明书中的旧 SHA 猜测当前生产状态。

普通 Skill 发布不得顺带修改：

- SSH。
- nginx 管理路径规则。
- UFW 或腾讯云安全组。
- DNS、域名或 HTTPS。
- 管理员密码和生产秘密。
- 旧 `catnip-intro` 工作区。

### 12.2 部署前恢复点

在任何生产写入前：

1. 只读确认 current release、容器、磁盘和监听端口。
2. 建立 PostgreSQL custom dump。
3. 建立 SeaweedFS 只读归档。
4. 写 manifest 和 `SHA256SUMS`。
5. 用 `pg_restore --list`、`tar -tzf` 和 `sha256sum -c` 验证。

不要假设服务器能拉取新的 Docker Hub 辅助镜像；优先使用已存在且已核验的生产镜像执行只读归档。

备份中途失败的目录必须标为失败或补齐后完整复核，不能把只有数据库 dump 的目录称作完整恢复点。

### 12.3 从干净提交构建

生产不能包含本地未提交用户文件。取得网站实现 SHA 后：

```bash
CATNIP_WEB_SHA=$(git rev-parse HEAD)
CATNIP_BUILD_DIR=$(mktemp -d /private/tmp/catnip-web-build.XXXXXX)
git archive "$CATNIP_WEB_SHA" | tar -x -C "$CATNIP_BUILD_DIR"
docker buildx build \
  --platform linux/amd64 \
  --target runner \
  -t "catnip-skill-hub-app:release-${CATNIP_WEB_SHA:0:7}" \
  -t catnip-skill-hub-app:latest \
  --load \
  "$CATNIP_BUILD_DIR"
```

核验镜像为 `linux/amd64`。服务器当前资源较小且历史上无法稳定连接 Docker Hub，默认在本机构建并离线传输。

代码发布归档优先直接使用 `git archive --format=tar.gz`，避免把 macOS 临时目录的 `0700` 权限或 provenance 扩展属性带进 release。

### 12.4 准备和切换 release

部署时必须：

1. 对镜像归档和代码归档计算本地 SHA-256。
2. 上传服务器临时目录后再次校验。
3. 把当前 app 镜像标记为 `rollback-<old-sha>`。
4. 解压到新的 `/opt/catnip-skill-hub/releases/<new-sha>`，不覆盖旧目录。
5. 运行 `docker compose --env-file /etc/catnip-skill-hub/env config --quiet`。
6. 验证新封面和效果图确实存在。
7. 原子替换 `/opt/catnip-skill-hub/current` 软链接。
8. 只重建必要服务；普通网站发布通常是 app 和 Caddy。
9. 命令内准备失败自动恢复旧 symlink 和旧 app 镜像。

环境文件保持服务器仓库外、`root:root 0600`，不得输出、下载或提交。

### 12.5 生产数据库插入

新 app 第一次公开查询会执行缺失 seed 插入。随后只读查询 PostgreSQL，确认新 slug：

- 存在。
- `publish_status = published`。
- `hidden = false`。

不要打印完整 payload 或任何环境秘密。

## 13. 公网最终验收

至少验证：

```text
/
/recommend
/api/health
/skills/<skill-slug>
/skills/<skill-slug>/cover.jpg
/skills/<skill-slug>/effect.png
/api/skills/<skill-slug>/download
/admin
/api/admin/session
```

预期：

- 首页、推荐、健康、详情和图片为 200。
- 健康返回 `postgres-s3`。
- 下载为 307，`Location` 精确指向版本化 Release ZIP。
- 详情 HTML 含 `npx skills add` 和“下载 ZIP”。
- 公网 `/admin` 与 `/api/admin/session` 继续 404。
- PostgreSQL、SeaweedFS、app 和 Caddy healthy。
- app/Caddy 近期日志无新增 error/fatal/panic。
- 宿主仍只开放既定公网端口，Caddy 入口保持 loopback。

最后对生产首页和新详情页执行桌面/手机截图并读图。自动截图通过不等于 Neil Bauman 主观验收。

## 14. 施工文档和收尾提交

两个仓库分别检查文档漂移。

内容主库至少更新：

- `docs/construction/LOG.md`
- `docs/construction/DEV_PROGRESS.md`
- 当前 catalog/release/website integration 进度文件
- `docs/construction/HANDOFF.md`
- 需要时更新 `GITHUB_ROLLBACK.md` 和 `TEST_METRICS.md`

网站仓库至少更新：

- `docs/construction/LOG.md`
- `docs/construction/DEV_PROGRESS.md`
- 当前下载/部署层进度文件
- `docs/construction/HANDOFF.md`
- `docs/deployment/SERVER_DEPLOYMENT.md` 的当前 production SHA 和恢复点

记录必须包含：

- 开工计划和备份分支 SHA。
- 内容实现、网站实现和生产 SHA。
- catalog 版本、资源版本、CI/Release run 和 Release URL。
- 所有首次失败、原因、修复和复测。
- 本地测试、真实下载、真实安装、生产 HTTP、数据库和截图结果。
- 恢复点和回滚方式。
- 未完成的安全或运维风险。

最后只显式暂存本轮文件：

```bash
git diff --check
git status --short
git add path/to/this-turn-file path/to/another-file
git diff --cached --check
git diff --cached --stat
git commit -m "docs: record <skill-slug> rollout"
git push
```

push 后使用 `git ls-remote` 和 GitHub Actions 再核验。远端未成功时不能报告完成。

## 15. 常见失败与处理

### 内容验证器缺 PyYAML

在 `/private/tmp` 建隔离 venv 后复测，不修改系统 Python，不把 venv 加入仓库。

### `git diff --check` 报第三方源文件空白

先确认是否为上游原字节。保留原作时只对确切文件建立可审计例外；不要格式化整个第三方目录。

### Release Tag 与资源版本不同

这是允许的。Tag 对应 `catalogVersion`，ZIP 文件名对应资源 `version`。网站校验要求两者都是 SemVer，但不要求相等。

### 网站本地有 Skill，生产没有

通常是忘记加入 `REQUIRED_PUBLIC_SKILL_SLUGS`，而生产数据库已经非空。补充缺失 seed 插入逻辑和测试，不能直接清空生产数据库。

### Release API 显示资产，但 ZIP 没验证

API uploaded 不等于字节可用。必须 `curl -L` 下载、比对 SHA-256、执行 `unzip -tq`。

### Agent 安装很慢

`--full-depth` 会扫描内容主库；大型 Skill clone 需要时间。等待进程退出并核对安装目录，不要只凭时长判断失败。

### 首页封面在截图里空白

检查 dev server 是否仍缓存旧 seed，再检查 Next 图片优化冷加载。重启开发服务并使用压缩 JPEG 网站封面；不要用等待时间掩盖实际资源 404。

### 截图脚本退出 0 但输出有失败

按输出中的 `✗` 判定失败，不能只看退出码。使用显式 selector 的 Playwright 补验，并在施工日志写清替代方法。

### 生产备份依赖的辅助镜像不存在

不要临时从 Docker Hub拉取并阻塞施工。使用服务器已存在、带 `tar` 的受信镜像完成只读对象归档，再完整验证。

### release 目录无法进入

检查归档是否携带了临时目录 `0700`。切流量前把 release 根恢复为既定 `0755`，重新运行 Compose config 门禁。

## 16. 最终检查表

### 来源与许可

- [ ] 原作者和仓库所有者已区分。
- [ ] 来源固定到 40 位 Commit。
- [ ] License 与嵌套组件边界已核验。
- [ ] Neil 已允许镜像和公开下载。
- [ ] 无秘密、私钥、Token、Cookie 或嵌套 `.git`。

### 内容主库

- [ ] 完整 Skill 目录位于正确 `sourcePath`。
- [ ] `SKILL.md` frontmatter 只有 name/description。
- [ ] `agents/openai.yaml` 的 default prompt 引用 `$slug`。
- [ ] manifest、封面 PNG、效果图和来源说明完整。
- [ ] quick validator 和 repository validator 通过。
- [ ] 两轮 build、ZIP inspect 和确定性摘要通过。
- [ ] main CI 成功。
- [ ] 新 Tag Release 成功且旧 Tag 未移动。
- [ ] ZIP 真实下载、SHA-256、解压和隔离安装通过。

### 网站

- [ ] seed 有完整中文内容、作者、来源、版本、License 和风险。
- [ ] Release URL 的 Tag、slug 和版本文件名精确。
- [ ] 新 slug 已加入生产缺失 seed 集合。
- [ ] 网站 cover.jpg 和 effect.png 存在且读图通过。
- [ ] 搜索、下载、安装与生产 seed 测试已补充。
- [ ] unit、lint、typecheck、build 和 diff check 通过。
- [ ] 修改前后截图和新详情桌面/手机读图通过。

### 生产与交接

- [ ] 服务器写操作有 Neil 的明确授权。
- [ ] 部署前完整恢复点已校验。
- [ ] 从干净提交构建 linux/amd64 镜像。
- [ ] 旧 release、旧镜像和失败自动回滚入口保留。
- [ ] current、容器、数据库、日志、端口和健康通过。
- [ ] 详情/图片 200、下载 307、安装文案存在、管理 404。
- [ ] 两个仓库 LOG、DEV_PROGRESS、进度层和 HANDOFF 已更新。
- [ ] 最终提交、push、远端 SHA 和 CI 已核验。

以上所有与本次目标相关的项目完成后，才可以向 Neil Bauman 报告“Skill 已在公网网站完成发布”。
