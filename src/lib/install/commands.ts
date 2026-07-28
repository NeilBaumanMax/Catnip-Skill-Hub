import type { SkillResource } from "@/lib/domain/skills";
import { INSTALL_AGENTS, INSTALL_SCOPES, type InstallCommandInput, type InstallCommandMatrix } from "./types";

const SAFE_SKILL_NAME = /^[a-z0-9][a-z0-9-]{0,62}$/;
const GITHUB_REPOSITORY = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

export class InstallCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InstallCommandError";
  }
}

export function buildInstallCommand(input: InstallCommandInput): string {
  if (!GITHUB_REPOSITORY.test(input.repositoryUrl)) {
    throw new InstallCommandError("安装源必须是仓库根级 GitHub HTTPS 地址。");
  }

  if (!SAFE_SKILL_NAME.test(input.skillName)) {
    throw new InstallCommandError("Skill 名称必须是稳定的小写英文、数字或连字符标识。");
  }

  if (!INSTALL_AGENTS.includes(input.agent)) {
    throw new InstallCommandError("不支持的目标 Agent。");
  }

  if (!INSTALL_SCOPES.includes(input.scope)) {
    throw new InstallCommandError("不支持的安装范围。");
  }

  const scopeFlag = input.scope === "global" ? " --global" : "";

  return `npx skills add ${input.repositoryUrl} --skill ${input.skillName} --agent ${input.agent} --yes --full-depth${scopeFlag}`;
}

export function buildInstallCommandMatrix(skill: SkillResource): InstallCommandMatrix | null {
  const repositoryUrl = skill.source.repositoryUrl;
  const repositoryPath = skill.source.repositoryPath;

  if (!repositoryUrl || !repositoryPath) return null;

  return {
    "claude-code": {
      project: buildInstallCommand({ repositoryUrl, skillName: skill.originalName, agent: "claude-code", scope: "project" }),
      global: buildInstallCommand({ repositoryUrl, skillName: skill.originalName, agent: "claude-code", scope: "global" }),
    },
    codex: {
      project: buildInstallCommand({ repositoryUrl, skillName: skill.originalName, agent: "codex", scope: "project" }),
      global: buildInstallCommand({ repositoryUrl, skillName: skill.originalName, agent: "codex", scope: "global" }),
    },
  };
}
