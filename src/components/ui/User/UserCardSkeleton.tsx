import { Skeleton } from "@/components/ui/skeleton";

export const UserCardSkeleton = () => {
  return (
    <div className="bg-white  ww-[292px] h-[410px] rounded-[30px] border border-[#DBDBDB] flex flex-col gap-[10px] items-center justify-center p-4 animate-pulse">
      {/* Avatar */}
      <Skeleton className="w-[150px] h-[150px] rounded-full" />

      {/* Name */}
      <Skeleton className="w-[290px] h-[18px] rounded-md" />

      {/* Position */}
      <Skeleton className="w-[100px] h-[14px] rounded-md" />

      {/* Status */}
      <Skeleton className="w-[90px] h-[12px] mt-1 rounded-md" />

      {/* Skills */}
      <div className="flex flex-row justify-center items-center gap-[8px] my-2">
        <Skeleton className="w-[50px] h-[20px] rounded-full" />
        <Skeleton className="w-[50px] h-[20px] rounded-full" />
        <Skeleton className="w-[50px] h-[20px] rounded-full" />
      </div>

      {/* Divider */}
      <Skeleton className="w-1/2 h-[1px] rounded-md" />

      {/* Button */}
      <Skeleton className="w-[200px] h-[35px] rounded-[30px]" />
    </div>
  );
};
