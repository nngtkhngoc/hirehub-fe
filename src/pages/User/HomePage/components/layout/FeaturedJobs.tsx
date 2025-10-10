import { JobLandingPage } from "@/components/ui/User/JobLandingPage";
import { HighlightText } from "@/components/ui/User/HighlightText";
import { PrimaryButton } from "@/components/ui/User/Button";
import { NoteCircle } from "../ui/NoteCircle";
import type { Job } from "@/types/Job";
import shopee from "@/assets/icons/shopee.png";

import { Search } from "lucide-react";
import type { Recruiter } from "@/types/Recruiter";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const FeaturedJobs = () => {
  const recruiter: Recruiter = {
    name: "Shopee",
    logo: shopee,
  };
  const jobs: Job[] = [
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
    {
      recruiter: recruiter,
      title: "Backend Developer",
      level: "Internship",
      description:
        "Xây dựng và duy trì hệ thống phía server, thiết kế API, quản lý cơ sở dữ liệu và đảm bảo hiệu năng, bảo mật cho toàn bộ ứng dụng.",
      postingDate: new Date(),
      workspace: "NYC, America",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center py-10 gap-5 bg-[#F7F6F8]">
      <div className="flex flex-row justify-center items-center">
        <NoteCircle text="Job" />
      </div>

      <HighlightText text="CÔNG VIỆC NỔI BẬT" />

      <div className="flex flex-row justify-around items-center gap-[12px] lg:gap-[20px] lg:justify-between">
        <div className="flex flex-row justify-around items-center bg-white rounded-[30px] w-[210px] h-[40px] shadow-[0_4px_4px_0_#DFD2FA] lg:w-[300px]">
          <div className="text-[12px] lg:text-[14px] text-[#7A7D87] lg:flex lg:flex-row lg:items-center ">
            Tìm kiếm việc làm<span className="hidden lg:block">...</span>
          </div>
          <Search size={18} className="hover:cursor-pointer" />
        </div>
        <PrimaryButton
          label="Tìm kiếm"
          paddingY="py-[11px]"
          textSize="text-[12px] lg:text-[14px]"
          paddingX="lg:px-[30px]"
        />
      </div>
      <Carousel className="md:w-4/5 flex items-center justify-center w-[280px] pt-5">
        <CarouselContent>
          {jobs.map((job) => (
            <CarouselItem className="basis-1/3 h-[360px] pr-10 w-[280px]">
              <JobLandingPage job={job} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
