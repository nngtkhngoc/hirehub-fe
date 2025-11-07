import type { Experience } from "@/types/Experience";

export const ExperienceCard = ({
  experience,
  lastCard,
}: {
  experience: Experience;
  lastCard: boolean;
}) => {
  // Convert dates safely
  const startDate = experience.startDate
    ? new Date(experience.startDate)
    : null;
  const endDate = experience.endDate
    ? new Date(experience.endDate)
    : new Date();

  const calculateTime = () => {
    if (!startDate) return "N/A";

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) return `${months} tháng`;
    if (months === 0) return `${years} năm`;
    return `${years} năm ${months} tháng`;
  };

  const formatDate = (date: Date | null) =>
    date ? `T${date.getMonth() + 1}/${date.getFullYear()}` : "N/A";

  return (
    <div
      className={`w-full py-6 flex flex-row items-center gap-4 justify-left ${
        lastCard ? "" : "border-b border-[#BCBCBC]"
      }`}
    >
      <div className="rounded-full border-2 border-[#F2F2F2] w-[60px] h-[60px] overflow-hidden flex items-center justify-center shrink-0">
        <img
          src={experience?.company?.avatar || ""}
          alt={experience?.company?.name || ""}
          className="object-contain w-[30px] h-[30px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4 justify-start text-[18px] font-bold">
          <div>{experience?.company?.name}</div>
          <div className="px-3 py-1 bg-[#DFDEDE] rounded-[30px] flex items-center justify-center text-[10px] font-light">
            Fulltime
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[14px] text-[#888888] font-regular">
            {experience?.position}
          </div>

          <div className="flex flex-row items-center gap-1 sm:gap-3 text-[12px] text-[#a6a6a6]">
            <span>
              {formatDate(startDate)} •{" "}
              {experience.endDate ? formatDate(endDate) : "Hiện tại"}
            </span>
            <span>•</span>
            <span>{calculateTime()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
