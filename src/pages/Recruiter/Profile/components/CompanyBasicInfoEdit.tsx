import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
import { Camera, Edit3, MapPin, Building } from "lucide-react";
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

interface CompanyBasicInfoEditProps {
  user: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const CompanyBasicInfoEdit = ({
  user,
  setUserData,
}: CompanyBasicInfoEditProps) => {
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

    setUserData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        avatar: previewURL,
        avatarFile: file,
      };
    });

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
    setUserData((prev) => {
      if (!prev) return null;
      return { ...prev, ...draftUser };
    });
  };

  const handleCancel = () => {
    setDraftUser(user);
  };

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] h-auto flex flex-row justify-center items-center px-4 gap-4 relative md:h-[196px] md:px-10 py-6 md:py-0">
      <div className="relative h-[100px] md:h-[160px] w-[100px] md:w-[160px] flex items-center group">
        <label htmlFor="avatar-upload">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="company"
              className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-cover object-center rounded-full cursor-pointer"
            />
          ) : (
            <div className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
              <Building className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] text-gray-400" />
            </div>
          )}
        </label>

        <label
          htmlFor="avatar-upload"
          className="bg-[#F6F1FF] w-8 h-8 flex items-center justify-center absolute bottom-1 right-2 rounded-full cursor-pointer transition-all duration-300 opacity-0 translate-y-1 shadow group-hover:opacity-100 group-hover:translate-y-0"
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
            {user?.name || "Chưa có tên"}
          </div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-primary cursor-pointer">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    <div className="px-1">Chỉnh sửa thông tin cơ bản</div>
                  </DialogTitle>
                  <DialogDescription>
                    <div className="px-1 leading-[24px]">
                      Cập nhật thông tin công ty tại đây. Nhấn "Xác nhận" để ghi
                      lại những thay đổi.
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 px-1 py-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Tên công ty</Label>
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
                    <Label htmlFor="address-1">Địa chỉ</Label>
                    <div className="flex flex-row items-center gap-2 px-2 text-[#888888] border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px]">
                      <MapPin size={20} />
                      <Select
                        value={draftUser?.address || ""}
                        onValueChange={(value) =>
                          setDraftUser((prev) => ({
                            ...prev,
                            address: value,
                          }))
                        }
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

        <div className="text-[#7A7D87] text-[12px] md:text-[14px] pb-2 flex gap-1 items-center">
          <MapPin className="w-[18px] h-[18px]" />
          <span>{user?.address || "Chưa có địa chỉ"}</span>
        </div>

        {user?.field && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Lĩnh vực:</span>
            <span>{user.field}</span>
          </div>
        )}

        {user?.numberOfEmployees && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Quy mô:</span>
            <span>{user.numberOfEmployees}</span>
          </div>
        )}

        {user?.foundedYear && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Thành lập:</span>
            <span>{user.foundedYear}</span>
          </div>
        )}
      </div>
    </div>
  );
};

