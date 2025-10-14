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
    github: "https://github.com/khanhngoc",
    phoneNumber: "+84 912 345 678",
    resumeLink: "https://example.com/resume/khanhngoc.pdf",
    languages: [
      { name: "Vietnamese", level: "Native" },
      { name: "English", level: "Intermediate" },
    ],
    study: [
      {
        university: "University of Information Technology - VNUHCM",
        logo: "https://upload.wikimedia.org/wikipedia/vi/3/3e/Logo_UIT_updated.png",
        startDate: new Date("2020-09"),
        endDate: new Date("2024-06"),
        major: "Computer Science",
        degree: "Bachelor's Degree",
      },
      {
        university: "Ho Chi Minh City University of Science (HCMUS)",
        logo: "https://upload.wikimedia.org/wikipedia/vi/d/d6/HCMUS_logo.png",
        startDate: new Date("2019-09"),
        endDate: new Date("2023-06"),
        major: "Software Engineering",
        degree: "Bachelor's Degree",
      },
    ],
    introduction:
      "Xin chào, tôi là Ngọc, một người nhiệt huyết, chú trọng chi tiết và luôn đam mê với công nghệ cũng như việc học hỏi không ngừng. Tôi thích làm việc trong môi trường năng động và mong muốn đóng góp vào những dự án có ý nghĩa, tạo ra giá trị thực. Rất vui được làm quen với mọi người!",
  },
  {
    id: "u002",
    email: "tri.quang@example.com",
    name: "Quang Tri",
    address: "TP. Hồ Chí Minh, Việt Nam",
    avatar: user2,
    status: "Đang tìm việc",
    skills: skills,
    experience: experiences,
    position: "Backend Developer",
    github: "https://github.com/quangtri",
    phoneNumber: "+84 913 456 789",
    resumeLink: "https://example.com/resume/quangtri.pdf",
    languages: [
      { name: "Vietnamese", level: "Native" },
      { name: "English", level: "Upper-Intermediate" },
    ],
    study: [
      {
        university: "Ho Chi Minh City University of Science (HCMUS)",
        logo: "https://upload.wikimedia.org/wikipedia/vi/d/d6/HCMUS_logo.png",
        startDate: new Date("2019-09"),
        endDate: new Date("2023-06"),
        major: "Software Engineering",
        degree: "Bachelor's Degree",
      },
    ],
    introduction:
      "Backend Developer với niềm yêu thích hệ thống hiệu năng cao, bảo mật và kiến trúc RESTful API. Quan tâm tới Node.js, NestJS và cơ sở dữ liệu phân tán.",
  },
  {
    id: "u003",
    email: "linh.tran@example.com",
    name: "Tran Linh",
    address: "Hà Nội, Việt Nam",
    avatar: profile,
    status: "Đang có việc",
    skills: skills,
    experience: [experiences[0], experiences[1]],
    position: "Fullstack Developer",
    github: "https://github.com/linhtran",
    phoneNumber: "+84 915 678 901",
    resumeLink: "https://example.com/resume/linhtran.pdf",
    languages: [
      { name: "Vietnamese", level: "Native" },
      { name: "English", level: "Fluent" },
      { name: "Japanese", level: "JLPT N3" },
    ],
    study: [
      {
        university: "Hanoi University of Science and Technology (HUST)",
        logo: "https://upload.wikimedia.org/wikipedia/vi/1/12/Logo_BK_HN.png",
        startDate: new Date("2018-09"),
        endDate: new Date("2022-06"),
        major: "Information Technology",
        degree: "Bachelor's Degree",
      },
    ],
    introduction:
      "Fullstack Developer với nền tảng kỹ thuật mạnh về cả frontend và backend. Mình thích giải quyết vấn đề thực tế bằng công nghệ, đặc biệt trong lĩnh vực web và SaaS.",
  },
];
