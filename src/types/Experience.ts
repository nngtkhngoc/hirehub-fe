import type { Recruiter } from "./Recruiter";

export type Experience = {
  id: number;
  company: Recruiter;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
  image: string;
  type: string;
};

export type CreateExperienceFormData = {
  userId: string;
  companyId: string;
  position: string;
  type: string;
  startDate: string;
  endDate?: string | null;
  image?: File | null;
  description?: string | null;
};
