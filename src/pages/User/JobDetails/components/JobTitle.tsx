import type { Job } from "@/types/Job";
import companyDefault from "@/assets/illustration/company.png";
import { Bookmark, Send } from "lucide-react";

export const JobTitle = ({ job }: { job: Job }) => {
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row justify-start gap-2">
        <img
          src={job?.recruiter?.avatar || companyDefault}
          className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px]  md:w-[96px] md:h-[96px] rounded-full object-cover object-center"
        />
        <div className="flex flex-col justify-center gap-1 md:justify-start md:gap-3 md:py-2">
          <div className="font-bold text-primary text-lg sm:text-2xl md:text-3xl">
            {job?.title}
          </div>
          <div className="text-xs text-zinc-500 sm:text-sm">
            tại {job?.recruiter?.name}
          </div>
        </div>
      </div>
      <div className="flex flex-row justfiy-end gap-2">
        <button className="rounded-[10px] bg-[#EFE9FD] w-[40px] h-[40px] flex items-center justify-center shadow-sm  hover:shadow-lg hover:scale-[1.01] group transition-all duration-500 cursor-pointer">
          <Bookmark className="w-[20px] text-primary  group-hover:fill-primary transition-all duration-500 " />
        </button>
        <button className="rounded-[10px] bg-primary w-[40px] h-[40px] flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-[1.01] sm:w-fit sm:px-5 hover:bg-[#38128A] transition-all duration-500 cursor-pointer">
          <div className="flex flex-row items-center justify-center gap-2">
            <span className="hidden sm:block text-white text-sm">
              {" "}
              Ứng tuyển
            </span>{" "}
            <Send className="w-[20px] text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};
