import type { Experience } from "./Experience";
import type { Skill } from "./Skill";
import type { Language, Study } from "./User";

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
  study: Study[];
  introduction: string;
  position: string;
  avatarFile?: File | undefined;
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
