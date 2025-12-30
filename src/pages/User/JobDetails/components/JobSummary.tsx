import type { Job } from "@/types/Job";
import {
  Building2,
  Calendar,
  Layers2,
  Link,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface jobSummary {
  icon: LucideIcon;
  title: string;
  content: string;
}

export const JobSummary = ({ job }: { job: Job }) => {
  // Handle typo in Job type: "skills" instead of "skills"
  const skills = job?.skills || [];

  const details: jobSummary[] = [
    {
      icon: Calendar,
      title: "NGÀY ĐĂNG",
      content: job?.postingDate.slice(0, 10),
    },
    {
      icon: Building2,
      title: "HÌNH THỨC",
      content: job?.workspace,
    },
    {
      icon: Layers2,
      title: "TRÌNH ĐỘ",
      content: job?.level,
    },
  ];
  const renderDetails = () => {
    return details.map((detail) => {
      return (
        <div className="flex flex-col items-start gap-2" key={detail.title}>
          <detail.icon className="text-primary" />
          <span className="text-xs text-zinc-500 font-light sm:text-sm md:text-xs">
            {detail.title}
          </span>
          <span className="text-[14px] font-medium  sm:text-sm  md:text-[14px] line-clamp-1">
            {detail.content}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="rounded-[10px] border-2 border-[#f2f2f2] px-3 py-3 w-full bg-white">
      <div className="flex flex-col justify-start gap-4  sm:px-5 sm:py-5 md:px-3 md:py-3">
        <div className="flex flex-col justify-start gap-4">
          <div className="font-bold text-black text-lg sm:text-2xl md:text-lg">
            Tổng quan
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-3 lg:gap-10">
            {renderDetails()}
          </div>
        </div>

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="border-t-2 border-[#f2f2f2] pt-4 flex flex-col justify-start gap-3">
            <div className="font-bold text-black text-lg sm:text-2xl md:text-lg">
              Kỹ năng yêu cầu
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="bg-[#EFE9FD] text-primary hover:bg-[#DFD2FA] px-3 py-1 text-xs font-medium rounded-full"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border-t-2 border-[#f2f2f2] pt-4 flex flex-col justify-start gap-4">
          <div className="font-bold text-black text-lg sm:text-2xl md:text-lg">
            Chia sẻ
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Đã sao chép link!");
            }}
            className="rounded-[5px] border-2 border-primary flex items-center justify-center shadow-sm gap-1 px-2 py-1 hover:bg-primary hover:text-white group transition-all duration-500 cursor-pointer text-primary w-fit"
          >
            <Link className=" w-[18px] " />
            <span className="text-sm cursor-pointer">Sao chép</span>
          </button>
        </div>
      </div>
    </div>
  );
};
