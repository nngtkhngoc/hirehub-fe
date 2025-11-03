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
  github: string; // link GitHub cá nhân
  phoneNumber: string; // số điện thoại
  resumeLink: string; // link tới CV hoặc portfolio
  languages: Language[];
  study: Study[]; // học vấn
  introduction: string;
  position: string;
};
