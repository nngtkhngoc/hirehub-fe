import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
import { Camera, Edit3, MapPin, Send, UserPlus } from "lucide-react";
import profile from "@/assets/illustration/default_profile.webp";
import { useUpdateUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { useEffect } from "react";

export const BasicInfor = ({
  user,
  setUserData,
}: {
  user: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile>>;
}) => {
  const isMedium = useMediaQuery("(min-width:768px)");
  const { mutate, isPending } = useUpdateUser();

  useEffect(() => {
    if (isPending) {
      toast.loading("Đang tải dữ liệu...", {
        id: "loading-toast",
      });
    } else {
      toast.dismiss("loading-toast");
    }
  }, [isPending]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    setUserData((prev) => ({
      ...prev,
      avatar: previewURL,
      avatarFile: file,
    }));

    const formData = new FormData();
    formData.append("id", user.id);
    console.log("test", user);
    formData.append("name", user.name ?? "");
    formData.append("avatar", file);

    mutate(formData);
  };

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2]c h-[140px] flex flex-row justify-center items-center px-4 gap-4 relative md:h-[196px] md:px-10">
      <div className="relative h-[100px] md:h-[160px] w-[100px] md:w-[160px] flex items-center group">
        <label htmlFor="avatar-upload">
          <img
            src={user.avatar || profile}
            alt="profile"
            className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-cover rounded-full cursor-pointer"
          />
        </label>

        <label
          htmlFor="avatar-upload"
          className="bg-[#F6F1FF] w-8 h-8 flex items-center justify-center absolute bottom-1 right-2 rounded-full cursor-pointer transition-all duration-300 opacity-0 translate-y-1
    shadow group-hover:opacity-100 group-hover:translate-y-0"
        >
          <Camera
            className="text-[#5E1EE6] w-[18px] h-[18px]"
            strokeWidth={2.5}
          />
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col justify-center gap-2 w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5">
          <div className="font-bold text-[22px] md:text-[30px]">
            {user.name}
          </div>
          <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-primary cursor-pointer">
            <Edit3 size={isMedium ? 16 : 12} />
            <span>Sửa hồ sơ</span>
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
