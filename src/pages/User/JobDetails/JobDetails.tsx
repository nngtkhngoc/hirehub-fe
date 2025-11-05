import { CompanySummary } from "./components/CompanySummary";
import { JobDescription } from "./components/JobDescription";
import { JobSummary } from "./components/JobSummary";
import { JobTitle } from "./components/JobTitle";

export const JobDetails = () => {
  return (
    <div className="flex flex-col justify-center">
      <div>
        <JobTitle />
      </div>
      <div className="flex flex-row">
        <div>
          <JobDescription />
        </div>
        <div className="flex flex-col">
          <JobSummary />
          <CompanySummary />
        </div>
      </div>
    </div>
  );
};
