import React, { useState, useRef, useEffect } from "react";
import { COMPANY_FIELDS, COMPANY_SCALES } from "@/constants/companyFields";
import { toast } from "sonner";
import {
  Mail,
  MapPin,
  Building2,
  Users,
  Calendar,
  type LucideIcon,
  Edit3,
} from "lucide-react";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
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
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getAllProvinces } from "@/apis/map.api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DetailedInformation {
  icon: LucideIcon;
  title: string;
  content: string;
}

interface CompanyDetailsInfoProps {
  company: UserProfile;
  isEditable?: boolean;
  setUserData?: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const CompanyDetailsInfo = ({
  company,
  isEditable = false,
  setUserData,
}: CompanyDetailsInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const introduceRef = useRef<HTMLDivElement>(null);
  const isMedium = useMediaQuery("(min-width:768px)");

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });

  const { mutate, isPending } = useUpdateUser();
  const [draftUser, setDraftUser] = useState<UserProfile>(company);

  useEffect(() => {
    setDraftUser(company);
  }, [company]);

  useEffect(() => {
    const el = introduceRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 3;
      setIsOverflowing(el.scrollHeight > maxHeight + 1);
    }
  }, [company?.description]);

  const DetailedInformations: DetailedInformation[] = [
    { icon: Mail, title: "Email", content: company?.email || "Chưa có" },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: company?.address || "Chưa có",
    },
    {
      icon: Building2,
      title: "Lĩnh vực",
      content: company?.field || "Chưa có",
    },
    {
      icon: Users,
      title: "Quy mô nhân sự",
      content:
        COMPANY_SCALES.find((s) => s.value === company?.numberOfEmployees)
          ?.label ||
        company?.numberOfEmployees ||
        "Chưa có",
    },
    {
      icon: Calendar,
      title: "Năm thành lập",
      content: company?.foundedYear?.toString() || "Chưa có",
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

  const handleSubmit = (fieldsToUpdate: string[]) => {
    const currentYear = new Date().getFullYear();
    if (
      fieldsToUpdate.includes("foundedYear") &&
      draftUser.foundedYear &&
      (draftUser.foundedYear < 1900 || draftUser.foundedYear > currentYear)
    ) {
      toast.error(`Năm thành lập phải từ 1900 đến ${currentYear}`);
      return;
    }

    const formData = new FormData();
    formData.append("id", company.id);

    fieldsToUpdate.forEach((field) => {
      formData.append(field, (draftUser as any)[field]?.toString() ?? "");
    });

    mutate(formData);
    if (setUserData) {
      setUserData(draftUser); // commit
    }
  };

  const handleCancel = () => {
    setDraftUser(company); // rollback
  };

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      {/* Phần giới thiệu */}
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">Giới thiệu</div>
          {isEditable && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-primary cursor-pointer">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa giới thiệu</DialogTitle>
                  <DialogDescription>
                    Cập nhật phần giới thiệu về công ty của bạn.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Mô tả chi tiết</Label>
                    <Textarea
                      id="description"
                      className="min-h-[250px]"
                      value={draftUser?.description || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
                    onClick={() => handleSubmit(["description"])}
                    disabled={isPending}
                    loadingText="Đang tải..."
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div
          ref={introduceRef}
          className={`text-[14px] leading-[26px] transition-all text-justify duration-300 pt-4 ${isExpanded ? "line-clamp-none" : "line-clamp-3"
            }`}
        >
          {company?.description || "Chưa có mô tả"}
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
          {isEditable && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-primary cursor-pointer">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa thông tin công ty</DialogTitle>
                  <DialogDescription>
                    Cập nhật các thông tin chi tiết về công ty.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="grid gap-2 md:col-span-2">
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
                    <Select
                      value={draftUser?.field || ""}
                      onValueChange={(value) =>
                        setDraftUser((prev) => ({ ...prev, field: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lĩnh vực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Lĩnh vực</SelectLabel>
                          {COMPANY_FIELDS.map((field) => (
                            <SelectItem key={field} value={field}>
                              {field}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="foundedYear">Năm thành lập</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      value={draftUser?.foundedYear || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDraftUser((prev) => ({
                          ...prev,
                          foundedYear: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="scale">Quy mô nhân sự</Label>
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
                        <SelectGroup>
                          <SelectLabel>Quy mô nhân sự</SelectLabel>
                          {COMPANY_SCALES.map((scale) => (
                            <SelectItem key={scale.value} value={scale.value}>
                              {scale.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
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
                    onClick={() =>
                      handleSubmit([
                        "address",
                        "field",
                        "numberOfEmployees",
                        "foundedYear",
                      ])
                    }
                    disabled={isPending}
                    loadingText="Đang tải..."
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-5 py-4 md:grid md:grid-cols-2 md:justify-between">
          {renderInfor()}
        </div>
      </div>
    </div>
  );
};

