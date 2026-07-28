import { GitHubApiClient } from "./client";
import { GitHubSkillImportService } from "./service";

export const githubSkillImportService = new GitHubSkillImportService(new GitHubApiClient());
