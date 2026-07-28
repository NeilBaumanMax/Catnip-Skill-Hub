import assert from "node:assert/strict";
import test from "node:test";
import { discoverSkills } from "../src/lib/discovery";
import { getPublishedSkills, type SkillResource } from "../src/lib/domain/skills";

function withGovernance(skill: SkillResource, governance: Partial<SkillResource["governance"]>): SkillResource {
  return { ...skill, governance: { ...skill.governance, ...governance } };
}

test("搜索覆盖中文标题、原始名称、简介、作者和标签", () => {
  assert.deepEqual(discoverSkills({ query: "思考得更深" }).items.map((skill) => skill.slug), ["deeper-reasoning"]);
  assert.deepEqual(discoverSkills({ query: "HARDWARE-PROTOTYPE-PACK" }).items.map((skill) => skill.slug), ["hardware-prototype"]);
  assert.ok(discoverSkills({ query: "Catnip 薄荷猫" }).items.length >= 10);
  assert.deepEqual(discoverSkills({ query: "I2C" }).items.map((skill) => skill.slug), ["sensor-debug"]);
});

test("分类、标签和关键词可组合且无效分类不会污染结果", () => {
  const result = discoverSkills({ query: "原型", category: "VibeCoding 硬件", tag: "ESP32" });
  assert.deepEqual(result.items.map((skill) => skill.slug), ["hardware-prototype"]);
  assert.equal(result.filters.category, "VibeCoding 硬件");
  assert.equal(result.filters.tag, "ESP32");

  const invalid = discoverSkills({ category: "不存在的分类" });
  assert.equal(invalid.filters.category, undefined);
  assert.equal(invalid.mode, "recommended");
});

test("筛选结果稳定排序且不返回隐藏或未发布资源", () => {
  const seeds = getPublishedSkills();
  const resources = [
    withGovernance(seeds[0], { hidden: true }),
    withGovernance(seeds[1], { publishStatus: "draft" }),
    ...seeds.slice(2),
  ];
  const result = discoverSkills({ query: "Catnip" }, () => 0.5, resources);
  assert.equal(result.items.some((skill) => skill.slug === seeds[0].slug), false);
  assert.equal(result.items.some((skill) => skill.slug === seeds[1].slug), false);
  assert.deepEqual(
    result.items.map((skill) => skill.title),
    [...result.items.map((skill) => skill.title)].sort((a, b) => a.localeCompare(b, "zh-CN")),
  );
});

test("默认推荐遵守推荐池、正权重和置顶治理字段", () => {
  const seeds = getPublishedSkills().slice(0, 4);
  const resources = [
    withGovernance(seeds[0], { pinned: true, recommendationWeight: 1 }),
    withGovernance(seeds[1], { inRecommendationPool: false }),
    withGovernance(seeds[2], { recommendationWeight: 0 }),
    withGovernance(seeds[3], { recommendationWeight: 10 }),
  ];
  const result = discoverSkills({}, () => 0.5, resources);
  assert.equal(result.mode, "recommended");
  assert.deepEqual(result.items.map((skill) => skill.slug), [seeds[0].slug, seeds[3].slug]);
});

test("随机源可注入且不会修改输入目录", () => {
  const resources = getPublishedSkills().slice(0, 3);
  const original = resources.map((skill) => skill.slug);
  const values = [0.1, 0.9, 0.5];
  const result = discoverSkills({}, () => values.shift() ?? 0.5, resources);
  assert.notDeepEqual(result.items.map((skill) => skill.slug), original);
  assert.deepEqual(resources.map((skill) => skill.slug), original);
});
