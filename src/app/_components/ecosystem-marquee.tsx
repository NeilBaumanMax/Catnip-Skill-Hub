import {
  BracketsCurly,
  Circuitry,
  Cube,
  FigmaLogo,
  GithubLogo,
  NotionLogo,
  OpenAiLogo,
  TerminalWindow,
} from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";

const ecosystemItems = [
  { name: "Claude Code", mark: "C", color: "#d97757", icon: null },
  { name: "Codex CLI", color: "#74d8ad", icon: OpenAiLogo },
  { name: "GitHub", color: "#f5f5f5", icon: GithubLogo },
  { name: "Notion", color: "#f2f1ed", icon: NotionLogo },
  { name: "Figma", color: "#ff7262", icon: FigmaLogo },
  { name: "Arduino", color: "#18a8a8", icon: Circuitry },
  { name: "Raspberry Pi", color: "#c51a4a", icon: BracketsCurly },
  { name: "Docker", color: "#2496ed", icon: Cube },
  { name: "Terminal", color: "#b6a8ff", icon: TerminalWindow },
] as const;

function EcosystemItems({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="ecosystem-track-set" aria-hidden={hidden || undefined}>
      {ecosystemItems.map((item) => {
        const Icon = item.icon;
        return (
          <span className="ecosystem-item" key={item.name} style={{ "--ecosystem-color": item.color } as CSSProperties}>
            <span className="ecosystem-icon" aria-hidden="true">
              {Icon ? <Icon size={25} weight="regular" /> : <strong>{item.mark}</strong>}
            </span>
            <span>{item.name}</span>
          </span>
        );
      })}
    </div>
  );
}

export function EcosystemMarquee() {
  return (
    <div className="ecosystem-marquee" aria-label="Skill 可参与的工具生态">
      <div className="ecosystem-track">
        <EcosystemItems />
        <EcosystemItems hidden />
      </div>
    </div>
  );
}
