import { users } from "@/mock/user.mock";
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
    <div className="flex flex-row py-40 items-center justify-center bg-[#F8F9FB]">
      <div className="flex flex-col items-center justify-center gap-10 w-9/10 md:w-4/5 lg:w-3/5">
        <BasicInfor user={users[4]} />
        <DetailsInfor />
        <Resume />
        <Experiences />
        <Study />
        <SkillsAndLanguages />
      </div>
      <div className="lg:flex lg:flex-col hidden lg:block">
        <RecommendedJobs />
        <RecommendedUsers />
      </div>
    </div>
  );
};
