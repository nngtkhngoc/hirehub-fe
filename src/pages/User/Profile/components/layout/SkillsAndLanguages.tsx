import { PartTitle } from "../ui/PartTitle";
import { SkillCard } from "../ui/SkillCard";
import { LanguageCard } from "../ui/LanguageCard";
import type { UserProfile } from "@/types/Auth";

export const SkillsAndLanguages = ({ user }: { user: UserProfile }) => {
  const renderSkills = () =>
    user.skills?.map((skill) => <SkillCard text={skill.name} />);

  const renderLanguages = () =>
    user.languages?.map((language: any) => (
      <LanguageCard language={language} />
    ));

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <PartTitle text="Kĩ năng" />
        <div className="gap-3 w-4/5 flex flex-row flex-wrap pt-4">
          {renderSkills()}
        </div>
      </div>
      <div className="flex flex-col w-full">
        <PartTitle text="Ngôn ngữ" />
        <div className="gap-3 w-full flex flex-row flex-wrap py-4">
          {renderLanguages()}
        </div>
      </div>
    </div>
  );
};
