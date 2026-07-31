"use client";

import { useState, type FormEvent } from "react";
import { MAIN_CATEGORIES, type MainCategory, type SkillResource } from "@/lib/domain/skills";

interface AdminDashboardProps {
  readonly initialSkills: readonly SkillResource[];
}

const statusLabels = {
  draft: "草稿",
  published: "已发布",
  unlisted: "已下架",
  archived: "已归档",
} as const;

async function responseResult(response: Response): Promise<{ skill?: SkillResource; error?: string }> {
  if (response.status === 204) return {};
  return response.json() as Promise<{ skill?: SkillResource; error?: string }>;
}

export function AdminDashboard({ initialSkills }: AdminDashboardProps) {
  const [skills, setSkills] = useState<readonly SkillResource[]>(initialSkills);
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch("/api/admin/skills", { cache: "no-store" });
    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }
    const result = await response.json() as { skills?: SkillResource[]; error?: string };
    if (!response.ok || !result.skills) throw new Error(result.error ?? "无法刷新目录。");
    setSkills(result.skills);
  }

  async function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.get("slug"),
        title: form.get("title"),
        originalName: form.get("originalName"),
        summary: form.get("summary"),
        category: form.get("category"),
        tags: String(form.get("tags") ?? "").split(","),
        subtype: form.get("subtype"),
        authorName: form.get("authorName"),
        sourceUrl: form.get("sourceUrl"),
        repositoryUrl: form.get("repositoryUrl"),
        repositoryPath: form.get("repositoryPath"),
        releaseAssetUrl: form.get("releaseAssetUrl"),
        license: form.get("license"),
        version: form.get("version"),
        adminNotes: form.get("adminNotes"),
      }),
    });
    const result = await responseResult(response);
    if (!response.ok) {
      setMessage(result.error ?? "创建草稿失败。");
      return;
    }
    formElement.reset();
    await refresh();
    setMessage("草稿已创建。进程重启后会恢复为种子基线。");
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">新资源</p>
            <h2>创建 Skill 草稿</h2>
          </div>
          <span className="status-badge">草稿优先</span>
        </div>
        <form className="admin-form admin-create-grid" onSubmit={createDraft}>
          <label>Slug<input name="slug" placeholder="skill-name" required /></label>
          <label>中文标题<input name="title" required /></label>
          <label>原始名称<input name="originalName" placeholder="original-skill-name" required /></label>
          <label>主分类<select name="category" defaultValue={MAIN_CATEGORIES[0]}>{MAIN_CATEGORIES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>子类型<select name="subtype" defaultValue="single"><option value="single">单项 Skill</option><option value="native_pack">原生 Skill 包</option><option value="editorial_pack">编辑组合包</option></select></label>
          <label>原作者<input name="authorName" required /></label>
          <label className="admin-span-2">一句话介绍<textarea name="summary" rows={2} required /></label>
          <label>标签，以逗号分隔<input name="tags" /></label>
          <label>版本<input name="version" placeholder="1.0.0" required /></label>
          <label>License<input name="license" placeholder="记录实际信息，不自动判断" required /></label>
          <label className="admin-span-2">原始来源 URL<input name="sourceUrl" type="url" required /></label>
          <label className="admin-span-2">GitHub 仓库 URL<input name="repositoryUrl" type="url" /></label>
          <label className="admin-span-2">仓库内路径<input name="repositoryPath" placeholder="content/skills/example" /></label>
          <label className="admin-span-2">GitHub Release ZIP<input name="releaseAssetUrl" type="url" placeholder="https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v1.0.0/example-1.0.0.zip" /></label>
          <label className="admin-span-2">管理员备注<textarea name="adminNotes" rows={2} /></label>
          <div className="admin-span-2 admin-form-footer">
            <button type="submit">创建草稿</button>
            <p className="form-message" aria-live="polite">{message}</p>
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">资源目录</p>
            <h2>{skills.length} 个管理记录</h2>
          </div>
          <button className="quiet-button" type="button" onClick={() => refresh().catch((error: Error) => setMessage(error.message))}>刷新</button>
        </div>
        <div className="admin-skill-list">
          {skills.map((skill) => (
            <AdminSkillCard key={skill.slug} skill={skill} onChanged={refresh} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AdminSkillCard({ skill, onChanged }: { readonly skill: SkillResource; readonly onChanged: () => Promise<void> }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function patch(payload: object) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/skills/${skill.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await responseResult(response);
      if (!response.ok) throw new Error(result.error ?? "操作失败。");
      await onChanged();
      setMessage("已保存。" );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败。");
    } finally {
      setBusy(false);
    }
  }

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await patch({
      operation: "update",
      input: {
        title: form.get("title"),
        summary: form.get("summary"),
        category: form.get("category"),
        tags: String(form.get("tags") ?? "").split(","),
        releaseAssetUrl: form.get("releaseAssetUrl"),
        downloadEnabled: form.get("downloadEnabled") === "on",
        adminNotes: form.get("adminNotes"),
      },
    });
  }

  async function remove() {
    if (!window.confirm(`确认删除 ${skill.title}？已发布资源必须先下架。`)) return;
    setBusy(true);
    const response = await fetch(`/api/admin/skills/${skill.slug}`, { method: "DELETE" });
    const result = await responseResult(response);
    if (!response.ok) {
      setMessage(result.error ?? "删除失败。");
      setBusy(false);
      return;
    }
    await onChanged();
  }

  return (
    <article className="admin-skill-card">
      <div className="admin-skill-meta">
        <div><strong>{skill.title}</strong><code>{skill.slug}</code></div>
        <span className={`status-badge status-${skill.governance.publishStatus}`}>{statusLabels[skill.governance.publishStatus]}</span>
      </div>
      <form className="admin-form admin-edit-grid" onSubmit={update}>
        <label>中文标题<input name="title" defaultValue={skill.title} required /></label>
        <label>主分类<select name="category" defaultValue={skill.category}>{MAIN_CATEGORIES.map((value: MainCategory) => <option key={value}>{value}</option>)}</select></label>
        <label className="admin-span-2">一句话介绍<textarea name="summary" defaultValue={skill.summary} rows={2} required /></label>
        <label>标签<input name="tags" defaultValue={skill.tags.join(", ")} /></label>
        <label className="admin-span-2">GitHub Release ZIP<input name="releaseAssetUrl" type="url" defaultValue={skill.source.releaseAssetUrl ?? ""} /></label>
        <label className="checkbox-label"><input name="downloadEnabled" type="checkbox" defaultChecked={skill.governance.downloadEnabled} />开放镜像下载</label>
        <label className="admin-span-2">管理员备注<textarea name="adminNotes" defaultValue={skill.governance.adminNotes} rows={2} /></label>
        <div className="admin-span-2 admin-card-actions">
          <button type="submit" disabled={busy}>保存</button>
          {skill.governance.publishStatus === "published" ? (
            <button className="quiet-button" type="button" disabled={busy} onClick={() => patch({ operation: "unlist" })}>下架</button>
          ) : (
            <button className="quiet-button" type="button" disabled={busy || skill.governance.publishStatus === "archived"} onClick={() => patch({ operation: "publish" })}>发布</button>
          )}
          <button className="danger-button" type="button" disabled={busy} onClick={remove}>删除</button>
          <span className="form-message" aria-live="polite">{message}</span>
        </div>
      </form>
    </article>
  );
}
