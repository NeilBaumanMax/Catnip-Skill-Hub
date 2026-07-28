import assert from "node:assert/strict";
import test from "node:test";
import { getSkillBySlug } from "../src/lib/domain/skills";
import { buildInstallCommand, buildInstallCommandMatrix, InstallCommandError } from "../src/lib/install";

const repositoryUrl = "https://github.com/NeilBaumanMax/Catnip-Skill-Hub";

test("生成两个 Agent 与两个范围的真实 skills CLI 命令", () => {
  const projectBrief = getSkillBySlug("project-brief");
  assert.ok(projectBrief);

  const matrix = buildInstallCommandMatrix(projectBrief);
  assert.ok(matrix);

  assert.equal(
    matrix["claude-code"].project,
    `npx skills add ${repositoryUrl} --skill project-brief --agent claude-code --yes --full-depth`,
  );
  assert.equal(
    matrix["claude-code"].global,
    `npx skills add ${repositoryUrl} --skill project-brief --agent claude-code --yes --full-depth --global`,
  );
  assert.equal(
    matrix.codex.project,
    `npx skills add ${repositoryUrl} --skill project-brief --agent codex --yes --full-depth`,
  );
  assert.equal(
    matrix.codex.global,
    `npx skills add ${repositoryUrl} --skill project-brief --agent codex --yes --full-depth --global`,
  );
});

test("安装命令不依赖中文传播标题", () => {
  const projectBrief = getSkillBySlug("project-brief");
  assert.ok(projectBrief);
  const matrix = buildInstallCommandMatrix(projectBrief);
  assert.ok(matrix);

  for (const commands of Object.values(matrix)) {
    for (const command of Object.values(commands)) {
      assert.doesNotMatch(command, new RegExp(projectBrief.title));
      assert.match(command, /--skill project-brief/);
    }
  }
});

test("拒绝非 GitHub 仓库根地址和不安全 Skill 名称", () => {
  assert.throws(
    () => buildInstallCommand({ repositoryUrl: "https://example.com/repo", skillName: "safe", agent: "codex", scope: "project" }),
    InstallCommandError,
  );
  assert.throws(
    () => buildInstallCommand({ repositoryUrl, skillName: "../../unsafe", agent: "codex", scope: "project" }),
    InstallCommandError,
  );
});

test("没有仓库路径的演示资源不生成命令", () => {
  const demoSkill = getSkillBySlug("deeper-reasoning");
  assert.ok(demoSkill);
  assert.equal(buildInstallCommandMatrix(demoSkill), null);
});
