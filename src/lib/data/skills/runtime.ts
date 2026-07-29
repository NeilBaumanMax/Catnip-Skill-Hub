import { getPublishedSkills } from "@/lib/domain/skills";
import { getRuntimeDatabase, isPersistentRuntime } from "@/lib/data/db";
import { InMemorySkillRepository } from "./in-memory";
import { PostgresSkillRepository } from "./postgres";
import type { SkillRepository } from "./repository";

const globalRepository = globalThis as typeof globalThis & {
  catnipSkillRepository?: SkillRepository;
};

export const runtimeSkillRepository =
  globalRepository.catnipSkillRepository ?? (isPersistentRuntime()
    ? new PostgresSkillRepository(getRuntimeDatabase().db)
    : new InMemorySkillRepository(getPublishedSkills()));

globalRepository.catnipSkillRepository = runtimeSkillRepository;
