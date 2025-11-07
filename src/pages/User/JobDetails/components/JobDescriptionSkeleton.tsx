import { Skeleton } from "@/components/ui/skeleton";

export const JobDescriptionSkeleton = () => (
  <div className="flex flex-col justify-start gap-3 animate-pulse">
    <Skeleton className="h-[32px] w-[180px]" />
    <Skeleton className="h-[100px] w-full" />
    <Skeleton className="h-[20px] w-[90%]" />
    <Skeleton className="h-[20px] w-[95%]" />
  </div>
);
