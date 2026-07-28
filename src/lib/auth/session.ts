import { createHmac, timingSafeEqual } from "node:crypto";
import type { AdminIdentity, AdminSessionPayload } from "./types";
import { ADMIN_SESSION_MAX_AGE_SECONDS } from "./types";

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionToken(
  identity: AdminIdentity,
  secret: string,
  now = new Date(),
): string {
  const payload: AdminSessionPayload = {
    ...identity,
    expiresAt: now.getTime() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function readAdminSessionToken(
  token: string | undefined,
  secret: string,
  now = new Date(),
): AdminIdentity | null {
  if (!token) return null;

  const [encoded, signature, ...extra] = token.split(".");
  if (!encoded || !signature || extra.length > 0) return null;

  const expected = Buffer.from(sign(encoded, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<AdminSessionPayload>;
    if (payload.role !== "admin" || typeof payload.email !== "string" || typeof payload.expiresAt !== "number") return null;
    if (payload.expiresAt <= now.getTime()) return null;
    return { email: payload.email, role: "admin" };
  } catch {
    return null;
  }
}
