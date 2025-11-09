import { Ellipsis, Link } from "lucide-react";
import { Link as LinkRoute } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import defaultCompany from "@/assets/illustration/company.png";
import { useGetAppliedJobs } from "@/hooks/useJob";
import type { ApplyJob } from "@/types/Job";

export const AppliedJobs = () => {
  const { data: appliedJobs, isLoading } = useGetAppliedJobs(); // lấy isLoading từ hook

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "NOT VIEW":
        return "bg-red-200 text-red-800";
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "ACCEPT":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <div
        key={idx}
        className="border-t border-[#f2f2f2] flex flex-row justify-between w-full py-4 animate-pulse"
      >
        <div className="flex flex-row gap-3">
          <div className="w-[50px] min-h-[50px] sm:w-[80px] sm:h-[80px] rounded-full bg-gray-300" />
          <div className="flex flex-col justify-center gap-2 md:py-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="w-[50px] h-[50px] bg-gray-300 rounded-full"></div>
      </div>
    ));
  };

  const renderJobs = () => {
    return appliedJobs?.map((job: ApplyJob) => (
      <div className="w-full relative">
        <LinkRoute
          key={job.job.id}
          to={`/job-details/${job.job.id}`}
          className="border-[#f2f2f2] border-t flex flex-row justify-between w-full py-4 hover:bg-zinc-100 transition-all duration-500 cursor-pointer"
        >
          <div className="flex flex-row gap-3">
            <img
              src={job?.job?.recruiter?.avatar || defaultCompany}
              className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] rounded-full object-cover object-center"
            />
            <div className="flex flex-col justify-center gap-1 md:justify-start md:py-2">
              <div className="font-bold text-primary text-lg">
                {job?.job?.title}
              </div>
              <div className="text-xs text-zinc-500 sm:text-sm">
                {job?.job?.recruiter?.name}
              </div>
              <div
                className={`px-2 py-1 rounded-[30px] flex items-center justify-center text-[8px] font-light w-fit ${getStatusColor(
                  job?.status
                )}`}
              >
                {job?.status}
              </div>
            </div>
          </div>
        </LinkRoute>
        <div className="absolute right-0 top-4 z-30">
          <div className="w-[30px] h-[30px] object-cover rounded-full overflow-hidden cursor-pointer flex items-center justify-center hover:bg-zinc-200 transition-all duration-300">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <button
                    className="flex flex-row items-center justify-start gap-2 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `/job-details/${job?.job?.id}`
                      );
                      toast.success("Đã sao chép link!");
                    }}
                  >
                    <Link className="text-[16px]" />
                    Sao chép
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col w-full">
      {isLoading ? renderSkeleton() : renderJobs()}
    </div>
  );
};
