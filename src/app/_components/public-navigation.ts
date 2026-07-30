export type HomeSection = "home" | "categories" | "explore" | "about";
export type PublicNavigationSelection = HomeSection | "recommend" | null;

const HASH_TO_SECTION: Record<string, HomeSection> = {
  "#page-top": "home",
  "#categories": "categories",
  "#skill-grid": "explore",
  "#about": "about",
};

export function sectionFromHash(hash: string): HomeSection | undefined {
  return HASH_TO_SECTION[hash];
}

export function resolvePublicNavigationSelection({
  pathname,
  hash,
  visibleSection,
}: {
  pathname: string;
  hash?: string;
  visibleSection?: HomeSection;
}): PublicNavigationSelection {
  if (pathname === "/recommend") return "recommend";
  if (pathname.startsWith("/skills/")) return "explore";
  if (pathname !== "/") return null;

  return sectionFromHash(hash ?? "") ?? visibleSection ?? "home";
}
