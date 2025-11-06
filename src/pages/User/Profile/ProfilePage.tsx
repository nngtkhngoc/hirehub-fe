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
import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/Auth";
import { useProfile } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

export const ProfilePage = () => {
  const { data: user, isLoading } = useProfile();
  // const setUser = useAuthStore(state => state)
  console.log(user);

  const nav = useNavigate();
  const [userData, setUserData] = useState<UserProfile>(user!);

  useEffect(() => setUserData(user!), [user]);
  if (isLoading) return <Spinner />;
  // if (!user) {
  //   nav("/auth");
  // }

  return (
    <div className="flex flex-row py-40 items-start justify-center bg-[#F8F9FB] h-full gap-15">
      <div className="flex flex-col items-center justify-center gap-10 w-9/10 md:w-4/5 lg:w-3/5">
        <BasicInfor user={userData} setUserData={setUserData} />
        <DetailsInfor user={userData} setUserData={setUserData} />
        <Resume user={userData} setUserData={setUserData} />
        <Experiences user={userData} setUserData={setUserData} />
        <Study user={userData} />
        <SkillsAndLanguages user={userData} />
      </div>
      <div className="lg:flex lg:flex-col hidden lg:block lg:justify-start lg:h-full lg:gap-10">
        <RecommendedUsers />
        <RecommendedJobs />
      </div>
    </div>
  );
};
