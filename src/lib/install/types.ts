export const INSTALL_AGENTS = ["claude-code", "codex"] as const;
export const INSTALL_SCOPES = ["project", "global"] as const;

export type InstallAgent = (typeof INSTALL_AGENTS)[number];
export type InstallScope = (typeof INSTALL_SCOPES)[number];

export interface InstallCommandInput {
  readonly repositoryUrl: string;
  readonly skillName: string;
  readonly agent: InstallAgent;
  readonly scope: InstallScope;
}

export type InstallCommandMatrix = Record<InstallAgent, Record<InstallScope, string>>;
