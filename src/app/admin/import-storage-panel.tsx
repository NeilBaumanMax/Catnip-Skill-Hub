"use client";

import { useState, type FormEvent } from "react";
import type { GitHubImportPreview } from "@/lib/import/github";
import type { RecommendationLead } from "@/lib/recommendations";
import type { StoredAssetMetadata } from "@/lib/storage";

interface ImportStoragePanelProps {
  readonly initialAssets: readonly StoredAssetMetadata[];
  readonly initialRecommendations: readonly RecommendationLead[];
}

async function json<T>(response: Response): Promise<T & { error?: string }> {
  return response.json() as Promise<T & { error?: string }>;
}

export function ImportStoragePanel({ initialAssets, initialRecommendations }: ImportStoragePanelProps) {
  const [preview, setPreview] = useState<GitHubImportPreview>();
  const [assets, setAssets] = useState(initialAssets);
  const [message, setMessage] = useState("");

  async function importPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("正在读取 GitHub 元数据…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/import/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repositoryUrl: form.get("repositoryUrl") }),
    });
    const result = await json<{ preview?: GitHubImportPreview }>(response);
    if (!response.ok || !result.preview) {
      setMessage(result.error ?? "读取失败。");
      return;
    }
    setPreview(result.preview);
    setMessage("预览已生成；未创建草稿，未发布资源。");
  }

  async function refreshAssets() {
    const response = await fetch("/api/admin/assets", { cache: "no-store" });
    const result = await json<{ assets?: StoredAssetMetadata[] }>(response);
    if (!response.ok || !result.assets) throw new Error(result.error ?? "文件列表刷新失败。");
    setAssets(result.assets);
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("正在校验并保存文件…");
    const formElement = event.currentTarget;
    const response = await fetch("/api/admin/assets", { method: "POST", body: new FormData(formElement) });
    const result = await json<object>(response);
    if (!response.ok) {
      setMessage(result.error ?? "文件保存失败。");
      return;
    }
    formElement.reset();
    await refreshAssets();
    setMessage("文件已保存到进程内开发存储，并记录 SHA-256。");
  }

  async function removeAsset(id: string) {
    const response = await fetch(`/api/admin/assets/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await json<object>(response);
      setMessage(result.error ?? "删除失败。");
      return;
    }
    await refreshAssets();
    setMessage("文件记录已删除。");
  }

  return (
    <div className="admin-dashboard phase-five-dashboard">
      <section className="admin-panel">
        <div className="admin-section-heading">
          <div><p className="eyebrow">GitHub 辅助导入</p><h2>安全读取 SKILL.md</h2></div>
          <span className="status-badge">只读预览</span>
        </div>
        <form className="admin-form admin-inline-form" onSubmit={importPreview}>
          <label>GitHub 仓库根地址<input name="repositoryUrl" type="url" placeholder="https://github.com/owner/repository" required /></label>
          <button type="submit">生成预览</button>
        </form>
        {preview ? (
          <div className="import-preview">
            <p><strong>固定 Commit：</strong><code>{preview.sourceCommit}</code></p>
            <p><strong>License：</strong>{preview.license ?? "未声明"}</p>
            <ul>{preview.candidates.map((candidate) => <li key={candidate.path}><strong>{candidate.originalName}</strong><span>{candidate.path}</span><p>{candidate.description}</p></li>)}</ul>
          </div>
        ) : null}
      </section>

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div><p className="eyebrow">开发存储</p><h2>ZIP 与图片</h2></div>
          <span className="status-badge">进程内 · 非持久化</span>
        </div>
        <form className="admin-form admin-upload-form" onSubmit={upload}>
          <label>文件类型<select name="kind"><option value="zip">ZIP</option><option value="image">图片</option></select></label>
          <label>选择文件<input name="file" type="file" required /></label>
          <button type="submit">校验并保存</button>
        </form>
        <div className="asset-list">
          {assets.length === 0 ? <p>尚无文件。</p> : assets.map((asset) => (
            <article key={asset.id}>
              <div><strong>{asset.filename}</strong><span>{asset.kind} · {asset.size} bytes</span><code>{asset.sha256}</code></div>
              <div><a href={`/api/admin/assets/${asset.id}`}>下载</a><button type="button" onClick={() => removeAsset(asset.id)}>删除</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div><p className="eyebrow">推荐线索</p><h2>{initialRecommendations.length} 条待人工判断</h2></div>
          <span className="status-badge">不会自动建稿</span>
        </div>
        <div className="recommendation-list">
          {initialRecommendations.length === 0 ? <p>暂无推荐线索。</p> : initialRecommendations.map((lead) => (
            <article key={lead.id}><a href={lead.skillUrl} target="_blank" rel="noreferrer">{lead.skillUrl}</a><p>{lead.reason}</p><span>{lead.sourceChannel}{lead.contact ? ` · ${lead.contact}` : ""}</span></article>
          ))}
        </div>
      </section>
      <p className="form-message" aria-live="polite">{message}</p>
    </div>
  );
}
