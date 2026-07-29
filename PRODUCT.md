# Catnip Skill Hub Product Context

## Product

Catnip Skill Hub is Catnip 薄荷猫's curated Chinese Agent Skill discovery site. Neil Bauman is the project owner and sole first-version publishing administrator. The product helps visitors understand, compare, download, and install selected Agent Skills without requiring an account.

## Primary visitors

- Chinese-speaking developers, product builders, designers, hardware makers, and automation users who want useful Agent Skills without first reading repository internals.
- Newer CLI users who need clear compatibility, installation, source, and risk information.
- Experienced Agent users who want to scan a trusted catalog quickly and continue to the original source when appropriate.

## Core job

Make the Skill itself easy to discover and trust. A visitor should be able to move from visual recognition, to a concise explanation, to source-aware detail, and then to either ZIP download or a verified Claude Code CLI or Codex CLI installation command.

## Product promise

- Curated rather than open publishing.
- Chinese explanation without obscuring the original Skill name, author, repository, version, Commit, or License information.
- Visual discovery without turning the site into a GitHub file list or a documentation portal.
- Frictionless public browsing, search, detail viewing, download, and command copying.
- Explicit administrator control over publication and mirror-download permission.

## First-version scope

- Ten to twenty selected standard Agent Skills or Skill Packs.
- Single Skills, native Skill Packs, and Catnip editorial bundles.
- Five fixed primary categories: VibeCoding 硬件, 编程开发, 前端设计, 产品与项目管理, 自动化.
- Public home, search and filtering, Skill detail, ZIP download, installation command generation, and a recommendation lead form.
- Administrator-only draft, review, publish, unpublish, import assistance, asset management, and basic analytics.

## Explicit non-goals

- No public registration, profiles, follows, favorites, comments, ratings, payment, or self-publishing.
- No independent case-study content line; cases remain subordinate proof inside a Skill detail page.
- No first-version Prompt or MCP marketplace, multilingual switcher, online SKILL.md editor, or interactive file browser.
- No browser or GUI Agent installation claims; first-version installation support is Claude Code CLI and Codex CLI only.
- No automatic legal conclusion from License metadata.

## Operating constraints

- Every new resource begins as a draft and requires administrator publication.
- Original Skill folders and `SKILL.md` files remain unmodified in downloads.
- Installation commands use stable original repository and Skill identifiers, never the Chinese marketing title.
- Formal logo, mascot, and social image assets will be supplied later. Until then, the public identity is the text brand “Catnip 薄荷猫” with replaceable asset slots.
- Public UI must remain useful on desktop and mobile, with keyboard support, sufficient contrast, reduced-motion support, and no dependence on hover alone.
- Local LAN previews use trusted-network HTTP and must not expose real administrator credentials.
- Server deployment is paused until Neil Bauman explicitly reopens it and the separate production gates are satisfied.

## Evidence and content status

- The repository currently contains a ten-item Catnip demonstration catalog used to exercise product behavior; it is not evidence of ten externally verified community resources.
- `project-brief` is the current validated Catnip-owned downloadable fixture. Other demo entries remain governed by their stored download setting and source state.
- There are no approved testimonials, customer logos, usage claims, final brand images, or production analytics to display as proof.
- Skill artwork may later come from authors, community sources, Catnip testing, or administrator-created AI imagery, but every image needs source metadata and no site-integrated image generator is planned for the first version.

## Durable product principles

1. Skill first: visual hierarchy, navigation, and supporting cases must keep the resource itself as the protagonist.
2. Fast recognition: visitors should see useful Skill content early, not a large search hero or a long brand preamble.
3. Source transparency: author, origin, version, Commit, License, and mirror status remain legible and honest.
4. Two equal actions: where permitted, ZIP download and installation to an Agent have equal product importance.
5. Editorial restraint: Catnip curates and explains; it does not disguise demonstrations as verified third-party proof.

For full field, workflow, ZIP, installation, and permission requirements, use `docs/product/PRODUCT_REQUIREMENTS.md` as the authoritative product specification.
