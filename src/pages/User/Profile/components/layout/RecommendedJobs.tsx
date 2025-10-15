import { SideTitle } from "../ui/SideTitle";
import { jobs } from "@/mock/job.mock";
import { RecommendedJobCard } from "../ui/RecommendedJobCard";

export const RecommendedJobs = () => {
  const renderCompanies = () =>
    jobs.map((job) => <RecommendedJobCard job={job} />);

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 pt-2 pb-8">
      <div className="flex flex-col w-full">
        <SideTitle text="Cơ hội dành cho bạn" />
        <div className="flex flex-col items-center justify-center w-full">
          {renderCompanies()}
        </div>
      </div>
    </div>
  );
};
