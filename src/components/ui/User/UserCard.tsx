import type { User } from "@/types/User";
import { Briefcase, Building, MapPin, UserPlus } from "lucide-react";
import { OutlineButton } from "./Button";

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="bg-white w-[292px] h-[407px] rounded-[30px] border border-[#DBDBDB] flex flex-col gap-[10px] items-center justify-center group hover:shadow-[0_4px_4px_#DFD2FA] hover:scale-[1.02] cursor-pointer transition-all duration-300">
      <img
        src={user.avatar}
        alt="avartar"
        className="object-cover w-[150px] h-[150px] rounded-full"
      />

      <span className="font-bold text-[18px] line-clamp-1 text-ellipsis">
        {user.name}
      </span>

      <span className="font-light text-[14px] text-[#A6A6A6]">
        {user.position}
      </span>
      {user.status === "Đang tìm việc" ? (
        <div className="flex flex-row gap-2 text-[#8DB82D]">
          <Briefcase size={18} />
          <span className="text-[12px] font-regular">Đang tìm việc</span>
        </div>
      ) : (
        user.experience && (
          <div
            className={`flex flex-row gap-2 ${
              user.experience[0]?.endDate?.getTime() >= Date.now()
                ? "text-[#5E1EE6]"
                : "text-black"
            }`}
          >
            {user.experience[0]?.endDate?.getTime() >= Date.now() ? (
              <>
                <Building size={18} />
                <span className="text-[12px] font-regular">
                  {user.experience[0]?.company?.name}
                </span>
              </>
            ) : (
              <>
                <MapPin size={18} />
                <span className="text-[12px] font-regular">{user.address}</span>
              </>
            )}
          </div>
        )
      )}

      <div className="flex flex-row justify-center items-center gap-[8px]  text-[10px]  font-title ">
        {user.skills?.slice(0, 3).map((skill) => (
          <div className="px-[10px] py-[5px] border border-[0.5px] border-[#A6A6A6] text-[#A6A6A6] font-medium rounded-[30px]">
            {skill.name}
          </div>
        ))}

        {user.skills.length > 3 ? (
          <div className="px-[10px] py-[5px] text-white bg-[#5E1EE6] shadow-[0px_2px_2px_[#DFD2FA] rounded-[30px]">
            +{user.skills.length - 3}
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="border-b border-[#DBDBDB] my-2  w-1/2"></div>

      <OutlineButton
        paddingX="px-[80px]"
        paddingY="py-[8px]"
        label={
          <div className="flex flex-row justify-center items-center gap-3 text-[#5E1EE6] text-[12px] font-title font-medium">
            <UserPlus size={22} />
            <span>Kết nối</span>
          </div>
        }
      />
    </div>
  );
};
