import type { Experience } from "./Experience";
import type { Skill } from "./Skill";
import type { Study } from "./Study";

export type Language = {
  level: string;
  language: Language;
};

export type User = {
  id: string;
  email: string;
  name: string;
  address: string;
  avatar: string;
  status: string;
  skills: Skill[];
  experience: Experience[];
  position: string;
  github: string;
  phoneNumber: string;
  resume_link: string;
  languages: Language[];
  studies: Study[];
  introduction: string;
  description: string;
};
