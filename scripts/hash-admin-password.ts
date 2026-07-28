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

    function finish() {
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
      resolve(value);
    }

    stdin.on("data", (character: string) => {
      if (character === "\u0003") {
        stdin.setRawMode(false);
        reject(new Error("已取消。"));
        return;
      }
      if (character === "\r" || character === "\n") {
        finish();
        return;
      }
      if (character === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += character;
    });
  });
}

const password = await readPassword();
stdout.write(`${await hashAdminPassword(password)}\n`);
