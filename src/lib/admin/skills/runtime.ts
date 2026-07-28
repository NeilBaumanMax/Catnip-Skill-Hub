import { runtimeSkillRepository } from "@/lib/data/skills";
import { DefaultAdminSkillService } from "./service";

export const adminSkillService = new DefaultAdminSkillService(runtimeSkillRepository);
