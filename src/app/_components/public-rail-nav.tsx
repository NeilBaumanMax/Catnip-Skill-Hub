"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, GridFour, House, Info, Sparkle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  resolvePublicNavigationSelection,
  sectionFromHash,
  type HomeSection,
  type PublicNavigationSelection,
} from "./public-navigation";

const sectionLinks = [
  { key: "home", href: "/#page-top", icon: House, label: "首页" },
  { key: "explore", href: "/#skill-grid", icon: Compass, label: "探索" },
  { key: "categories", href: "/#categories", icon: GridFour, label: "分类" },
  { key: "about", href: "/#about", icon: Info, label: "关于" },
] as const;

function readHash(): string {
  return typeof window === "undefined" ? "" : window.location.hash;
}

export function PublicRailNav() {
  const pathname = usePathname();
  const [visibleSection, setVisibleSection] = useState<HomeSection>("home");
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;

    const syncHash = () => {
      const nextHash = readHash();
      setHash(nextHash);
      const section = sectionFromHash(nextHash);
      if (section) setVisibleSection(section);
    };
    const targets = ["page-top", "skill-grid", "about"]
      .map((id) => document.getElementById(id))
      .filter((target): target is HTMLElement => Boolean(target));

    const updateFromLayout = () => {
      const marker = Math.min(window.innerHeight * 0.34, 260);
      const passed = targets.filter((target) => target.getBoundingClientRect().top <= marker);
      const target = passed.at(-1) ?? targets[0];
      const section = target?.id === "skill-grid" ? "explore" : target?.id === "about" ? "about" : "home";
      setVisibleSection(section);
      if (section !== "home" || readHash() !== "#categories") setHash("");
    };

    const observer = new IntersectionObserver(updateFromLayout, {
      rootMargin: "-96px 0px -48% 0px",
      threshold: [0, 0.01, 0.5, 1],
    });
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("hashchange", syncHash);
    const initialFrame = window.requestAnimationFrame(() => {
      syncHash();
      updateFromLayout();
    });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, [pathname]);

  const selected = useMemo<PublicNavigationSelection>(() => (
    resolvePublicNavigationSelection({ pathname, hash, visibleSection })
  ), [hash, pathname, visibleSection]);

  function select(section: PublicNavigationSelection) {
    if (section && section !== "recommend") {
      setVisibleSection(section);
      setHash(section === "home" ? "#page-top" : section === "explore" ? "#skill-grid" : `#${section}`);
    }
  }

  return (
    <nav className="rail-nav" aria-label="站点导航">
      <div className="rail-nav-sections">
        {sectionLinks.map((item) => {
          const active = selected === item.key;
          return (
            <Link
              aria-current={active ? "location" : undefined}
              className={active ? "active" : ""}
              href={item.href}
              key={item.key}
              aria-label={item.label}
              onClick={() => select(item.key)}
            >
              <item.icon aria-hidden="true" size={22} weight="regular" />
              <span className="rail-tooltip" aria-hidden="true">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="rail-nav-actions" aria-label="独立操作">
        <Link
          aria-current={selected === "recommend" ? "page" : undefined}
          className={selected === "recommend" ? "active" : ""}
          href="/recommend"
          aria-label="推荐 Skill"
        >
          <Sparkle aria-hidden="true" size={22} weight="regular" />
          <span className="rail-tooltip" aria-hidden="true">推荐 Skill</span>
        </Link>
      </div>
    </nav>
  );
}
