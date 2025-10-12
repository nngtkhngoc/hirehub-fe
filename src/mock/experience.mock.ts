import { recruiters } from "./recruiter.mock";

export const experiences = [
  {
    company: recruiters[0],
    position: "Frontend Developer",
    startDate: new Date("2022-03-01"),
    endDate: new Date("2023-05-30"),
    description:
      "Phát triển và tối ưu giao diện người dùng cho nền tảng thương mại điện tử, sử dụng React và TailwindCSS.",
    image: "abc",
  },
  {
    company: recruiters[1],
    position: "Software Engineer Intern",
    startDate: new Date("2021-06-01"),
    endDate: new Date("2021-12-30"),
    description:
      "Tham gia phát triển hệ thống quản lý nội bộ bằng Node.js và React, viết unit test và refactor code.",
    image: "abc",
  },
  {
    company: recruiters[3],
    position: "Software Engineer Intern",
    startDate: new Date("2021-06-01"),
    endDate: new Date("2025-12-10"),
    description:
      "Tham gia phát triển hệ thống quản lý nội bộ bằng Node.js và React, viết unit test và refactor code.",
    image: "abc",
  },
];
