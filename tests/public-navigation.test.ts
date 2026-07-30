import assert from "node:assert/strict";
import test from "node:test";
import { resolvePublicNavigationSelection, sectionFromHash } from "../src/app/_components/public-navigation";

test("首页导航能从哈希和可见区域解析唯一选中项", () => {
  assert.equal(resolvePublicNavigationSelection({ pathname: "/" }), "home");
  assert.equal(resolvePublicNavigationSelection({ pathname: "/", hash: "#categories", visibleSection: "home" }), "categories");
  assert.equal(resolvePublicNavigationSelection({ pathname: "/", visibleSection: "explore" }), "explore");
  assert.equal(resolvePublicNavigationSelection({ pathname: "/", visibleSection: "about" }), "about");
});

test("独立推荐页与 Skill 详情页使用路径上下文", () => {
  assert.equal(resolvePublicNavigationSelection({ pathname: "/recommend", hash: "#about" }), "recommend");
  assert.equal(resolvePublicNavigationSelection({ pathname: "/skills/project-brief" }), "explore");
  assert.equal(resolvePublicNavigationSelection({ pathname: "/admin" }), null);
});

test("只接受公共首页约定的锚点", () => {
  assert.equal(sectionFromHash("#page-top"), "home");
  assert.equal(sectionFromHash("#skill-grid"), "explore");
  assert.equal(sectionFromHash("#categories"), "categories");
  assert.equal(sectionFromHash("#about"), "about");
  assert.equal(sectionFromHash("#unknown"), undefined);
});
