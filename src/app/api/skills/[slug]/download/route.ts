import { runtimeSkillRepository } from "@/lib/data/skills";
import { buildSkillArchive, SkillDownloadError } from "@/lib/downloads";

interface DownloadRouteContext {
  params: Promise<{ slug: string }>;
}

export const runtime = "nodejs";

export async function GET(request: Request, { params }: DownloadRouteContext) {
  const { slug } = await params;
  const skill = await runtimeSkillRepository.findBySlug(slug);

  if (!skill || skill.governance.publishStatus !== "published" || skill.governance.hidden) {
    return Response.json({ error: "Skill 不存在。" }, { status: 404 });
  }

  try {
    const pageUrl = new URL(`/skills/${skill.slug}`, request.url).toString();
    const archive = await buildSkillArchive(skill, { catnipPageUrl: pageUrl });
    const body = archive.bytes.buffer.slice(
      archive.bytes.byteOffset,
      archive.bytes.byteOffset + archive.bytes.byteLength,
    ) as ArrayBuffer;

    return new Response(body, {
      headers: {
        "Content-Type": archive.contentType,
        "Content-Disposition": `attachment; filename="${archive.filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof SkillDownloadError) {
      const status = error.code === "not_enabled" ? 403 : 422;
      return Response.json({ error: error.message }, { status });
    }

    throw error;
  }
}
