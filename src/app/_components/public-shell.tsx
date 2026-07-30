import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "./brand-logo";
import { PublicRailNav } from "./public-rail-nav";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="discovery-page public-shell">
      <aside className="utility-rail" aria-label="Catnip Skill Hub">
        <Link className="rail-brand" href="/#page-top" aria-label="Catnip Skill Hub 首页">
          <BrandLogo className="brand-logo" priority />
        </Link>
        <PublicRailNav />
        <span className="rail-signature" aria-hidden="true">CATNIP</span>
      </aside>
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

        <form className="discovery-search" role="search" aria-label="搜索 Skill" action="/" method="get">
          <label htmlFor="public-search-input">搜索 Skill</label>
          <input
            id="public-search-input"
            name="q"
            type="search"
            placeholder="搜索标题、用途、作者或标签"
            defaultValue={query}
            maxLength={100}
          />
          <button type="submit">搜索</button>
        </form>

        <Link
          aria-current={recommendationPage ? "page" : undefined}
          className={`discovery-recommend${recommendationPage ? " active" : ""}`}
          href="/recommend"
        >
          推荐 Skill
        </Link>
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
