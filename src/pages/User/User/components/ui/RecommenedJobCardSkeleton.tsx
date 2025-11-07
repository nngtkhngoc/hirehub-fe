import { Skeleton } from "@/components/ui/skeleton";

export const RecommendedJobCardSkeleton = () => {
  return (
    <div className="w-full flex flex-row gap-2 items-center py-4 border-b border-[#A6A6A6]">
      {/* Logo Company */}
      <Skeleton className="shrink-0 h-[80px] w-[80px] rounded-full" />

      <div className="flex flex-col items-center justify-center gap-2 w-full">
        {/* Job Title */}
        <Skeleton className="h-[14px] w-[70%] rounded-md" />

        {/* Company Name */}
        <Skeleton className="h-[12px] w-[50%] rounded-md" />

        {/* Apply Button */}
        <Skeleton className="h-[34px] w-[106px] rounded-xl" />
      </div>
    </div>
  );
};
