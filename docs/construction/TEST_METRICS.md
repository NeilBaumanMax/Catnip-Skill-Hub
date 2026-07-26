# 测试指标

## 当前文档基线门禁

| 命令/检查 | 成功标准 |
| --- | --- |
| `git diff --check` | 退出码 0，无空白错误或冲突标记 |
| docs 结构检查 | AGENTS、产品需求、全部施工规范与层进度文件存在 |
| 代码暂停检查 | 不存在 `src/app`、package.json、锁文件或构建配置 |
| 身份与远端检查 | Neil Bauman、NeilBaumanMax、Catnip 薄荷猫和指定 SSH Remote 一致 |

当前没有 package.json 或代码，因此 lint、typecheck、build 和 test 均不可执行；不得写成通过。

## Phase 0 应用脚手架门禁（收到继续指令后）

| 命令 | 成功标准 |
| --- | --- |
| `npm install`（新项目）或 `npm ci`（稳定锁文件） | 退出码 0，使用 npm 且生成/遵守 package-lock.json |
| `npm run lint` | 退出码 0，无 ESLint 错误 |
| `npm run typecheck` | 退出码 0，TypeScript `--noEmit` 无错误 |
| `npm run build` | 退出码 0，Next.js 生产构建成功 |
| `git diff --check` | 退出码 0，无空白错误或冲突标记 |

应用脚手架建立后，`package.json` 必须提供 lint、typecheck、build。存在真实 test 脚本时还要执行 `npm test`；不存在时必须写“单元测试脚本尚未建立”，并列出替代验证，不能声称单元测试通过。Phase 0 不建立空测试。

## 失败记录格式

记录时间、命令、退出状态、错误摘要、原因、修复文件/动作、复测命令和结果。首次失败不可被最终成功覆盖；未复测不能判定通过。

## 漂移验收

验证通过后核对 ARCHITECTURE、LAYER_CONTRACT、CONSTRUCTION_PLAN、package 脚本、GITHUB_ROLLBACK、WORKFLOW、产品需求、管理员/品牌/GitHub/Remote、Phase 越界、案例定位、用户认证、品牌资产、真实密钥和用户文件。任何修正后重跑受影响门禁。
