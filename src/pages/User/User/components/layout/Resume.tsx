import { Files } from "lucide-react";
import { PartTitle } from "../ui/PartTitle";
import { useState } from "react";
import type { UserProfile } from "@/types/Auth";

export const Resume = ({ user }: { user: UserProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <PartTitle text="Resume" />

        <div className="flex flex-row items-center justify-center gap-[10px] w-full py-4">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f8f9fb] flex flex-col items-center justify-center shrink-0">
            <Files size={22} className="text-[#888888]" />
          </div>

          <div
            className="flex flex-col items-start justify-center w-0 flex-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <a
              href={user.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[15px] font-medium text-black transition-all duration-300 w-full break-all ${
                isExpanded
                  ? "line-clamp-none"
                  : "overflow-hidden text-ellipsis whitespace-nowrap"
              }`}
              title={user.resumeLink}
            >
              {user.resumeLink}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
