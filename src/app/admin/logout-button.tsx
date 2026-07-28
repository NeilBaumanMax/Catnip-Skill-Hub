"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.assign("/admin/login");
  }

  return <button className="quiet-button" type="button" onClick={logout}>退出登录</button>;
}
