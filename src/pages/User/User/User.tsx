import { RecommendedJobs } from "../Profile/components/layout/RecommendedJobs";
import { useParams } from "react-router";
import { RecommendedUsers } from "../Profile/components/layout/RecommendedUsers";

import { useUserById } from "@/hooks/useUser";
import { BasicInfor } from "./components/layout/BasicInfor";
import { DetailsInfor } from "./components/layout/DetailsInfor";
import { Resume } from "./components/layout/Resume";
import { Experiences } from "./components/layout/Experiences";
import { Study } from "./components/layout/Study";
import { SkillsAndLanguages } from "./components/layout/SkillsAndLanguages";
export const User = () => {
  const userId = useParams().userId;
  const { data: user } = useUserById(Number(userId)) || {};

  console.log(user, "!!");
  return (
    <div className="flex flex-row py-40 items-start justify-center bg-[#F8F9FB] h-full gap-15">
      <div className="flex flex-col items-center justify-center gap-10 w-9/10 md:w-4/5 lg:w-3/5">
        {user && <BasicInfor user={user} />}
        {user && <DetailsInfor user={user} />}
        {user && <Resume user={user} />}
        {user && <Experiences user={user} />}
        {user && <Study user={user} />}
        {user && <SkillsAndLanguages user={user} />}
      </div>
      <div className="lg:flex lg:flex-col hidden lg:block lg:justify-start lg:h-full lg:gap-10">
        <RecommendedUsers />
        <RecommendedJobs />
      </div>
    </div>
  );
};
