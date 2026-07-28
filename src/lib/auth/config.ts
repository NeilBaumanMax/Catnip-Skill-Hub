import type { AdminAuthConfig } from "./types";

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

export function loadAdminAuthConfig(
  env: Readonly<Record<string, string | undefined>> = process.env,
): AdminAuthConfig {
  const email = env.CATNIP_ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = env.CATNIP_ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = env.CATNIP_SESSION_SECRET?.trim();

  if (!email || !email.includes("@")) {
    throw new AuthConfigurationError("CATNIP_ADMIN_EMAIL 尚未配置为有效邮箱。");
  }

  if (!passwordHash?.startsWith("scrypt$")) {
    throw new AuthConfigurationError("CATNIP_ADMIN_PASSWORD_HASH 尚未配置为 scrypt 哈希。");
  }

  if (!sessionSecret || sessionSecret.length < 32) {
    throw new AuthConfigurationError("CATNIP_SESSION_SECRET 必须至少为 32 个字符。");
  }

  return { email, passwordHash, sessionSecret };
}
