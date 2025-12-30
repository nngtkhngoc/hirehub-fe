import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import type { UserProfile } from "@/types/Auth";
import { CompanyBasicInfo } from "@/pages/User/CompanyDetails/components/CompanyBasicInfo";
import { CompanyDetailsInfo } from "@/pages/User/CompanyDetails/components/CompanyDetailsInfo";

export const RecruiterProfilePage = () => {
  const { data: user, isLoading } = useProfile();
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <Spinner />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy thông tin
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row py-40 items-start justify-center bg-[#F8F9FB] min-h-screen gap-15 px-4 md:px-20">
      <div className="flex flex-col items-center justify-center gap-10 w-full md:w-4/5 lg:w-3/5">
        <CompanyBasicInfo
          company={userData}
          isEditable={true}
          setUserData={setUserData}
        />
        <CompanyDetailsInfo
          company={userData}
          isEditable={true}
          setUserData={setUserData}
        />
      </div>
    </div>
  );
};
