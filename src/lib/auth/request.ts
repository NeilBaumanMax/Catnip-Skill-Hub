import { ADMIN_SESSION_COOKIE, type AdminIdentity } from "./types";
import { AuthConfigurationError, loadAdminAuthConfig } from "./config";
import { readAdminSessionToken } from "./session";

function cookieValue(cookieHeader: string | null, name: string): string | undefined {
  return cookieHeader
    ?.split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function getRequestAdmin(request: Request): AdminIdentity | null {
  try {
    const config = loadAdminAuthConfig();
    const token = cookieValue(request.headers.get("cookie"), ADMIN_SESSION_COOKIE);
    const identity = readAdminSessionToken(token, config.sessionSecret);
    return identity?.email === config.email ? identity : null;
  } catch (error) {
    if (error instanceof AuthConfigurationError) return null;
    throw error;
  }
}

export function isSameOriginMutation(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
