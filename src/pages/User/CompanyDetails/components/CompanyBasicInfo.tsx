import {
  Building,
  Camera,
  Edit3,
  MapPin,
  EllipsisVertical,
} from "lucide-react";
import type { UserProfile } from "@/types/Auth";
import { useEffect, useState } from "react";
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
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { useMediaQuery } from "@mui/material";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateReport } from "@/hooks/useReport";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

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
  const { user: currentUser } = useAuthStore();
  const [reportReason, setReportReason] = useState("");
  const { mutate: createReport, isPending: pendingReport } = useCreateReport();
  const [openReport, setOpenReport] = useState(false);

  useEffect(() => {
    setDraftUser(company);
  }, [company]);

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

    mutate(formData);
    if (setUserData) {
      setUserData(draftUser); // commit
    }
  };

  const handleCancel = () => {
    setDraftUser(company); // rollback
  };

  const handleReport = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để báo cáo!");
      return;
    }
    if (!reportReason.trim()) {
      toast.error("Vui lòng nhập lý do báo cáo!");
      return;
    }

    createReport(
      {
        resourceId: Number(company.id),
        resourceName: "user",
        reason: reportReason,
        reporterId: Number(currentUser.id),
      },
      {
        onSuccess: () => {
          setOpenReport(false);
          setReportReason("");
        },
      }
    );
  };

  const role = currentUser?.role?.name?.toLowerCase();
  const showReportButton =
    !isEditable && role !== "recruiter" && role !== "admin";

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] h-auto flex flex-row justify-center items-center px-4 gap-4 relative md:h-[196px] md:px-10 py-6 md:py-0">
      <div className="relative h-[100px] md:h-[160px] w-[100px] md:w-[160px] flex items-center group">
        <label htmlFor={isEditable ? "avatar-upload" : undefined}>
          {company?.avatar ? (
            <img
              src={company.avatar}
              alt={company.name || "Company"}
              className={`w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-cover object-center rounded-full ${
                isEditable ? "cursor-pointer" : ""
              }`}
            />
          ) : (
            <div
              className={`w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-full bg-gray-100 flex items-center justify-center ${
                isEditable ? "cursor-pointer" : ""
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
        <div className="flex flex-row justify-between items-center w-full">
          <div className="font-bold text-[22px] md:text-[30px]">
            {company?.name || "Chưa có tên"}
          </div>
          {showReportButton && (
            <Popover open={openReport} onOpenChange={setOpenReport}>
              <PopoverTrigger asChild>
                <button className="rounded-[10px] w-[40px] h-[40px] flex items-center justify-center hover:shadow-sm hover:scale-[1.01] transition-all duration-500 cursor-pointer text-slate-600">
                  <EllipsisVertical size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <h4 className="font-bold leading-none">Báo cáo vi phạm</h4>
                    <p className="text-sm text-slate-500">
                      Mô tả chi tiết vi phạm của công ty này.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="report-reason">Lý do</Label>
                    <Textarea
                      id="report-reason"
                      placeholder="Ví dụ: Thông tin giả mạo, lừa đảo, nội dung không phù hợp..."
                      className="h-24"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <OutlineButton
                      label="Hủy"
                      paddingY="py-3"
                      textSize="text-xs"
                      onClick={() => setOpenReport(false)}
                    />
                    <PrimaryButton
                      label="Gửi báo cáo"
                      paddingY="py-3"
                      textSize="text-xs"
                      onClick={handleReport}
                      disabled={pendingReport}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {isEditable && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-primary cursor-pointer">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa thông tin cơ bản</DialogTitle>
                  <DialogDescription>
                    Thay đổi tên hiển thị của công ty bạn.
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
        {/* 
        {company?.field && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Lĩnh vực:</span>
            <span>{company.field}</span>
          </div>
        )}

        {company?.numberOfEmployees && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Quy mô:</span>
            <span>
              {COMPANY_SCALES.find((s) => s.value === company.numberOfEmployees)
                ?.label || company.numberOfEmployees}
            </span>
          </div>
        )}

        {company?.foundedYear && (
          <div className="text-[#7A7D87] text-[12px] md:text-[14px] flex gap-1 items-center">
            <span className="font-medium">Thành lập:</span>
            <span>{company.foundedYear}</span>
          </div>
        )} */}
      </div>
    </div>
  );
};
