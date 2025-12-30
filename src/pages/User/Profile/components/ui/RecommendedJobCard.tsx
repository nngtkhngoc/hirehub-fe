import type { Job } from "@/types/Job";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import company from "@/assets/illustration/company.png";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "react-router";

export const RecommendedJobCard = ({ job }: { job: Job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuthStore();
  return (
    <div className="w-full flex flex-row gap-2 items-center py-4 border-b border-[#A6A6A6]">
      <img
        src={job.recruiter.avatar || company}
        alt={job.recruiter.name}
        className="object-cover shrink-0 h-[80px] w-[80px] rounded-full"
      />
      <div className="flex flex-col items-start justify-center gap-2">
        <div
          className={`w-full text-[14px] font-bold ${isExpanded ? "text-clip" : "overflow-hidden text-ellipsis"
            }`}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {job.title}
        </div>
        <div className="font-regular text-[#888888] text-[12px]">
          {job.recruiter.name}
        </div>
        {user?.role?.name?.toLowerCase() === "recruiter" ? (
          <Link to={`/job-details/${job.id}`}>
            <Button variant="outline">
              <div className="flex flex-row items-center text-[#5E1EE6] justify-center gap-2 ">
                <span className="text-[12px]">Xem</span>
              </div>
            </Button>
          </Link>
        ) : (
          <Button variant="outline">
            <div className="flex flex-row items-center text-[#5E1EE6] justify-center gap-2 ">
              <SendHorizonal size={16} />
              <span className="text-[12px]">Ứng tuyển</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};
