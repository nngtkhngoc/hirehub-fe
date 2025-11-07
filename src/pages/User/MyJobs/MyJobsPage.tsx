import { useState } from "react";
import { Category } from "./components/layout/Category";
import { JobList } from "./components/layout/JobList";

export const MyJobsPage = () => {
  const [categoryTab, setCategoryTab] = useState<"saved" | "applied">("saved");

  return (
    <div className="pt-[100px] pb-[50px] flex flex-col md:flex-row items-center justify-center gap-3 w-full px-5 md:items-start md:gap-10 md:px-10 lg:pr-50">
      <div className="w-1/4">
        <Category categoryTab={categoryTab} setCategoryTab={setCategoryTab} />
      </div>
      <div>
        <JobList categoryTab={categoryTab} />
      </div>
    </div>
  );
};
