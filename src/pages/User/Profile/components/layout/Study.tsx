import type { User } from "@/types/User";
import { PartTitle } from "../ui/PartTitle";
import { experiences } from "@/mock/experience.mock";
import { StudyCard } from "../ui/StudyCard";

export const Study = ({ user }: { user: User }) => {
  const renderStudies = () =>
    user.study.map((std, index) => (
      <StudyCard
        study={std}
        lastCard={index == user.study.length - 1 ? true : false}
      />
    ));

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <PartTitle text="Lời giới thiệu" />
        <div className=" flex-col gap-4">{renderStudies()}</div>
      </div>
    </div>
  );
};
