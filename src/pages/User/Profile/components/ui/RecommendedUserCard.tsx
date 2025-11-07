import profile from "@/assets/illustration/default_profile.webp";
import ConnectionButton from "@/components/ui/User/ConnectionButton";
import type { UserProfile } from "@/types/Auth";
import { useState } from "react";

export const RecommendedUserCard = ({ user }: { user: UserProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="w-full flex flex-row gap-2 items-center py-4 border-b border-[#A6A6A6]">
      <img
        src={user.avatar || profile}
        alt="avatar"
        className="object-cover shrink-0 h-[80px] w-[80px] rounded-full"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className={`w-full text-[14px] font-bold h-[20px] ${
            isExpanded ? "text-clip" : "overflow-hidden text-ellipsis"
          }`}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {user.name}
        </div>
        <div className="font-regular text-[#888888] text-[12px]">
          {user.position}
        </div>
        <ConnectionButton targetUser={user} variant="outline" />
      </div>
    </div>
  );
};
