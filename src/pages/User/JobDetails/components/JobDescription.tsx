import type { Job } from "@/types/Job";

export const JobDescription = ({ job }: { job: Job }) => {
  return (
    <div className="flex flex-col justify-start gap-3">
      <div className="font-bold text-black text-lg sm:text-2xl md:text-3xl">
        Mô tả công việc
      </div>
      <div className="leading-[24px] text-zinc-800 text-sm">
        {job?.description}
      </div>
    </div>
  );
};
