import { isIP } from "node:net";
import { chmod, readFile, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ENV_KEY = "CATNIP_BIND_ADDRESS";

export function isAllowedLocalBindAddress(address) {
  if (isIP(address) !== 4) return false;
  if (address === "127.0.0.1") return true;

  const [first, second] = address.split(".").map(Number);
  return first === 10
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168);
}

export function updateBindAddress(content, address) {
  if (!isAllowedLocalBindAddress(address)) {
    throw new Error("绑定地址只允许 127.0.0.1 或 RFC1918 私网 IPv4；拒绝全网卡、公网、组播和无效地址。");
  }

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const output = [];
  let written = false;

  for (const line of lines) {
    if (line.startsWith(`${ENV_KEY}=`)) {
      if (!written) output.push(`${ENV_KEY}=${address}`);
      written = true;
      continue;
    }
    output.push(line);
  }

  if (!written) {
    while (output.at(-1) === "") output.pop();
    output.push(`${ENV_KEY}=${address}`, "");
  }

  return `${output.join("\n").replace(/\n*$/, "")}\n`;
}

async function main() {
  const address = process.argv[2]?.trim();
  if (!address) {
    throw new Error("用法：npm run deploy:local:bind -- <127.0.0.1|私网IPv4>");
  }
  if (!isAllowedLocalBindAddress(address)) {
    throw new Error("绑定地址只允许 127.0.0.1 或 RFC1918 私网 IPv4；拒绝全网卡、公网、组播和无效地址。");
  }

  const envFile = resolve(process.env.CATNIP_ENV_FILE || fileURLToPath(new URL("../.env.local", import.meta.url)));
  const temporaryFile = `${envFile}.tmp-${process.pid}`;
  const content = await readFile(envFile, "utf8");

  try {
    await writeFile(temporaryFile, updateBindAddress(content, address), { encoding: "utf8", mode: 0o600, flag: "wx" });
    await rename(temporaryFile, envFile);
    await chmod(envFile, 0o600);
  } finally {
    await rm(temporaryFile, { force: true });
  }

  process.stdout.write(`本地入口绑定地址已设置为 ${address}；未输出其他环境值。\n`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : "绑定地址设置失败。"}\n`);
    process.exitCode = 1;
  });
}
