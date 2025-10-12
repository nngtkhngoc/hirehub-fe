import type { LucideIcon } from "lucide-react";
import { useMediaQuery } from "@mui/material";

export interface Category {
  icon: LucideIcon;
  title: string;
  positions: string;
}

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const isLarge = useMediaQuery("(min-width:1024px)");

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-[160px] h-[150px] rounded-[10px] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.3)] lg:flex-row lg:w-[283px] lg:h-[115px] lg:justify-start lg:px-5 lg:gap-5 hover:bg-[#EFE9FD] cursor-pointer transition-all duration-400">
      <div className="w-[60px] h-[60px] rounded-[15px] bg-[#7E4BEB] flex items-center justify-center lg:w-[80px] lg:h-[80px]">
        <category.icon className="text-white" size={isLarge ? 50 : 40} />
      </div>

      <div className="flex flex-col items-center justify-center lg:justify-between lg:items-start lg:gap-1">
        <div className="font-title text-[16px] font-bold text-[#5E1EE6]">
          {category.title}
        </div>
        <p className="text-[12px] text-[#A6A6A6]">
          {category.positions} open positions
        </p>
      </div>
    </div>
  );
};
