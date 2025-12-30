import { BasicInfor } from "./components/layout/BasicInfor";
import { DetailsInfor } from "./components/layout/DetailsInfor";
import { Experiences } from "./components/layout/Experiences";
import { RecommendedJobs } from "./components/layout/RecommendedJobs";
import { Resume } from "./components/layout/Resume";
import { SkillsAndLanguages } from "./components/layout/SkillsAndLanguages";
import { Study } from "./components/layout/Study";
import { RecommendedUsers } from "./components/layout/RecommendedUsers";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UserProfile } from "@/types/Auth";
import { CompanyBasicInfo } from "@/pages/User/CompanyDetails/components/CompanyBasicInfo";
import { CompanyDetailsInfo } from "@/pages/User/CompanyDetails/components/CompanyDetailsInfo";

export const ProfilePage = () => {
  const { data: user, isLoading } = useProfile();
  console.log("user", user);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  if (userData?.role?.name?.toLowerCase() === "recruiter") {
    return (
      <div className="flex flex-row py-40 items-start justify-center bg-[#F8F9FB] min-h-screen gap-15 px-4 md:px-20">
        <div className="flex flex-col items-center justify-center gap-10 w-full md:w-4/5 lg:w-3/5">
          <CompanyBasicInfo
            company={userData}
            isEditable={true}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserProfile | null>>
            }
          />
          <CompanyDetailsInfo
            company={userData}
            isEditable={true}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserProfile | null>>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row py-40 items-start justify-center bg-[#F8F9FB] h-full gap-15 px-20">
      <div className="flex flex-col items-center justify-center gap-10 w-9/10 md:w-4/5 lg:w-3/5">
        {userData && (
          <BasicInfor
            user={userData}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserProfile>>
            }
          />
        )}
        {userData && (
          <DetailsInfor
            user={userData}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserProfile>>
            }
          />
        )}
        {userData && (
          <Resume
            user={userData}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserProfile>>
            }
          />
        )}
        {userData && <Experiences user={userData} />}
        {userData && <Study user={userData} />}
        {userData && <SkillsAndLanguages user={userData} />}
      </div>
      <div className="lg:flex lg:flex-col hidden lg:block lg:justify-start lg:h-full lg:gap-10">
        <RecommendedUsers />
        <RecommendedJobs />
      </div>
    </div>
  );
};
