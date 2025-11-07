import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
import { MapPin, Send, UserPlus } from "lucide-react";
import profile from "@/assets/illustration/default_profile.webp";

export const BasicInfor = ({ user }: { user: UserProfile }) => {
  const isMedium = useMediaQuery("(min-width:768px)");

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2]c h-[140px] flex flex-row justify-center items-center px-4 gap-4 relative md:h-[196px] md:px-10">
      <div className="relative h-[100px] md:h-[160px] w-[160px] md:w-[200px] flex items-center group">
        <label htmlFor="avatar-upload">
          <img
            src={user.avatar || profile}
            alt="profile"
            className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-cover rounded-full cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-col justify-center gap-2 w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5">
          <div className="font-bold text-[22px] md:text-[30px]">
            {user.name}
          </div>
        </div>

        <div className="text-[#7A7D87] text-[12px] md:text-[14px] pb-2 flex gap-1 overflow-hidden">
          <MapPin className="w-[18px]" />
          {user.address}
        </div>

        <div className="flex flex-row gap-2 items-center">
          <PrimaryButton
            label={
              <div className="flex flex-row items-center text-white gap-2">
                <UserPlus size={isMedium ? 22 : 14} />
                <span className="text-[12px]">Kết nối</span>
              </div>
            }
          />
          <OutlineButton
            label={
              <div className="flex flex-row items-center text-[#5E1EE6] gap-2">
                <Send size={isMedium ? 22 : 14} />
                <span className="text-[12px]">Nhắn tin</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
