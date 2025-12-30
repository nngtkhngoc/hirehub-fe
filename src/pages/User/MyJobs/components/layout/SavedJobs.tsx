import type { SavedJob } from "@/types/Job";
import defaultCompany from "@/assets/illustration/company.png";
import { useGetSavedJobs } from "@/hooks/useJob";
import { Ellipsis, Link, Bookmark } from "lucide-react";
import { Link as LinkRoute } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const SavedJobs = () => {
  const { data: savedJobs } = useGetSavedJobs();

  const renderJobs = () => {
    if (!savedJobs || savedJobs.length === 0) {
      return (
        <div className="py-8 flex items-center justify-center">
          <Empty className="border-none">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Bookmark className="text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-base">Chưa có công việc đã lưu</EmptyTitle>
              <EmptyDescription className="text-xs">
                Bạn chưa lưu công việc nào. Hãy lưu những công việc bạn quan tâm để xem sau!
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </div>
      );
    }

    return savedJobs.map((job: SavedJob) => (
      <div className="w-full relative">
        <LinkRoute
          to={`/job-details/${job.job.id}`}
          className="border-[#f2f2f2] border-t flex flex-row justify-between w-full py-4 hover:bg-zinc-100 transition-all duration-500 cursor-pointer"
        >
          {" "}
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
  return <div className="flex flex-col w-full">{renderJobs()}</div>;
};
