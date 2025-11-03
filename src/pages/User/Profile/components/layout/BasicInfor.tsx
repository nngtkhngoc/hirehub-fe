import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
import { Edit3, Send, UserPlus } from "lucide-react";
import profile from "@/assets/illustration/default_profile.webp";

export const BasicInfor = ({ user }: { user: UserProfile }) => {
  const isMedium = useMediaQuery("(min-width:768px)");

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2]c h-[140px] flex flex-row justify-center items-center px-4 gap-4 relative md:h-[196px] md:px-10">
      <img
        src={user.avatar || profile}
        alt="profile"
        className="w-[100px] h-[100px] object-cover rounded-full md:w-[160px] md:h-[160px]"
      />
      <div className="flex flex-col justify-center  gap-2 w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5">
          <div className="font-bold text-[22px] md:text-[30px]">
            {user.name}
          </div>
          <div className=" top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]">
            <Edit3 size={isMedium ? 16 : 12} />
            <span>Sửa</span>
          </div>
        </div>

        <div className="text-[#7A7D87] text-[12px] flex flex-row gap-1 font-regular md:text-[14px] pb-2  overflow-hidden w-full">
          <div className="line-clamp-1 text-ellipsis overflow-hidden">
            {user.position}
          </div>
          <div> • </div>
          <div className="line-clamp-1  text-ellipsis overflow-hidden">
            {user.experiences && (
              <div>
                {user.experiences[0]?.endDate?.getTime() >= Date.now() ? (
                  <span>{user.experiences[0]?.company?.name}</span>
                ) : (
                  <span>{user.address}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center justify-left">
          <PrimaryButton
            label={
              <div className="flex flex-row items-center text-white justify-center gap-2">
                <UserPlus size={isMedium ? 22 : 14} />
                <span className="text-[12px]">Kết nối</span>
              </div>
            }
            paddingX="h-[37px] w-[106px] md:h-[40px]"
          />
          <OutlineButton
            label={
              <div className="flex flex-row items-center text-[#5E1EE6] justify-center gap-2 ">
                <Send size={isMedium ? 22 : 14} />
                <span className="text-[12px]">Nhắn tin</span>
              </div>
            }
            paddingX="h-[35px] w-[106px] md:h-[38px]"
          />
        </div>
      </div>
    </div>
  );
};
