import { useParams } from "react-router";
import { JobDescription } from "./components/JobDescription";
import { JobSummary } from "./components/JobSummary";
import { JobTitle } from "./components/JobTitle";
import { useJobDetails } from "@/hooks/useJob";
import { RelatedJobs } from "./components/RelatedJobs";
import { JobTitleSkeleton } from "./components/JobTitleSkeleton";
import { JobDescriptionSkeleton } from "./components/JobDescriptionSkeleton";
import { JobSummarySkeleton } from "./components/JobSummarySkeleton";

export const JobDetails = () => {
  const { id } = useParams();
  const { data: job, isLoading } = useJobDetails(id);

  return (
    <div className="flex flex-col justify-center px-4 pt-[100px]  bg-[#F8F9FB]  pb-[50px] sm:px-15 md:px-5 gap-5 lg:px-30">
      <div>{isLoading ? <JobTitleSkeleton /> : <JobTitle job={job} />}</div>
      <div className="flex flex-col md:flex-row lg:justify-between gap-5">
        <div className="sm:w-2/3">
          {isLoading ? (
            <JobDescriptionSkeleton />
          ) : (
            <JobDescription job={job} />
          )}
        </div>
        <div className="flex flex-col ">
          {isLoading ? <JobSummarySkeleton /> : <JobSummary job={job} />}
        </div>
      </div>
      <div className="pt-5">
        <RelatedJobs />
      </div>
    </div>
  );
};
