import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import type { User } from "@/types/User";
import { Edit3, Send, UserPlus } from "lucide-react";

export const BasicInfor = ({ user }: { user: User }) => {
  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2]c h-[140px] flex flex-row justify-start items-center px-4 gap-4 relative">
      <img
        src={user.avatar}
        alt="profile"
        className="w-[100px] h-[100px] object-cover rounded-full"
      />
      <div className="flex flex-col justify-center gap-2 w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5">
          <div className="font-bold text-[22px]">{user.name}</div>
          <div className=" top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer">
            <Edit3 size={12} />
            <span>Sửa</span>
          </div>
        </div>

        <div className="text-[#7A7D87] text-[12px] flex flex-row gap-1 font-regular">
          <div>{user.position}</div>
          <div> • </div>
          <div>
            {user.experience && (
              <div>
                {user.experience[0]?.endDate?.getTime() >= Date.now() ? (
                  <span>{user.experience[0]?.company?.name}</span>
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
                <UserPlus size={14} />
                <span className="text-[12px]">Kết nối</span>
              </div>
            }
            paddingX="h-[37px] w-[106px]"
          />{" "}
          <OutlineButton
            label={
              <div className="flex flex-row items-center text-[#5E1EE6] justify-center gap-2 -">
                <Send size={14} />
                <span className="text-[12px]">Nhắn tin</span>
              </div>
            }
            paddingX="h-[35px] w-[106px]"
          />
        </div>
      </div>
    </div>
  );
};
