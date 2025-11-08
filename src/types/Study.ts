import type { University } from "./University";

export type Study = {
  id: string;
  university: University;
  startDate: Date;
  endDate: Date;
  major?: string;
  degree?: string;
};

export type CreateStudyData = {
  userId: string;
  universityId: string;
  major?: string | null;
  degree: string;
  startDate: string;
  endDate?: string | null;
};
