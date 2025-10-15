import type { Study } from "@/types/User";

export const StudyCard = ({
  study,
  lastCard,
}: {
  study: Study;
  lastCard: boolean;
}) => {
  return (
    <div
      className={`w-full py-6 flex flex-row items-center gap-4 justify-left ${
        lastCard ? "" : "border-b border-[#BCBCBC]"
      }`}
    >
      <div className="rounded-full border-2 border-[#F2F2F2] w-[60px] h-[60px] overflow-hidden flex items-center justify-center shrink-0">
        <img
          src={study.logo}
          alt={study.university}
          className="object-contain w-[30px] h-[30px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[18px] font-bold"> {study.university}</div>
        <div className="flex flex-col gap-1">
          <div className="text-[14px] text-[#888888] font-regular">
            {study.major}
          </div>
          <div className="flex flex-row items-center justify-left gap-1 sm:gap-3">
            <div className="text-[12px] font-regular text-[#a6a6a6]">
              T{study.startDate.getMonth()}/{study.startDate.getFullYear()} - T
              {study.endDate.getMonth()}/{study.endDate.getFullYear()}{" "}
            </div>
            <div className="text-[12px] font-regular text-[#a6a6a6]">•</div>
            <div className="text-[12px] font-regular text-[#a6a6a6]">
              {study.degree}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
