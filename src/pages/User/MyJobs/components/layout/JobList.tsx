import { BriefcaseBusiness } from "lucide-react";
import { AppliedJobs } from "./AppliedJobs";
import { SavedJobs } from "./SavedJobs";

export const JobList = ({ categoryTab }: { categoryTab: string }) => {
  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col px-4 py-4 md:px-10">
      <div className="w-full text-left text-lg  font-bold text-primary pb-4 border-b-2 border-[#f2f2f2] flex flex-row justify-start items-center gap-2">
        <BriefcaseBusiness />
        Danh sách công việc
      </div>
      <div className="w-full">
        {categoryTab == "applied" ? <AppliedJobs /> : <SavedJobs />}
      </div>
    </div>
  );
};
