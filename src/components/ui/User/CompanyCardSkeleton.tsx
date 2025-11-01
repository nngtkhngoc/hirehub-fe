import { Skeleton } from "@/components/ui/skeleton";

export const CompanyCardSkeleton = () => {
  return (
    <div className="w-[345px] h-[155px] rounded-[30px] border border-[#E0E0E0] bg-white flex flex-col px-5 py-4 items-center justify-center lg:w-[510px] lg:h-[215px]">
      <div className="flex flex-row gap-5 items-center w-full">
        <Skeleton
          className={`w-[85px] h-[85px] rounded-[10px] lg:w-[130px] lg:h-[130px]`}
        />

        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className={`h-[22px] w-[270px] lg:h-[24px] rounded-md`} />

          <Skeleton className={`h-[13px] w-[150px] lg:h-[14px] rounded-md`} />

          <Skeleton className={`h-[50px] w-full lg:h-[60px] rounded-md`} />

          <Skeleton className={`h-[20px] w-[80px] rounded-md mt-2`} />
        </div>
      </div>
    </div>
  );
};
