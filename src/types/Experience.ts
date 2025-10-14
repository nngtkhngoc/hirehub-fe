import type { Recruiter } from "./Recruiter";

export type Experience = {
  company: Recruiter;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
  image: string;
};
