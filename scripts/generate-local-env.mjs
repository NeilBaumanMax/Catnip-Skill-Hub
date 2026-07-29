import { randomBytes } from "node:crypto";
import { access, writeFile } from "node:fs/promises";

const target = new URL("../.env.local", import.meta.url);

try {
  await access(target);
  throw new Error(".env.local 已存在；为避免覆盖本地秘密，已停止生成。");
} catch (error) {
  if (error instanceof Error && error.message.includes("已存在")) throw error;
}

const secret = (bytes = 32) => randomBytes(bytes).toString("hex");
const content = [
  "# 由 npm run deploy:local:env 生成；仅用于本机，不得提交。",
  `CATNIP_POSTGRES_PASSWORD=${secret()}`,
  `CATNIP_S3_ACCESS_KEY_ID=catnip-${secret(8)}`,
  `CATNIP_S3_SECRET_ACCESS_KEY=${secret()}`,
  `CATNIP_SESSION_SECRET=${secret(48)}`,
  "CATNIP_BIND_ADDRESS=127.0.0.1",
  "CATNIP_ADMIN_EMAIL=",
  "CATNIP_ADMIN_PASSWORD_HASH=",
  "CATNIP_GITHUB_TOKEN=",
  "",
].join("\n");

await writeFile(target, content, { encoding: "utf8", mode: 0o600, flag: "wx" });
process.stdout.write("已生成权限为 0600 的 .env.local；未输出任何秘密。\n");
