import { getPublishedSkills } from "@/lib/domain/skills";
import { InMemorySkillRepository } from "./in-memory";

const globalRepository = globalThis as typeof globalThis & {
  catnipSkillRepository?: InMemorySkillRepository;
};

export const runtimeSkillRepository =
  globalRepository.catnipSkillRepository ?? new InMemorySkillRepository(getPublishedSkills());

globalRepository.catnipSkillRepository = runtimeSkillRepository;
