import { Skeleton } from "@/components/ui/skeleton";

export const JobCardSkeleton = () => {
  return (
    <div className="w-[315px] h-[315px] rounded-[10px] px-5 py-5 space-y-2 bg-white border border-[#DBDBDB]">
      <div className="w-full space-y-2 pb-4 border-b-2 border-[#C7C7C7]">
        <div className="flex flex-row justify-between items-center gap-5">
          <div className="flex flex-row items-center gap-5">
            <Skeleton className="w-[53px] h-[53px] rounded-[10px]" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[120px] h-[18px]" />
            </div>
          </div>
          <Skeleton className="w-[21px] h-[21px] rounded-full" />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Skeleton className="w-[220px] h-[24px]" />
          <Skeleton className="w-[150px] h-[16px]" />
        </div>

        <Skeleton className="w-full h-[48px]" />
      </div>

      <div className="w-full flex flex-row justify-end items-center gap-2 pt-1">
        <Skeleton className="w-[12px] h-[12px] rounded-full" />
        <Skeleton className="w-[60px] h-[12px]" />
      </div>
    </div>
  );
};
