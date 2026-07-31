import Link from "next/link";
import type { ReactNode } from "react";
import {
  Compass,
  Fire,
  MagnifyingGlass,
  Sparkle,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "./brand-logo";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="discovery-page public-shell">
      <div className="discovery-main">{children}</div>
    </div>
  );
}

export function PublicHeader({
  query = "",
  children,
  context,
  recommendationPage = false,
}: {
  query?: string;
  children?: ReactNode;
  context?: { parent: string; current: string; parentHref?: string };
  recommendationPage?: boolean;
}) {
  const searchHref = query
    ? `/?q=${encodeURIComponent(query)}#search-stage`
    : "/#search-stage";

  return (
    <header className="discovery-header">
      <div className="discovery-topline">
        <Link className="discovery-wordmark" href="/#page-top">
          <BrandLogo className="brand-logo" priority />
          <span className="discovery-wordmark-copy">
            <strong>Catnip Skill Hub</strong>
            <small>Curated Agent Skills</small>
          </span>
        </Link>

        <nav className="discovery-primary-nav" aria-label="主要导航">
          <Link href="/#skill-grid"><Compass aria-hidden="true" size={17} />探索</Link>
          <Link href="/#categories"><SquaresFour aria-hidden="true" size={17} />分类</Link>
          <Link href="/#popular-tags"><Fire aria-hidden="true" size={17} />热门</Link>
        </nav>

        <div className="discovery-header-actions">
          <Link className="discovery-search-link" href={searchHref}>
            <MagnifyingGlass aria-hidden="true" size={18} />
            <span>搜索</span>
            <kbd>⌘ K</kbd>
          </Link>
          <Link
            aria-current={recommendationPage ? "page" : undefined}
            className={`discovery-recommend${recommendationPage ? " active" : ""}`}
            href="/recommend"
          >
            <Sparkle aria-hidden="true" size={17} />
            推荐 Skill
          </Link>
        </div>
      </div>

      {children ? <div className="discovery-filters" id="categories">{children}</div> : null}
      {context ? (
        <div className="public-context" aria-label="当前位置">
          <Link href={context.parentHref ?? "/#skill-grid"}>{context.parent}</Link>
          <span aria-hidden="true">/</span>
          <strong>{context.current}</strong>
        </div>
      ) : null}
    </header>
  );
}
