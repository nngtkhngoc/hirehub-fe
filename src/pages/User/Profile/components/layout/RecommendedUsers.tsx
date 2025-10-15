import { users } from "@/mock/user.mock";
import { RecommendedUserCard } from "../ui/RecommendedUserCard";
import { SideTitle } from "../ui/SideTitle";

export const RecommendedUsers = () => {
  const renderUsers = () =>
    users.map((user) => <RecommendedUserCard user={user} />);

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 pt-2 pb-8">
      <div className="flex flex-col w-full">
        <SideTitle text="Có thể bạn sẽ biết" />
        <div className="flex flex-col items-center justify-center w-full">
          {renderUsers()}
        </div>
      </div>
    </div>
  );
};
