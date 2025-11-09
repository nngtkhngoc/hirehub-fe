import type { UserProfile } from "@/types/Auth";
import { Edit3 } from "lucide-react";
import { useMediaQuery } from "@mui/material";
import { LanguageCard } from "../ui/LanguageCard";
import type { Language } from "@/types/User";

export const Languages = ({ user }: { user: UserProfile }) => {
  const renderLanguages = () =>
    user?.languages?.map((language: Language) => (
      <LanguageCard language={language} />
    ));
  const isMedium = useMediaQuery("(min-width:768px)");

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
        <div className="font-bold text-[16px] md:text-[20px]">Ngôn ngữ</div>
        <div className=" top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]">
          <Edit3 size={isMedium ? 16 : 12} />
          <span>Sửa</span>
        </div>
      </div>{" "}
      <div className="gap-3 w-4/5 flex flex-row flex-wrap pt-4">
        {renderLanguages()}
      </div>
    </div>
  );
};
