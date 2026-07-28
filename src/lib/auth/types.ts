export interface AdminAuthConfig {
  readonly email: string;
  readonly passwordHash: string;
  readonly sessionSecret: string;
}

export interface AdminIdentity {
  readonly email: string;
  readonly role: "admin";
}

export interface AdminSessionPayload extends AdminIdentity {
  readonly expiresAt: number;
}

export const ADMIN_SESSION_COOKIE = "catnip_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
