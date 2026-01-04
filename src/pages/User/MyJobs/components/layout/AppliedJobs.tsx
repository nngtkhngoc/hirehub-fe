import { useState } from "react";
import { Ellipsis, Link, Briefcase } from "lucide-react";
import { Link as LinkRoute } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import defaultCompany from "@/assets/illustration/company.png";
import { useGetAppliedJobs } from "@/hooks/useJob";
import type { ApplyJob } from "@/types/Job";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const AppliedJobs = () => {
  const { data: appliedJobs, isLoading } = useGetAppliedJobs();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const statusOptions = [
    { value: "ALL", label: "Tất cả" },
    { value: "NOT VIEW", label: "Chưa xem" },
    { value: "VIEWED", label: "Đã xem" },
    { value: "ACCEPTED", label: "Đã chấp nhận" },
    { value: "REJECTED", label: "Đã từ chối" },
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "NOT VIEW":
        return "bg-red-200 text-red-800";
      case "VIEWED":
        return "bg-blue-200 text-blue-800";
      case "ACCEPTED":
        return "bg-green-200 text-green-800";
      case "REJECTED":
        return "bg-gray-200 text-gray-800";
      case "PASS_INTERVIEW":
        return "bg-green-500 text-white shadow-sm";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "NOT VIEW":
        return "Chưa xem";
      case "VIEWED":
        return "Đã xem";
      case "ACCEPTED":
        return "Đã chấp nhận";
      case "REJECTED":
        return "Đã từ chối";
      case "PASS_INTERVIEW":
        return "Đã vượt qua phỏng vấn";
      default:
        return status;
    }
  };

  // Filter jobs by status
  const filteredJobs = appliedJobs?.filter((job: ApplyJob) => {
    if (statusFilter === "ALL") return true;
    return job.status === statusFilter;
  });

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
    if (!filteredJobs || filteredJobs.length === 0) {
      return (
        <div className="py-8 flex items-center justify-center">
          <Empty className="border-none">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Briefcase className="text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-base">Không có công việc nào</EmptyTitle>
              <EmptyDescription className="text-xs">
                Không có công việc nào phù hợp với bộ lọc của bạn.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </div>
      );
    }

    return filteredJobs?.map((job: ApplyJob) => (
      <div className="w-full relative" key={job.job.id}>
        <LinkRoute
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
                {getStatusLabel(job?.status)}
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
      {/* Status Filter */}
      <div className="py-3 mb-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? renderSkeleton() : renderJobs()}
    </div>
  );
};
