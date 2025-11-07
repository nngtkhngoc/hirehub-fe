import { useState, useEffect, useRef } from "react";
import {
  Edit3,
  Github,
  Mail,
  MapPin,
  Phone,
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

export const DetailsInfor = ({
  user,
  setUserData,
}: {
  user: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile>>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const introduceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = introduceRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 3;
      setIsOverflowing(el.scrollHeight > maxHeight + 1);
    }
  }, [user?.introduction]);

  const DetailedInformations: DetailedInformation[] = [
<<<<<<< HEAD
    { icon: Mail, title: "Email", content: user.email },
    { icon: Phone, title: "Số điện thoại", content: user.phoneNumber },
    { icon: Github, title: "Github", content: user.github },
    { icon: MapPin, title: "Địa chỉ", content: user.address || "" },
=======
    { icon: Mail, title: "Email", content: user?.email || "" },
    {
      icon: Phone,
      title: "Số điện thoại",
      content: user?.phoneNumber || "Chưa có",
    },
    { icon: Github, title: "Github", content: user?.github || "" },
    { icon: MapPin, title: "Địa chỉ", content: user?.address || "" },
>>>>>>> e0a404beac1132527c2007169aa4985dae732479
  ];
  const renderInfor = () => {
    return DetailedInformations.map((infor, index) => {
      const isItemExpanded = expandedIndex === index;

      return (
        <div
          key={infor.title}
          className={`flex flex-row items-center justify-center gap-[10px] w-full cursor-pointer
          ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
          onClick={() => setExpandedIndex(isItemExpanded ? null : index)}
        >
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f8f9fb] flex flex-col items-center justify-center shrink-0">
            <infor.icon size={22} className="text-[#888888]" />
          </div>

          <div className="flex flex-col items-start justify-center w-0 flex-1 ">
            <div
              className={`text-[15px] font-medium text-black transition-all duration-300 w-full ${
                isItemExpanded ? "break-words" : "overflow-hidden text-ellipsis"
              }`}
            >
              {infor.content}
            </div>
            <div className="text-[12px] font-regular text-[#A6A6A6]">
              {infor.title}
            </div>
          </div>
        </div>
      );
    });
  };
  const isMedium = useMediaQuery("(min-width:768px)");
  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });
  const { mutate, isPending } = useUpdateUser();

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("id", user?.id);
    formData.append("description", user?.description ?? "");
    formData.append("github", user?.github ?? "");
    formData.append("phoneNumber", user?.phoneNumber ?? "");

    mutate(formData);
  };
  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      {/* Phần giới thiệu */}
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">Giới thiệu</div>{" "}
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <div className=" top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]">
                  <Edit3 size={isMedium ? 16 : 12} />
                  <span>Sửa</span>
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
                    <Label htmlFor="description-1">Giới thiệu</Label>
                    <Textarea
                      id="description-1"
                      name="description"
                      defaultValue={user?.description || ""}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                      className="leading-[24px]"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email-1">Email</Label>{" "}
                    <Input
                      id="email-1"
                      name="email"
                      defaultValue={user?.email || ""}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));
                      }}
                    />
                  </div>{" "}
                  <div className="grid gap-3">
                    <Label htmlFor="github-1">Github</Label>{" "}
                    <Input
                      id="github-1"
                      name="github"
                      defaultValue={user?.github || ""}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          github: e.target.value,
                        }));
                      }}
                    />
                  </div>{" "}
                  <div className="grid gap-3">
                    <Label htmlFor="github-1">Số điện thoại</Label>{" "}
                    <Input
                      id="github-1"
                      name="github"
                      defaultValue={user?.phoneNumber || ""}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }));
                      }}
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
                    <OutlineButton label="Hủy" />
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
        </div>{" "}
        <div
          ref={introduceRef}
          className={`text-[14px] leading-[26px] transition-all text-justify duration-300 pt-4 ${
            isExpanded ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          {user?.description}
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

      {/* Phần thông tin cá nhân */}
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">
            Thông tin cá nhân{" "}
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-5 py-4 md:grid md:grid-cols-2 md:justify-between">
          {renderInfor()}
        </div>
      </div>
    </div>
  );
};
