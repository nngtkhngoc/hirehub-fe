import type { Experiene } from "./Experience";
import type { Skill } from "./Skill";

export type Language = {
  name: string;
  level: string; // ví dụ: "Beginner" | "Intermediate" | "Advanced" | "Fluent"
};

export type Study = {
  university: string;
  logo: string;
  startDate: string; // format: "YYYY-MM" hoặc "DD/MM/YYYY"
  endDate: string; // hoặc "Present" nếu đang học
  major?: string; // optional: ngành học
  degree?: string; // optional: cử nhân, thạc sĩ,...
};

export type User = {
  id: string;
  email: string;
  name: string;
  address: string;
  avatar: string;
  status: string;
  skills: Skill[];
  experience: Experiene[];
  position: string;
  github: string; // link GitHub cá nhân
  phoneNumber: string; // số điện thoại
  resumeLink: string; // link tới CV hoặc portfolio
  languages: Language[];
  study: Study; // học vấn
  introduction: string;
};
