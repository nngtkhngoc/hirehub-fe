import type { Job } from "@/types/Job";

export const JobDescription = ({ job }: { job: Job }) => {
  return (
    <div className="flex flex-col justify-start gap-3 bg-white rounded-[10px] border-2 border-[#f2f2f2] py-8 md:px-10">
      <div className="font-bold text-black text-lg sm:text-2xl md:text-3xl">
        Mô tả công việc
      </div>
      <div className="leading-[24px] text-zinc-800 text-sm">
        {job?.description}
      </div>
    </div>
  );
};
