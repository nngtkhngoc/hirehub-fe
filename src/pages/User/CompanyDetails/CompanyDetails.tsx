import { useParams } from "react-router";
import { useUserById } from "@/hooks/useUser";
import { CompanyBasicInfo } from "./components/CompanyBasicInfo";
import { CompanyDetailsInfo } from "./components/CompanyDetailsInfo";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/Auth";
import { RecommendedCompanies } from "./components/RecommendedCompanies";
import { RecommendedJobs } from "@/pages/User/Profile/components/layout/RecommendedJobs";

export const CompanyDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const { data: company, isLoading } = useUserById(Number(id));

  const [companyData, setCompanyData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (company) {
      setCompanyData(company);
    }
  }, [company]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <Spinner />
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy công ty
          </h2>
          <p className="text-gray-600">Công ty bạn đang tìm không tồn tại.</p>
        </div>
      </div>
    );
  }

  const isEditable = currentUser?.id === companyData.id;

  return (
    <div className="flex flex-row py-40 items-start justify-center bg-[#F8F9FB] min-h-screen gap-15 px-4 md:px-20">
      <div className="flex flex-col items-center justify-center gap-10 w-full md:w-3/5 lg:w-3/5">
        <CompanyBasicInfo
          company={companyData}
          isEditable={isEditable}
          setUserData={setCompanyData}
        />
        <CompanyDetailsInfo
          company={companyData}
          isEditable={isEditable}
          setUserData={setCompanyData}
        />
      </div>
      <div className="lg:flex lg:flex-col hidden lg:block lg:justify-start lg:h-full lg:gap-10 lg:w-1/3">
        <RecommendedCompanies />
        <RecommendedJobs />
      </div>
    </div>
  );
};

