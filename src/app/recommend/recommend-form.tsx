"use client";

import { useState, type FormEvent } from "react";

export function RecommendForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillUrl: form.get("skillUrl"),
          sourceChannel: form.get("sourceChannel"),
          reason: form.get("reason"),
          contact: form.get("contact"),
          website: form.get("website"),
        }),
      });
      const result = await response.json() as { accepted?: boolean; error?: string };
      if (!response.ok) throw new Error(result.error ?? "提交失败，请稍后再试。");
      formElement.reset();
      setMessage("已收到推荐线索。管理员会人工判断，提交不会自动创建或公开 Skill。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败，请稍后再试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="recommend-form" onSubmit={submit}>
      <label>Skill 链接<input name="skillUrl" type="url" placeholder="https://github.com/owner/repository" required /></label>
      <label>发现渠道<input name="sourceChannel" placeholder="GitHub、朋友推荐、社区……" required maxLength={100} /></label>
      <label>推荐理由<textarea name="reason" rows={6} required maxLength={1500} /></label>
      <label>联系方式（选填）<input name="contact" maxLength={200} /></label>
      <label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button disabled={busy} type="submit">{busy ? "提交中…" : "提交推荐"}</button>
      <p className="form-message" aria-live="polite" role="status">{message}</p>
    </form>
  );
}
