import { getAllProvinces } from "@/apis/map.api";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search } from "lucide-react";
import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrimaryButton } from "@/components/ui/User/Button";
import { useMediaQuery } from "@mui/material";
interface BannerProps {
  title: ReactNode;
  description: string;
  illustration: string;
  type: string;
}

export const Banner = ({
  title,
  description,
  illustration,
  type,
}: BannerProps) => {
  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });

  const isMedium = useMediaQuery("(min-width:768px)");

  return (
    <div className="relative w-full h-[650px] bg-gradient-to-b from-[#F6F2FE] to-[#ECE4FF] flex flex-col justify-center gap-3 px-10 md:px-12 lg:px-30 xl:px-40 md:flex-row py-[140px] lg:gap-30 md:h-[450px]">
      <div className="flex flex-col gap-2 justify-start items-start">
        {title}

        <div className="text-[12px] font-light text-[#7A7D87] leading-[22px] md:text-[16px] md:leading-[30px]">
          {description}
        </div>
      </div>
      <img
        src={illustration}
        alt={illustration}
        className="max-w-250px max-h-[250px] lg:w-[435px] lg:h-[330px]"
      />

      <div
        className="absolute bg-white -bottom-5 left-1/2 -translate-x-1/2 
 h-[48px] rounded-[30px] shadow-[0px_4px_19px_#A6A6A6]
  flex flex-row w-4/5 lg:w-1/2 justify-between"
      >
        <div className="flex flex-row items-center gap-3 pl-4 text-[#888888] border-r-2 my-2 w-3/4 md:w-1/2">
          <Search size={23} />
          <input
            className="text-[13px] w-4/5 focus:outline-none placeholder:text-[#888888] text-black"
            type="text"
            placeholder={
              isMedium ? `Gõ từ khóa để tìm kiếm ${type}...` : "Gõ từ khóa..."
            }
          />
        </div>

        <div className="flex flex-row items-center gap-2  px-2 text-[#888888]  my-2 md:justify-between md:1/2">
          <MapPin size={23} />
          <Select>
            <SelectTrigger className="!border-none !shadow-none !px-0 text-[13px] text-black placeholder:text-[#888888] data-[placeholder]:text-[#888888]">
              <SelectValue placeholder="Chọn địa chỉ" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Địa chỉ</SelectLabel>
                {provinces?.map((province) => (
                  <SelectItem
                    key={province.code}
                    value={province.name}
                    className="text-black"
                  >
                    {province.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="w-fit hidden md:block pl-4">
            <PrimaryButton label="Tìm kiếm" textSize="text-[12px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
