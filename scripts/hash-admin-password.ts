import { stdin, stdout } from "node:process";
import { hashAdminPassword } from "../src/lib/auth/password";

async function readPassword(): Promise<string> {
  if (!stdin.isTTY) {
    let value = "";
    for await (const chunk of stdin) value += chunk;
    return value.replace(/[\r\n]+$/, "");
  }

  stdout.write("管理员密码（输入不会显示）：");
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  return new Promise((resolve, reject) => {
    let value = "";

    function restoreInput() {
      stdin.off("data", handleData);
      stdin.setRawMode(false);
      stdin.pause();
    }

    function finish() {
      restoreInput();
      stdout.write("\n");
      resolve(value);
    }

    function handleData(chunk: string) {
      for (const character of chunk) {
        if (character === "\u0003") {
          restoreInput();
          reject(new Error("已取消。"));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f") {
          value = value.slice(0, -1);
          continue;
        }
        value += character;
      }
    }

    stdin.on("data", handleData);
  });
}

async function main(): Promise<void> {
  const password = await readPassword();
  stdout.write(`${await hashAdminPassword(password)}\n`);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
