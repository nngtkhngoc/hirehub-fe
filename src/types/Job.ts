import type { Recruiter } from "./Recruiter";
import type { Skill } from "./Skill";

export type Job = {
  id: string;
  title: string;
  description: string;
  level: string;
  isBanned: boolean | null;
  postingDate: Date;
  skilss: Skill[];
  recruiter: Recruiter;
};

export type CreateJobData = {
  title: string;
  level: string;
  description: string;
  workspace: string;
  recruiterId: number;
  skillsId: number[];
};

export type UpdateJobData = {
  title?: string;
  level?: string;
  description?: string;
  workspace?: string;
  recruiterId?: number;
  skillsId?: number[];
};
