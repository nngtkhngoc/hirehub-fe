import type { Recruiter } from "./Recruiter";
import type { Skill } from "./Skill";

export type Job = {
  id: string;
  title: string;
  description: string;
  level: string;
  isBanned: boolean | null;
  workspace: string;
  postingDate: string;
  skilss: Skill[];
  recruiter: Recruiter;
  type: string;
  address: string;
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

export type ApplyJobFormData = {
  jobId: string;
  userId: string;
  cover_letter?: string | null;
  resumeFile: File;
};

export type SaveJobData = {
  jobId: string;
  userId: string;
  interaction: string;
};

export type ApplyJob = {
  id: number;
  link: string;
  status: string;
  coverLetter: string | null;
  createdAt: string | null;
  user: {
    id: number;
    email: string;
    name: string;
    address: string | null;
    avatar: string | null;
    position: string | null;
    status: string | null;
    resume_name: string | null;
  };
  job: Job;
};

export type SavedJob = {
  id: number;
  user: {
    id: number;
    email: string;
    name: string;
    address: string | null;
    avatar: string | null;
    position: string | null;
    status: string | null;
    resume_name: string | null;
  };
  job: Job;
  interaction: string;
};
