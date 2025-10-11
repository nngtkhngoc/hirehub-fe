import type { ReactNode } from "react";

interface BannerProps {
  title: ReactNode;
  description: string;
  illustration: string;
}

export const Banner = ({ title, description, illustration }: BannerProps) => {
  return (
    <div className="w-full h-[650px] bg-gradient-to-b from-[#F6F2FE] to-[#ECE4FF] flex flex-col justify-center gap-3 px-10 md:px-12 lg:px-40 md:flex-row py-[120px] lg:gap-30 md:h-[420px]">
      <div className="flex flex-col gap-3 justify-start items-start">
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
    </div>
  );
};
