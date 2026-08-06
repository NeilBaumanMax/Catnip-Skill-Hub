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
    const forwardedHost = request.headers.get("x-forwarded-host")?.trim();
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",", 1)[0]?.trim();
    const requestOrigin = forwardedHost && (forwardedProto === "http" || forwardedProto === "https")
      ? new URL(`${forwardedProto}://${forwardedHost}`).origin
      : new URL(request.url).origin;

    return new URL(origin).origin === requestOrigin;
  } catch {
    return false;
  }
}
