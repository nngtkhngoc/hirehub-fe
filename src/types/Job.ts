import type { Recruiter } from "./Recruiter";

export type Job = {
  recruiter: Recruiter;
  title: string;
  level: string;
  description: string;
  postingDate: Date;
  workspace: string;
};
