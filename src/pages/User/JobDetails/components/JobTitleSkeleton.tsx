import { Skeleton } from "@/components/ui/skeleton";

export const JobTitleSkeleton = () => (
  <div className="flex flex-row w-full justify-between animate-pulse">
    <div className="flex flex-row justify-start gap-2">
      <Skeleton className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[96px] md:h-[96px] rounded-full" />
      <div className="flex flex-col justify-center gap-2 md:gap-3 md:py-2">
        <Skeleton className="h-[24px] w-[180px] sm:w-[260px] md:w-[300px]" />
        <Skeleton className="h-[16px] w-[140px]" />
      </div>
    </div>
    <div className="flex flex-row gap-2">
      <Skeleton className="rounded-[10px] w-[40px] h-[40px]" />
      <Skeleton className="rounded-[10px] w-[40px] h-[40px] sm:w-[100px]" />
    </div>
  </div>
);
