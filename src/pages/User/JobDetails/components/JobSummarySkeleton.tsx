import { Skeleton } from "@/components/ui/skeleton";

export const JobSummarySkeleton = () => (
  <div className="rounded-[10px] border-2 border-[#f2f2f2] px-3 py-3 animate-pulse min-w-[350px]">
    <div className="flex flex-col justify-start gap-4 sm:px-5 sm:py-5 md:px-3 md:py-3">
      <Skeleton className="h-[24px] w-[100px]" />
      <div className="grid grid-cols-3 gap-4 md:gap-3 lg:gap-10">
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[50px] w-full" />
      </div>
      <div className="border-t-2 border-[#f2f2f2] pt-4 flex flex-col gap-4">
        <Skeleton className="h-[24px] w-[100px]" />
        <Skeleton className="h-[32px] w-[100px]" />
      </div>
    </div>
  </div>
);
