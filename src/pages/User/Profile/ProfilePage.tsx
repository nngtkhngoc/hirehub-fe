import { BasicInfor } from "./components/layout/BasicInfor";
import { DetailsInfor } from "./components/layout/DetailsInfor";
import { Experiences } from "./components/layout/Experiences";
import { RecommendedJobs } from "./components/layout/RecommendedJobs";
import { RecommendedUsers } from "./components/layout/RecommendedUsers";
import { Resume } from "./components/layout/Resume";
import { SkillsAndLanguages } from "./components/layout/SkillsAndLanguages";
import { Study } from "./components/layout/Study";

export const ProfilePage = () => {
  return (
    <div className="flex flex-row py-40">
      <div className="flex flex-col items-center w-full">
        <BasicInfor />
        <DetailsInfor />
        <Resume />
        <Experiences />
        <Study />
        <SkillsAndLanguages />
      </div>
      <div className="md:flex md:flex-col hidden md:block">
        <RecommendedJobs />
        <RecommendedUsers />
      </div>
    </div>
  );
};
