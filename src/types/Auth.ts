/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Experience } from "./Experience";
import type { Skill } from "./Skill";
import type { Study } from "./Study";
import type { Language } from "./User";

export type SignInData = {
  email: string;
  password: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  address: string | null;
  description: string | null;
  isVerified: boolean;
  isBanned: false;
  role: {
    id: string;
    action: string;
    name: string;
    resource: string;
  };
  skills: Skill[];
  experiences: Experience[];
  github: string;
  phoneNumber: string;
  resumeLink: string;
  languages: any;
  resume_link: string;
  resume_name: string;
  studies: Study[];
  introduction: string;
  position: string;
  avatarFile?: File | undefined;
  openAiResumeId?: string;
  field?: string | null;
  numberOfEmployees?: string | null;
  foundedYear?: number | null;
};

export type UserFormData = {
  id: string;
  name?: string | null;
  address?: string | null;
  description?: string | null;

  github?: string;
  phoneNumber?: string;
  resume?: File;
  resume_name: string;
  introduction?: string;
  position?: string;

  avatar?: File | null;
  skills?: Skill[];
  experiences?: Experience[];
  languages?: Language[];
  study?: Study[];
};

export type SignUpCandidateData = {
  email: string;
  name: string;
  password: string;
};

export type SignUpRecruiterData = {
  email: string;
  name: string;
  foundedYear: number | undefined;
  numberOfEmployees: string | undefined;
  password: string;
};
