import type { User } from "@/types/User";
import { skills } from "./skill.mock";
import { experiences } from "./experience.mock";
import user1 from "@/assets/illustration/user1.png";

export const mockUser: User[] = [
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "Đang tìm việc",
    skills: skills,
    experience: experiences,
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "Đang có việc",
    skills: skills,
    experience: experiences,
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "ang có việc",
    skills: skills,
    experience: experiences,
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "ang có việc",
    skills: skills,
    experience: experiences,
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "Đang tìm việc",
    skills: skills,
    experience: [],
  },
];
