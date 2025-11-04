import { useAuthStore } from "@/stores/useAuthStore";
import { BasicInfor } from "./components/layout/BasicInfor";
import { DetailsInfor } from "./components/layout/DetailsInfor";
import { Experiences } from "./components/layout/Experiences";
import { RecommendedJobs } from "./components/layout/RecommendedJobs";
import { Resume } from "./components/layout/Resume";
import { SkillsAndLanguages } from "./components/layout/SkillsAndLanguages";
import { Study } from "./components/layout/Study";
import { useNavigate } from "react-router";
import { RecommendedUsers } from "./components/layout/RecommendedUsers";

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  const nav = useNavigate();

  if (!user) {
    nav("/auth");
  } else
    return (
      <div className="flex flex-row py-40 items-start justify-center bg-[#F8F9FB] h-full gap-15">
        <div className="flex flex-col items-center justify-center gap-10 w-9/10 md:w-4/5 lg:w-3/5">
          <BasicInfor user={user} />
          <DetailsInfor user={user} />
          <Resume user={user} />
          <Experiences user={user} />
          <Study user={user} />
          <SkillsAndLanguages user={user} />
        </div>
        <div className="lg:flex lg:flex-col hidden lg:block lg:justify-start lg:h-full lg:gap-10">
          <RecommendedUsers />
          <RecommendedJobs />
        </div>
      </div>
    );
};
