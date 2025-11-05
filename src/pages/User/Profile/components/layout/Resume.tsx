import { Edit3, Files } from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
import { useUpdateUser } from "@/hooks/useUser";

export const Resume = ({
  user,
  setUserData,
}: {
  user: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile>>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMedium = useMediaQuery("(min-width:768px)");
  const { mutate, isPending } = useUpdateUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    setUserData((prev) => ({
      ...prev,
      resume_link: previewURL,
    }));

    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("resume", file);

    mutate(formData);
  };
  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">Resume</div>
          <label
            htmlFor="resume"
            className=" top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]"
          >
            <Edit3 size={isMedium ? 16 : 12} />
            <span>Sửa</span>
            <input
              id="resume"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </label>
        </div>
        <div className="flex flex-row items-center justify-center gap-[10px] w-full py-4">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f8f9fb] flex flex-col items-center justify-center shrink-0">
            <Files size={22} className="text-[#888888]" />
          </div>{" "}
          <div
            className="flex flex-col items-start justify-center w-0 flex-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {user.resume_link ? (
              <a
                href={user.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[15px] font-medium text-black transition-all duration-300 w-full break-all ${
                  isExpanded
                    ? "line-clamp-none"
                    : "overflow-hidden text-ellipsis whitespace-nowrap"
                }`}
                title={user.resume_link}
              >
                {user.resume_link}
              </a>
            ) : (
              <span className="italic text-[15px] font-medium text-black">
                {" "}
                Chưa có{" "}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
