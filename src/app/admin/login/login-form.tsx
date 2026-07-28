"use client";

import { useState, type FormEvent } from "react";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setMessage(result.error ?? "登录失败。");
        return;
      }
      window.location.assign("/admin");
    } catch {
      setMessage("暂时无法连接管理服务。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-form login-form" onSubmit={submit}>
      <label>
        管理员邮箱
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        密码
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button type="submit" disabled={submitting}>{submitting ? "正在验证…" : "登录后台"}</button>
      <p className="form-message" aria-live="polite">{message}</p>
    </form>
  );
}
