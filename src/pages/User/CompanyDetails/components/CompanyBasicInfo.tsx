import { Building, Camera, Edit3, MapPin } from "lucide-react";
import type { UserProfile } from "@/types/Auth";
import { useEffect, useState } from "react";
import { useUpdateUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { getAllProvinces } from "@/apis/map.api";
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
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { useMediaQuery } from "@mui/material";

interface CompanyBasicInfoProps {
  company: UserProfile;
  isEditable?: boolean;
  setUserData?: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const CompanyBasicInfo = ({
  company,
  isEditable = false,
  setUserData,
}: CompanyBasicInfoProps) => {
  const isMedium = useMediaQuery("(min-width:768px)");
  const { mutate, isPending } = useUpdateUser();
  const [draftUser, setDraftUser] = useState<UserProfile>(company);

  useEffect(() => {
    setDraftUser(company);
  }, [company]);

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (setUserData) {
      setUserData((prev) =>
        prev
          ? {
            ...prev,
            avatar: previewURL,
            avatarFile: file,
          }
          : null
      );
    }

    const formData = new FormData();
    formData.append("id", company?.id);
    formData.append("avatar", file);

    mutate(formData);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("id", company.id);
    formData.append("name", draftUser?.name ?? "");
    formData.append("address", draftUser?.address ?? "");
    formData.append("field", draftUser?.field ?? "");
    formData.append("numberOfEmployees", draftUser?.numberOfEmployees ?? "");
    formData.append(
      "foundedYear",
      draftUser?.foundedYear?.toString() ?? ""
    );

    mutate(formData);
    if (setUserData) {
      setUserData(draftUser); // commit
    }
  };

  const handleCancel = () => {
    setDraftUser(company); // rollback
  };

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] h-auto flex flex-row justify-center items-center px-4 gap-4 relative md:h-[196px] md:px-10 py-6 md:py-0">
      <div className="relative h-[100px] md:h-[160px] w-[100px] md:w-[160px] flex items-center group">
        <label htmlFor={isEditable ? "avatar-upload" : undefined}>
          {company?.avatar ? (
            <img
              src={company.avatar}
              alt={company.name || "Company"}
              className={`w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-cover object-center rounded-full ${isEditable ? "cursor-pointer" : ""
                }`}
            />
          ) : (
            <div
              className={`w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-full bg-gray-100 flex items-center justify-center ${isEditable ? "cursor-pointer" : ""
                }`}
            >
              <Building className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] text-gray-400" />
            </div>
          )}
        </label>

        {isEditable && (
          <>
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
          </>
        )}
      </div>

      <div className="flex flex-col justify-center gap-2 w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5">
          <div className="font-bold text-[22px] md:text-[30px]">
            {company?.name || "Chưa có tên"}
          </div>
          {isEditable && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-primary cursor-pointer">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa thông tin công ty</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin công ty của bạn tại đây.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Tên công ty</Label>
                    <Input
                      id="name"
                      value={draftUser?.name || ""}
                      onChange={(e) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Select
                      value={draftUser?.address || ""}
                      onValueChange={(value) =>
                        setDraftUser((prev) => ({ ...prev, address: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tỉnh/Thành phố</SelectLabel>
                          {provinces?.map((province) => (
                            <SelectItem
                              key={province.code}
                              value={province.name}
                            >
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="field">Lĩnh vực</Label>
                    <Input
                      id="field"
                      value={draftUser?.field || ""}
                      onChange={(e) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          field: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="scale">Quy mô</Label>
                      <Input
                        id="scale"
                        value={draftUser?.numberOfEmployees || ""}
                        onChange={(e) =>
                          setDraftUser((prev) => ({
                            ...prev,
                            numberOfEmployees: e.target.value,
                          }))
                        }
                        placeholder="VD: 100-200"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="foundedYear">Năm thành lập</Label>
                      <Input
                        id="foundedYear"
                        type="number"
                        value={draftUser?.foundedYear || ""}
                        onChange={(e) =>
                          setDraftUser((prev) => ({
                            ...prev,
                            foundedYear: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
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
            </Dialog>
          )}
        </div>

        <div className="text-[#7A7D87] text-[12px] md:text-[14px] pb-2 flex gap-1 items-center">
          <MapPin className="w-[18px] h-[18px]" />
          <span>{company?.address || "Chưa có địa chỉ"}</span>
        </div>

        {company?.field && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Lĩnh vực:</span>
            <span>{company.field}</span>
          </div>
        )}

        {company?.numberOfEmployees && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Quy mô:</span>
            <span>{company.numberOfEmployees}</span>
          </div>
        )}

        {company?.foundedYear && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Thành lập:</span>
            <span>{company.foundedYear}</span>
          </div>
        )}
      </div>
    </div>
  );
};

