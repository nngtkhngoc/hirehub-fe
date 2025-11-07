import { useState } from "react";
import { Category } from "./components/layout/Category";
import { JobList } from "./components/layout/JobList";

export const MyJobsPage = () => {
  const [categoryTab, setCategoryTab] = useState<"saved" | "applied">("saved");

  return (
    <div className="pt-[100px] pb-[50px] flex flex-col md:flex-row items-center justify-center gap-3 w-full px-5 ">
      <Category categoryTab={categoryTab} setCategoryTab={setCategoryTab} />

      <JobList />
    </div>
  );
};
