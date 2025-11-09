import type { UserProfile } from "@/types/Auth";
import { Skills } from "./Skills";
// import { Languages } from "./Languages";

export const SkillsAndLanguages = ({ user }: { user: UserProfile }) => {
  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      {/* Skills */}
      <Skills user={user} />
      {/* Languages */}
      {/* <Languages user={user} /> */}
    </div>
  );
};
