import { cookies } from "next/headers";
import { AuthConfigurationError, loadAdminAuthConfig } from "./config";
import { readAdminSessionToken } from "./session";
import { ADMIN_SESSION_COOKIE, type AdminIdentity } from "./types";

export async function getAuthenticatedAdmin(): Promise<AdminIdentity | null> {
  try {
    const config = loadAdminAuthConfig();
    const cookieStore = await cookies();
    const identity = readAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value, config.sessionSecret);
    return identity?.email === config.email ? identity : null;
  } catch (error) {
    if (error instanceof AuthConfigurationError) return null;
    throw error;
  }
}
