import type { Job } from "@/types/Job";
import { Bookmark } from "lucide-react";
import { Link } from "react-router";
import companyDefault from "@/assets/illustration/company.png";

export const FlexibleJobCard = ({ job }: { job: Job }) => {
  // const daysAgo = Math.floor(
  //   (new Date().getTime() - new Date(job.postingDate).getTime()) /
  //     (1000 * 60 * 60 * 24)
  // );

  // let postedText = "";
  // if (daysAgo === 0) postedText = "Đã đăng hôm nay";
  // else if (daysAgo === 1) postedText = "Đã đăng hôm qua";
  // else postedText = `Đã đăng ${daysAgo} ngày trước`;

  return (
    <Link to={`/job-details/${job.id}`}>
      <div className="w-full h-full rounded-[10px] px-5 py-5 space-y-2 bg-white hover:bg-primary cursor-pointer transition-all duration-300 group border border-[#DBDBDB] hover:shadow-[0_4px_4px_#DFD2FA] hover:scale-[1.02]">
        <div className="w-full space-y-2 pb-4 border-b-2 border-[#C7C7C7]">
          <div className="flex flex-row justify-between items-center gap-5">
            <div className="flex flex-row items-center gap-5">
              <div className="w-[53px] h-[53px] flex items-center justify-center rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white overflow-hidden">
                <img
                  src={job.recruiter?.avatar || companyDefault}
                  alt={job.recruiter.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start justify-around ">
                <div className="text-[18px] font-bold group-hover:text-white text-ellipsis line-clamp-1">
                  {" "}
                  {job.recruiter?.name}
                </div>{" "}
                <div className="text-[#A6A6A6] text-[14px] ">
                  {job.workspace}
                </div>
              </div>
            </div>

            <Bookmark size={21} className="text-[#A6A6A6]" />
          </div>
          <div className="flex flex-col gap-1 text-primary ">
            <h4 className="text-[24px] font-bold group-hover:text-secondary text-ellipsis line-clamp-2 h-[70px]">
              {job.title}
            </h4>
            <div className="text-[13px] leading-[24px] group-hover:text-white">
              {job.level}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
