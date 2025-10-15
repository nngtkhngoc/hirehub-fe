import type { User } from "@/types/User";
import { PartTitle } from "../ui/PartTitle";
import { ExperienceCard } from "../ui/ExperienceCard";
import { experiences } from "@/mock/experience.mock";

export const Experiences = ({ user }: { user: User }) => {
  const renderExperiences = () =>
    user.experience.map((ex, index) => (
      <ExperienceCard
        experience={ex}
        lastCard={index == experiences.length - 1 ? true : false}
      />
    ));

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <PartTitle text="Kinh nghiệm" />
        <div className=" flex-col gap-4">{renderExperiences()}</div>
      </div>
    </div>
  );
};
