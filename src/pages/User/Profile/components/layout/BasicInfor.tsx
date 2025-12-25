import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
import { Camera, Edit3, MapPin, Send, UserPlus } from "lucide-react";
import profile from "@/assets/illustration/default_profile.webp";
import { useUpdateUser } from "@/hooks/useUser";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllProvinces } from "@/apis/map.api";
import { useEffect, useState } from "react";
export const BasicInfor = ({
  user,
  setUserData,
}: {
  user: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile>>;
}) => {
  const isMedium = useMediaQuery("(min-width:768px)");
  const { mutate, isPending } = useUpdateUser();
  const [draftUser, setDraftUser] = useState<UserProfile>(user);
  useEffect(() => {
    setDraftUser(user);
  }, [user]);

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
    formData.append("id", user?.id);
    formData.append("avatar", file);

    mutate(formData);
  };

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("name", draftUser?.name ?? "");

    mutate(formData);
    setUserData(draftUser); // commit
  };

  const handleCancel = () => {
    setDraftUser(user); // rollback
  };

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2]c h-[140px] flex flex-row justify-center items-center px-4 gap-4 relative md:h-[196px] md:px-10">
      <div className="relative h-[100px] md:h-[160px] w-[160px] md:w-[200px] flex items-center group">
        <label htmlFor="avatar-upload">
          <img
            src={user?.avatar || profile}
            alt="profile"
            className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-cover object-center rounded-full cursor-pointer"
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
            {user?.name}
          </div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-primary cursor-pointer">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>{" "}
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                  <DialogTitle>
                    <div className="px-1">Chỉnh sửa thông tin cơ bản</div>
                  </DialogTitle>
                  <DialogDescription>
                    <div className="px-1 leading-[24px]">
                      Cập nhật hồ sơ của bạn tại đây. Nhấn "Xác nhận" để ghi lại
                      những thay đổi.
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 px-1 py-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Họ và tên</Label>
                    <Input
                      id="name-1"
                      defaultValue={draftUser?.name || ""}
                      onChange={(e) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Địa chỉ</Label>
                    <div
                      className="flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                            focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    >
                      <MapPin size={20} />
                      <Select
                      // onValueChange={(v) => setProvince(v)}
                      >
                        <SelectTrigger className="!border-none !shadow-none !px-0 text-[13px] text-black">
                          <SelectValue placeholder="Chọn địa chỉ" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Địa chỉ</SelectLabel>
                            {provinces?.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.name}
                                className="text-black"
                              >
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <OutlineButton label="Hủy" onClick={handleCancel} />
                  </DialogClose>

                  <PrimaryButton
                    label="Xác nhận"
                    onClick={handleSubmit}
                    disabled={isPending}
                    loadingText="Đang tải..."
                  />
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>

        <div className="text-[#7A7D87] text-[12px] md:text-[14px] pb-2 flex gap-1 overflow-hidden">
          <MapPin className="w-[18px]" />
          {user?.address}
        </div>

        {/* <div className="flex flex-row gap-2 items-center">
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
        </div> */}
      </div>
    </div>
  );
};
