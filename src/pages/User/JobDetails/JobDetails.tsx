import { useParams } from "react-router";
import { CompanySummary } from "./components/CompanySummary";
import { JobDescription } from "./components/JobDescription";
import { JobSummary } from "./components/JobSummary";
import { JobTitle } from "./components/JobTitle";
import { useJobDetails } from "@/hooks/useJob";
import { RelatedJobs } from "./components/RelatedJobs";

export const JobDetails = () => {
  const { id } = useParams();
  const { data: job, isLoading } = useJobDetails(id);

  return (
    <div className="flex flex-col justify-center px-4 pt-[100px] pb-[50px] sm:px-15 md:px-5 gap-5 lg:px-30">
      <div>
        <JobTitle job={job} />
      </div>
      <div className="flex flex-col md:flex-row gap-5 md:gap-5 lg:justify-between">
        <div className="sm:w-3/5">
          <JobDescription job={job} />
        </div>
        <div className="flex flex-col">
          <JobSummary job={job} />
        </div>
      </div>
      <div className="pt-5">
        <RelatedJobs />
      </div>
    </div>
  );
};
