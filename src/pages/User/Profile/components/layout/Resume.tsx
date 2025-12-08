import { Edit3, FilePen, Files, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import type { UserProfile } from "@/types/Auth";
import { useMediaQuery } from "@mui/material";
import { useUpdateUser } from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    console.log(previewURL);
    setUserData((prev) => ({
      ...prev,
      resume_link: previewURL,
      resume_name: file.name,
    }));

    const formData = new FormData();
    formData.append("id", user?.id);
    // formData.append("resume_link", previewURL);
    formData.append("resume", file);
    formData.append("resume_name", file.name);

    mutate(formData);
  };

  const handleRemoveResume = () => {
    setUserData((prev) => ({
      ...prev,
      resume_link: "",
      resume_name: "",
    }));

    const formData = new FormData();
    formData.append("id", user?.id);
    formData.append("resume_link", "");
    formData.append("resume_name", "");

    mutate(formData);
  };

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">Resume</div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <div className=" top-0 right-0 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]">
                <Edit3 size={isMedium ? 16 : 12} />
                <span>Sửa</span>
              </div>
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="flex flex-row items-center gap-2 text-[12px] font-regular cursor-pointer md:text-[13px] text-black group-hover:text-red-600 transition-all duration-300">
                      <Trash2
                        className="text-black group-hover:text-red-600 transition-all duration-300"
                        size={isMedium ? 16 : 12}
                      />
                      <div>Xóa</div>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-primary !font-primary">
                        Xóa Resume?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="leading-[24px] !font-primary">
                        Hành động này không thể hoàn tác. Resume của bạn sẽ bị
                        xóa vĩnh viễn khỏi hệ thống.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        disabled={isPending}
                        onClick={handleRemoveResume}
                      >
                        Tiếp tục
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleSelectFile();
                }}
              >
                <div className="flex flex-row items-center gap-2 text-[12px] font-regular cursor-pointer md:text-[13px]">
                  <FilePen size={isMedium ? 16 : 12} className="text-black" />
                  <span>Thay thế</span>
                </div>
              </DropdownMenuItem>

              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row items-center justify-center gap-[10px] w-full py-4">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f8f9fb] flex flex-col items-center justify-center shrink-0">
            <Files size={22} className="text-[#888888]" />
          </div>{" "}
          <div
            className="flex flex-col items-start justify-center w-0 flex-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {user?.resume_link ? (
              <a
                href={user?.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[15px] font-medium text-black transition-all duration-300 w-full break-all ${
                  isExpanded
                    ? "line-clamp-none"
                    : "overflow-hidden text-ellipsis whitespace-nowrap"
                }`}
                title={user?.resume_name}
              >
                {user?.resume_name}
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
