import { useState, useRef, useEffect } from "react";
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
      content: company?.numberOfEmployees || "Chưa có",
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

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("id", company.id);
    formData.append("description", draftUser?.description ?? "");

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
              <DialogContent className="sm:max-w-[500px]">
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
                      className="min-h-[150px]"
                      value={draftUser?.description || ""}
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
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-5 py-4 md:grid md:grid-cols-2 md:justify-between">
          {renderInfor()}
        </div>
      </div>
    </div>
  );
};

