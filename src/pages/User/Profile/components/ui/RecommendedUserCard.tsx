import profile from "@/assets/illustration/default_profile.webp";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/types/Auth";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export const RecommendedUserCard = ({ user }: { user: UserProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="w-full flex flex-row gap-4 items-center justify-center py-4 border-b border-[#A6A6A6]">
      <img
        src={user.avatar || profile}
        alt="avatar"
        className="object-cover shrink-0 h-[80px] w-[80px] rounded-full"
      />
      <div className="flex flex-col items-start justify-center gap-2 w-full">
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
        <Button
          variant="outline"
          // label={
          //   <div className="flex flex-row items-center text-[#5E1EE6] justify-center gap-2 ">
          //     <UserPlus size={16} />
          //     <span className="text-[12px]">Kết nối</span>
          //   </div>
          // }
          // paddingX=" w-[106px] md:h-[34px]"
        >
          <div className="flex flex-row items-center text-[#5E1EE6] justify-center gap-2 ">
            <UserPlus size={16} />
            <span className="text-[12px]">Kết nối</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
