import type { User } from "@/types/User";
import { skills } from "./skill.mock";
import { experiences } from "./experience.mock";
import user1 from "@/assets/illustration/user1.png";
import user2 from "@/assets/illustration/userlist.png";
import profile from "@/assets/illustration/profile.png";

export const users: User[] = [
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "Đang tìm việc",
    skills: skills,
    experience: experiences,
    position: "Frontend Developer",
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user2,
    status: "Đang tìm việc",
    skills: skills,
    experience: experiences,
    position: "Backend Developer",
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: profile,
    status: "Đang tìm việc",
    skills: skills,
    experience: experiences,
    position: "Fullstack Developer",
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Khanh Ngoc",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "",
    skills: skills,
    experience: experiences,
    position: "Fullstack Developer",
  },
  {
    id: "u001",
    email: "ngoc.khanh@example.com",
    name: "Quang Tri",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user1,
    status: "Đang có việc",
    skills: skills,
    experience: [experiences[2]],
    position: "Fullstack Developer",
  },
];
