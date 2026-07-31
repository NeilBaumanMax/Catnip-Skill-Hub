import type { SkillResource } from "@/lib/domain/skills";
import {
  buildSkillArchive,
  SkillDownloadError,
  type ArchiveOptions,
  type SkillArchive,
} from "./archive";

const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const RELEASE_OWNER = "neilbauman666";
const RELEASE_REPOSITORY = "Catnip-skill-hub-main";

export type ResolvedSkillDownload =
  | { readonly kind: "release_redirect"; readonly url: string }
  | { readonly kind: "local_archive"; readonly archive: SkillArchive };

export function getCatnipReleaseAssetError(
  value: string,
  slug: string,
  version: string,
): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "GitHub Release 资产必须是有效 HTTPS 地址。";
  }

  if (
    url.protocol !== "https:"
    || url.hostname !== "github.com"
    || url.port
    || url.username
    || url.password
    || url.search
    || url.hash
  ) {
    return "GitHub Release 资产必须使用无查询参数的 github.com HTTPS 地址。";
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (
    segments.length !== 6
    || segments[0] !== RELEASE_OWNER
    || segments[1] !== RELEASE_REPOSITORY
    || segments[2] !== "releases"
    || segments[3] !== "download"
  ) {
    return "Release 下载只允许来自 Catnip 指定内容主库。";
  }

  const tagVersion = segments[4].startsWith("v") ? segments[4].slice(1) : "";
  if (!SEMVER.test(tagVersion) || tagVersion !== version) {
    return "Release 下载必须固定到语义化版本 Tag，不得使用 latest 或分支。";
  }

  if (!SEMVER.test(version) || segments[5] !== `${slug}-${version}.zip`) {
    return "Release ZIP 文件名必须与资源 slug 和版本完全一致。";
  }

  return null;
}

export async function resolveSkillDownload(
  skill: SkillResource,
  options: ArchiveOptions = {},
): Promise<ResolvedSkillDownload> {
  if (!skill.governance.downloadEnabled) {
    throw new SkillDownloadError("not_enabled", "管理员尚未开放该资源的 Catnip 镜像下载。");
  }

  if (skill.source.releaseAssetUrl) {
    const error = getCatnipReleaseAssetError(
      skill.source.releaseAssetUrl,
      skill.slug,
      skill.source.version,
    );
    if (error) throw new SkillDownloadError("invalid_source", error);
    return { kind: "release_redirect", url: skill.source.releaseAssetUrl };
  }

  return { kind: "local_archive", archive: await buildSkillArchive(skill, options) };
}
