import type { Job } from "@/types/Job";
import { OutlineButton } from "./Button";

export const JobLandingPage = ({ job }: { job: Job }) => {
  return (
    <div className="w-[280px] sm:w-[320px] h-[322px] rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.25)] px-5 py-5 space-y-2 bg-white hover:bg-primary cursor-pointer transition-all duration-300 group">
      <div className="flex flex-row items-center gap-5">
        <div className="w-[53px] h-[53px] flex items-center justify-center rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <img
            src={job.recruiter.logo}
            alt={job.recruiter.name}
            className="w-[26px] h-[26px]"
          />
        </div>
        <div className="flex flex-col items-start justify-around">
          <div className="text-[18px] font-bold group-hover:text-white">
            {" "}
            {job.recruiter.name}
          </div>
          <div className="text-[#A6A6A6] text-[16px] ">{job.workspace}</div>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-primary ">
        <h4 className="text-[24px] font-bold group-hover:text-secondary">
          {job.title}
        </h4>
        <div className="text-[13px] leading-[24px] group-hover:text-white">
          {job.level}
        </div>
      </div>

      <div className="text-[13px] leading-[24px] text-[#7A7D87] overflow-hidden text-ellipsis group-hover:text-white">
        {job.description}
      </div>
      <div className="float-right">
        <OutlineButton
          label="Ứng tuyển ngay"
          textSize="text-[14px]"
          paddingX="px-4"
          paddingY="py-1.5"
          hoverBgColor="hover:bg-[#DFD2FA]"
        />
      </div>
    </div>
  );
};
