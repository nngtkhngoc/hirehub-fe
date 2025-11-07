import { Skeleton } from "@/components/ui/skeleton";

export const JobLandingPageCardSkeleton = () => {
  return (
    <div className="w-[280px] sm:min-w-[320px] h-[322px] rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.25)] px-5 py-5 space-y-2 bg-white">
      {/* Avatar + Company */}
      <div className="flex flex-row items-center gap-5">
        <Skeleton className="w-[53px] h-[53px] rounded-[10px]" />
        <div className="flex flex-col items-start justify-around flex-1 gap-2">
          <Skeleton className="h-5 w-[120px] rounded" />
          <Skeleton className="h-4 w-[80px] rounded" />
        </div>
      </div>

      {/* Job title + level */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-6 w-[150px] rounded" />
        <Skeleton className="h-4 w-[60px] rounded" />
      </div>

      {/* Description */}
      <Skeleton className="h-[60px] w-full rounded" />

      {/* Apply button */}
      <div className="flex justify-end">
        <Skeleton className="h-7 w-[90px] rounded" />
      </div>
    </div>
  );
};
