import type { Recruiter } from "@/types/Recruiter";
import { useMediaQuery } from "@mui/material";
import { ArrowRight, BellPlus, Building } from "lucide-react";

interface CompanyCardProps {
  company: Recruiter;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const isLarge = useMediaQuery("(min-width:1024px)");

  return (
    <div className="w-[345px] h-[155px] rounded-[30px] border border-[#E0E0E0] bg-white flex flex-col px-5 py-4 flex items-center justify-center lg:w-[510px] lg:h-[215px] group hover:bg-primary transition-all duration-300 hover:shadow-[0_4px_4px_#DFD2FA] hover:scale-[1.02]">
      <div className=" flex flex-row gap-5 items-center">
        <div className="w-[85px] h-[85px] rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center  object-cover overflow-hidden lg:w-[130px] lg:h-[130px] bg-white">
          {company.avatar ? (
            <img
              src={company.avatar}
              alt={company.avatar}
              className="w-[85px] h-[85px]  object-cover overflow-hidden"
            />
          ) : (
            <Building className="w-[85px] h-[85px]" />
          )}
        </div>

        <div className="flex flex-col items-start justify-between flex-1 gap-1 lg:gap-2 group">
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-col items-left justify-start h-full ">
              <div className="font-bold text-[22px] text-primary h-[44px] text-ellipsis line-clamp-1 lg:text-[24px] group-hover:text-white w-[270px]">
                {company.name}
              </div>
              <div className="text-[13px] text-[#A6A6A6] lg:text-[14px] group-hover:text-[#A6A6A6]">
                {company.address}
              </div>
            </div>

            <div className="w-[25px] h-[25px] rounded-full border boder-[#A6A6A6] bg-[#F7F6F8] flex justify-center items-center lg:w-[30px] lg:h-[30px]">
              <BellPlus className="text-[#A6A6A6]" size={isLarge ? 18 : 13} />
            </div>
          </div>

          <div className="text-[12px] text-[#888888] !text-left leading-[20px] h-[50px] line-clamp-2 text-ellipsis lg:text-[14px] lg:leading-[24px] group-hover:text-[#DBDBDB] ">
            {company.description}
          </div>

          <div className="text-primary flex flex-row justify-start gap-3 items-center justify-left w-full  group-hover:text-white cursor-pointer">
            <span className="text-[11px] lg:text-[14px] ">Xem thêm</span>
            <ArrowRight size={isLarge ? 18 : 12} />
          </div>
        </div>
      </div>
    </div>
  );
};
