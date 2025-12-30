import { useState, useEffect, useRef } from "react";
import {
  Edit3,
  Mail,
  MapPin,
  Building2,
  Users,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
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
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { getAllProvinces } from "@/apis/map.api";
import { useUpdateUser } from "@/hooks/useUser";

interface DetailedInformation {
  icon: LucideIcon;
  title: string;
  content: string;
}

interface CompanyDetailsInfoEditProps {
  user: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const CompanyDetailsInfoEdit = ({
  user,
  setUserData,
}: CompanyDetailsInfoEditProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const introduceRef = useRef<HTMLDivElement>(null);
  const [draftUser, setDraftUser] = useState<UserProfile>(user);
  
  useEffect(() => {
    setDraftUser(user);
  }, [user]);

  useEffect(() => {
    const el = introduceRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 3;
      setIsOverflowing(el.scrollHeight > maxHeight + 1);
    }
  }, [user?.description]);

  const DetailedInformations: DetailedInformation[] = [
    { icon: Mail, title: "Email", content: user?.email || "" },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: user?.address || "Chưa có",
    },
    {
      icon: Building2,
      title: "Lĩnh vực",
      content: user?.field || "Chưa có",
    },
    {
      icon: Users,
      title: "Quy mô nhân sự",
      content: user?.numberOfEmployees || "Chưa có",
    },
    {
      icon: Calendar,
      title: "Năm thành lập",
      content: user?.foundedYear?.toString() || "Chưa có",
    },
  ];

  const renderInfor = () => {
    return DetailedInformations.map((infor) => (
      <div
        key={infor.title}
        className="flex flex-row items-center justify-center gap-[10px] w-full"
      >
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f8f9fb] flex flex-col items-center justify-center shrink-0">
          <infor.icon size={22} className="text-[#888888]" />
        </div>

        <div className="flex flex-col items-start justify-center w-0 flex-1">
          <div className="text-[15px] font-medium text-black w-full break-words">
            {infor.content}
          </div>
          <div className="text-[12px] font-regular text-[#A6A6A6]">
            {infor.title}
          </div>
        </div>
      </div>
    ));
  };

  const isMedium = useMediaQuery("(min-width:768px)");
  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });
  const { mutate, isPending } = useUpdateUser();

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("description", draftUser?.description ?? "");
    formData.append("field", draftUser?.field ?? "");
    formData.append("numberOfEmployees", draftUser?.numberOfEmployees ?? "");
    if (draftUser?.foundedYear) {
      formData.append("foundedYear", draftUser.foundedYear.toString());
    }

    mutate(formData);
    setUserData((prev) => {
      if (!prev) return null;
      return { ...prev, ...draftUser };
    });
  };

  const handleCancel = () => {
    setDraftUser(user);
  };

  const employeeOptions = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
    (1900 + i).toString()
  ).reverse();

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      {/* Phần giới thiệu */}
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">Giới thiệu</div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <div className="top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    <div className="px-1">Chỉnh sửa giới thiệu</div>
                  </DialogTitle>
                  <DialogDescription>
                    <div className="px-1 leading-[24px]">
                      Cập nhật mô tả công ty tại đây. Nhấn "Xác nhận" để ghi lại
                      những thay đổi.
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 px-1 py-4">
                  <div className="grid gap-3">
                    <Label htmlFor="description-1">Giới thiệu</Label>
                    <Textarea
                      id="description-1"
                      defaultValue={draftUser?.description || ""}
                      onChange={(e) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
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
        <div
          ref={introduceRef}
          className={`text-[14px] leading-[26px] transition-all text-justify duration-300 pt-4 ${
            isExpanded ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          {user?.description || "Chưa có mô tả"}
        </div>
        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#5E1EE6] text-[12px] mt-1 self-start font-medium hover:underline text-right w-full"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      {/* Phần thông tin công ty */}
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">
            Thông tin công ty
          </div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <div className="top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    <div className="px-1">Chỉnh sửa thông tin công ty</div>
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
                    <Label htmlFor="email-1">Email</Label>
                    <Input
                      id="email-1"
                      defaultValue={draftUser?.email || ""}
                      disabled
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
                  <div className="grid gap-3">
                    <Label htmlFor="field-1">Lĩnh vực</Label>
                    <Input
                      id="field-1"
                      defaultValue={draftUser?.field || ""}
                      onChange={(e) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          field: e.target.value,
                        }))
                      }
                      placeholder="Ví dụ: Công nghệ thông tin, Tài chính..."
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="employees-1">Quy mô nhân sự</Label>
                    <Select
                      value={draftUser?.numberOfEmployees || ""}
                      onValueChange={(value) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          numberOfEmployees: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quy mô" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option} nhân viên
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="foundedYear-1">Năm thành lập</Label>
                    <Select
                      value={draftUser?.foundedYear?.toString() || ""}
                      onValueChange={(value) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          foundedYear: value ? parseInt(value) : null,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn năm thành lập" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
        <div className="w-full flex flex-col justify-center items-center gap-5 py-4 md:grid md:grid-cols-2 md:justify-between">
          {renderInfor()}
        </div>
      </div>
    </div>
  );
};

