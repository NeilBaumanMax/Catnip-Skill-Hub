import assert from "node:assert/strict";
import test from "node:test";
import { discoverSkills } from "../src/lib/discovery";
import { getPublishedSkills, type SkillResource } from "../src/lib/domain/skills";

function withGovernance(skill: SkillResource, governance: Partial<SkillResource["governance"]>): SkillResource {
  return { ...skill, governance: { ...skill.governance, ...governance } };
}

test("搜索覆盖中文标题、原始名称、简介、作者和标签", () => {
  assert.deepEqual(discoverSkills({ query: "产品想法安全" }).items.map((skill) => skill.slug), ["idea-to-production-vibecoding"]);
  assert.deepEqual(discoverSkills({ query: "APPLE-DESIGN" }).items.map((skill) => skill.slug), ["apple-design"]);
  assert.deepEqual(discoverSkills({ query: "Catnip 薄荷猫" }).items.map((skill) => skill.slug), ["idea-to-production-vibecoding"]);
  assert.deepEqual(discoverSkills({ query: "Emil Kowalski" }).items.map((skill) => skill.slug), ["apple-design"]);
  assert.deepEqual(discoverSkills({ query: "PPTX" }).items.map((skill) => skill.slug), ["dashi-ppt"]);
});

test("公开目录只保留三个正式 Skill，且图片、来源、许可与审核状态完整", () => {
  const published = getPublishedSkills();
  assert.deepEqual(
    [...published.map((skill) => skill.slug)].sort(),
    ["apple-design", "dashi-ppt", "idea-to-production-vibecoding"],
  );

  for (const skill of published) {
    assert.equal(skill.images.length, 2);
    assert.ok(skill.images.every((image) => image.url?.startsWith(`/skills/${skill.slug}/`)));
    assert.match(skill.source.sourceCommit ?? "", /^[0-9a-f]{40}$/);
    assert.notEqual(skill.source.license, "待管理员在正式发布前确认");
    assert.equal(skill.governance.reviewState, "reviewed");
    assert.equal(skill.governance.downloadEnabled, true);
    assert.equal(skill.governance.pinned, true);
  }
});

test("分类、标签和关键词可组合且无效条件不会污染结果", () => {
  const result = discoverSkills({ query: "产品", category: "产品与项目管理", tags: ["VibeCoding"] });
  assert.deepEqual(result.items.map((skill) => skill.slug), ["idea-to-production-vibecoding"]);
  assert.equal(result.filters.category, "产品与项目管理");
  assert.deepEqual(result.filters.tags, ["VibeCoding"]);

  const invalid = discoverSkills({ category: "不存在的分类", tags: ["不存在的标签"] });
  assert.equal(invalid.filters.category, undefined);
  assert.deepEqual(invalid.filters.tags, []);
  assert.equal(invalid.mode, "recommended");
});

test("多标签采用全部满足语义并规范化重复值", () => {
  const result = discoverSkills({ tags: ["VibeCoding", "工程治理", " VibeCoding "] });

  assert.deepEqual(result.filters.tags, ["VibeCoding", "工程治理"]);
  assert.deepEqual(result.items.map((skill) => skill.slug), ["idea-to-production-vibecoding"]);
  assert.ok(result.items.every((skill) => result.filters.tags.every((tag) => skill.tags.includes(tag))));
});

test("筛选结果稳定排序且不返回隐藏或未发布资源", () => {
  const seeds = getPublishedSkills();
  const resources = [
    withGovernance(seeds[0], { hidden: true }),
    withGovernance(seeds[1], { publishStatus: "draft" }),
    ...seeds.slice(2),
  ];
  const result = discoverSkills({ query: "a" }, () => 0.5, resources);
  assert.equal(result.items.some((skill) => skill.slug === seeds[0].slug), false);
  assert.equal(result.items.some((skill) => skill.slug === seeds[1].slug), false);
  assert.deepEqual(
    result.items.map((skill) => skill.title),
    [...result.items.map((skill) => skill.title)].sort((a, b) => a.localeCompare(b, "zh-CN")),
  );
});

test("默认推荐遵守推荐池、正权重和置顶治理字段", () => {
  const seeds = getPublishedSkills();
  const resources = [
    withGovernance(seeds[0], { pinned: true, recommendationWeight: 1 }),
    withGovernance(seeds[1], { inRecommendationPool: false }),
    withGovernance(seeds[2], { pinned: false, recommendationWeight: 10 }),
  ];
  const result = discoverSkills({}, () => 0.5, resources);
  assert.equal(result.mode, "recommended");
  assert.deepEqual(result.items.map((skill) => skill.slug), [seeds[0].slug, seeds[2].slug]);
});

test("随机源可注入且不会修改输入目录", () => {
  const resources = getPublishedSkills();
  const original = resources.map((skill) => skill.slug);
  const values = [0.1, 0.9, 0.5];
  const result = discoverSkills({}, () => values.shift() ?? 0.5, resources);
  assert.notDeepEqual(result.items.map((skill) => skill.slug), original);
  assert.deepEqual(resources.map((skill) => skill.slug), original);
});
