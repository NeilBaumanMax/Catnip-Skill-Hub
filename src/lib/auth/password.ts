import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
const KEY_LENGTH = 64;
const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

function deriveKey(password: string, salt: Buffer, keyLength: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

export async function hashAdminPassword(password: string): Promise<string> {
  if (password.length < 12 || password.length > 256) {
    throw new Error("管理员密码长度必须为 12 至 256 个字符。");
  }

  const salt = randomBytes(16);
  const derived = await deriveKey(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 64 * 1024 * 1024,
  });

  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("base64url"), derived.toString("base64url")].join("$");
}

export async function verifyAdminPassword(password: string, encodedHash: string): Promise<boolean> {
  if (password.length > 256) return false;

  const [algorithm, nValue, rValue, pValue, saltValue, expectedValue, ...extra] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !saltValue || !expectedValue || extra.length > 0) return false;

  const N = Number(nValue);
  const r = Number(rValue);
  const p = Number(pValue);
  if (N !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P) return false;

  try {
    const salt = Buffer.from(saltValue, "base64url");
    const expected = Buffer.from(expectedValue, "base64url");
    if (salt.length !== 16 || expected.length !== KEY_LENGTH) return false;

    const actual = await deriveKey(password, salt, expected.length, {
      N,
      r,
      p,
      maxmem: 64 * 1024 * 1024,
    });

    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
