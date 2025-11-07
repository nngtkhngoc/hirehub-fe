import type { ApplyJob } from "@/types/Job";
import defaultCompany from "@/assets/illustration/company.png";
import { useGetAppliedJobs } from "@/hooks/useJob";
import { Ellipsis, Link } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const AppliedJobs = () => {
  const { data: appliedJobs } = useGetAppliedJobs();
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
  const renderJobs = () => {
    return appliedJobs.map((job: ApplyJob) => (
      <div className="border-[#f2f2f2] border-t flex flex-row justify-between w-full py-4">
        <div className=" flex flex-row gap-3 ">
          <img
            src={job?.job?.recruiter?.avatar || defaultCompany}
            className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] rounded-full object-cover object-center"
          />
          <div className="flex flex-col justify-center gap-1 md:justify-start md:py-2 ">
            <div className="font-bold text-primary text-lg">
              {job?.job?.title}
            </div>
            <div className="text-xs text-zinc-500 sm:text-sm">
              {job?.job?.recruiter?.name}
            </div>{" "}
            <div
              className={`px-2 py-1 rounded-[30px] flex items-center justify-center text-[8px] font-light w-fit ${getStatusColor(
                job?.status
              )}`}
            >
              {job?.status}
            </div>
          </div>
        </div>
        <div className="">
          <div className="w-[50px] h-[50px] object-cover rounded-full overflow-hidden cursor-pointer">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Ellipsis />
              </DropdownMenuTrigger>{" "}
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <button
                    className="flex flex-row items-center justify-start gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
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
  return <div className="flex flex-col w-full">{renderJobs()}</div>;
};
