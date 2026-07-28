import type { AdminAuthConfig, AdminIdentity } from "./types";
import { verifyAdminPassword } from "./password";

export async function authenticateAdmin(
  email: string,
  password: string,
  config: AdminAuthConfig,
): Promise<AdminIdentity | null> {
  const emailMatches = email.trim().toLowerCase() === config.email;
  const passwordMatches = await verifyAdminPassword(password, config.passwordHash);

  if (!emailMatches || !passwordMatches) return null;
  return { email: config.email, role: "admin" };
}
