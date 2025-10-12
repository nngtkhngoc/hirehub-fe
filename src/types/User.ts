import type { Experiene } from "./Experience";
import type { Skill } from "./Skill";

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
};
