import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedLocalBindAddress, updateBindAddress } from "../scripts/set-local-bind-address.mjs";

test("局域网绑定只接受回环和 RFC1918 IPv4", () => {
  for (const address of ["127.0.0.1", "10.0.0.2", "172.16.0.2", "172.31.255.254", "192.168.120.107"]) {
    assert.equal(isAllowedLocalBindAddress(address), true, address);
  }

  for (const address of ["0.0.0.0", "8.8.8.8", "169.254.1.2", "172.32.0.1", "224.0.0.1", "::", "localhost", "bad"]) {
    assert.equal(isAllowedLocalBindAddress(address), false, address);
  }
});

test("更新绑定地址时保留其他环境值且去除重复键", () => {
  const input = "CATNIP_SESSION_SECRET=do-not-print\nCATNIP_BIND_ADDRESS=127.0.0.1\nCATNIP_BIND_ADDRESS=10.0.0.2\n";
  const output = updateBindAddress(input, "192.168.120.107");

  assert.match(output, /CATNIP_SESSION_SECRET=do-not-print/);
  assert.equal(output.match(/CATNIP_BIND_ADDRESS=/g)?.length, 1);
  assert.match(output, /CATNIP_BIND_ADDRESS=192\.168\.120\.107/);
});

test("更新函数拒绝全网卡和公网地址", () => {
  assert.throws(() => updateBindAddress("", "0.0.0.0"), /只允许/);
  assert.throws(() => updateBindAddress("", "203.0.113.10"), /只允许/);
});
