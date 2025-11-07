import profile from "@/assets/illustration/default_profile.webp";

import ConnectionButton from "./ConnectionButton";
import type { UserProfile } from "@/types/Auth";
import { Link } from "react-router";

interface UserCardProps {
  user: UserProfile;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/user/${user.id}`}>
      <div className="bg-white w-[292px] h-[410px] rounded-[30px] border border-[#DBDBDB] flex flex-col gap-[10px] items-center justify-center group hover:shadow-[0_4px_4px_#DFD2FA] hover:scale-[1.02] cursor-pointer transition-all duration-300">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avartar"
            className="object-cover w-[150px] h-[150px] rounded-full"
          />
        ) : (
          <img
            src={profile}
            alt="avartar"
            className="object-cover w-[150px] h-[150px] rounded-full"
          />
        )}

        <div className="font-bold text-[18px] line-clamp-1 text-ellipsis px-5 text-center h-[35px]">
          {user.name}
        </div>

        <div className="font-light text-[13px] text-[#A6A6A6] h-[40px] text-ellipsis px-5 text-center overflow-hidden leading-[22px]">
          {user.description}
        </div>

        <div className="flex flex-row justify-center items-center gap-[8px]  text-[10px]  font-title h-[36px]">
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

        <ConnectionButton targetUser={user} variant="primary" />
      </div>
    </Link>
  );
};
