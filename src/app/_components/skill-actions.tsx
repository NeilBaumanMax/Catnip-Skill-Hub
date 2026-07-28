"use client";

import { useState } from "react";
import type { InstallAgent, InstallCommandMatrix, InstallScope } from "@/lib/install";

interface SkillActionsProps {
  readonly commands: InstallCommandMatrix | null;
  readonly downloadEnabled: boolean;
  readonly downloadUrl: string;
}

const agentLabels: Record<InstallAgent, string> = {
  "claude-code": "Claude Code CLI",
  codex: "Codex CLI",
};

const scopeLabels: Record<InstallScope, string> = {
  project: "当前项目",
  global: "全局安装",
};

export function SkillActions({ commands, downloadEnabled, downloadUrl }: SkillActionsProps) {
  const [agent, setAgent] = useState<InstallAgent>("claude-code");
  const [scope, setScope] = useState<InstallScope>("project");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const command = commands?.[agent][scope] ?? "当前资源尚未绑定可验证的安装源。";

  async function copyCommand() {
    if (!commands) return;

    try {
      await navigator.clipboard.writeText(command);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section className="action-panel skill-actions" aria-labelledby="action-title">
      <div className="action-copy">
        <p className="eyebrow">获取 Skill</p>
        <h2 id="action-title">下载 ZIP 或安装到 Agent</h2>
        <p>命令由服务层根据真实 skills CLI 1.5.20 参数生成，不使用中文传播标题。</p>
      </div>

      <div className="install-controls">
        <div className="toggle-group" aria-label="目标 Agent">
          {Object.entries(agentLabels).map(([value, label]) => (
            <button
              className={agent === value ? "selected" : ""}
              key={value}
              type="button"
              onClick={() => setAgent(value as InstallAgent)}
              disabled={!commands}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="toggle-group" aria-label="安装范围">
          {Object.entries(scopeLabels).map(([value, label]) => (
            <button
              className={scope === value ? "selected" : ""}
              key={value}
              type="button"
              onClick={() => setScope(value as InstallScope)}
              disabled={!commands}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="command-row">
          <code>{command}</code>
          <button type="button" onClick={copyCommand} disabled={!commands}>
            {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制命令"}
          </button>
        </div>

        <div className="action-buttons">
          {downloadEnabled ? (
            <a href={downloadUrl}>下载 ZIP</a>
          ) : (
            <button type="button" disabled>下载尚未开放</button>
          )}
          <button type="button" onClick={copyCommand} disabled={!commands}>安装到 Agent</button>
        </div>
      </div>
    </section>
  );
}
