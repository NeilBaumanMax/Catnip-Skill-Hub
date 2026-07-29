import Image from "next/image";
import type { CoverTheme } from "@/lib/domain/skills/types";

const artworkByTheme: Record<CoverTheme, string> = {
  mind: "/skill-art/mind.svg",
  interface: "/skill-art/interface.svg",
  hardware: "/skill-art/hardware.svg",
  brief: "/skill-art/brief.svg",
  flow: "/skill-art/flow.svg",
  map: "/skill-art/map.svg",
  system: "/skill-art/system.svg",
  sensor: "/skill-art/sensor.svg",
  release: "/skill-art/release.svg",
  research: "/skill-art/research.svg",
};

export function SkillArtwork({
  theme,
  alt,
  priority = false,
  className = "",
}: {
  readonly theme: CoverTheme;
  readonly alt: string;
  readonly priority?: boolean;
  readonly className?: string;
}) {
  return (
    <div className={`skill-artwork theme-${theme} ${className}`.trim()}>
      <Image
        alt={alt}
        className="skill-artwork-image"
        fill
        priority={priority}
        sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 40vw"
        src={artworkByTheme[theme]}
      />
    </div>
  );
}
