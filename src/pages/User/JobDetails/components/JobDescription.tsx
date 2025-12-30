import type { Job } from "@/types/Job";

export const JobDescription = ({ job }: { job: Job }) => {
  return (
    <div className="flex flex-col justify-start gap-3 bg-white rounded-[10px] border-2 border-[#f2f2f2] py-8 px-6 md:px-10">
      <div className="font-bold text-black text-lg sm:text-2xl md:text-3xl">
        Mô tả công việc
      </div>
      <div
        className="prose prose-sm max-w-none text-zinc-800 leading-relaxed
          prose-p:my-2 prose-ul:my-2 prose-ol:my-2
          prose-li:my-0.5 prose-headings:text-gray-900
          prose-strong:text-gray-900 prose-a:text-primary
          prose-blockquote:border-l-primary prose-blockquote:text-gray-600"
        dangerouslySetInnerHTML={{ __html: job?.description || "" }}
      />
    </div>
  );
};
