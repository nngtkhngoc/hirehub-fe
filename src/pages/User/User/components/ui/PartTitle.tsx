// import { useMediaQuery } from "@mui/material";
// import { Edit3 } from "lucide-react";

export const PartTitle = ({ text }: { text: string }) => {
  // const isMedium = useMediaQuery("(min-width:768px)");
  return (
    <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
      <div className="font-bold text-[16px] md:text-[20px]">{text}</div>
      <div className=" top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]"></div>
    </div>
  );
};
