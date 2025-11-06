import type { Job } from "@/types/Job";
import companyDefault from "@/assets/illustration/company.png";
import { Bookmark, Send, Upload } from "lucide-react";
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

import { Textarea } from "@/components/ui/textarea";
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetSavedJobs, useSaveJob } from "@/hooks/useJob";
import { useAuthStore } from "@/stores/useAuthStore";

// export const applyJob: yup.ObjectSchema<CreateExperienceFormData> = yup.object({
//   userId: yup.string().required(),
//   companyId: yup.string().required("Vui lòng chọn công ty"),
//   position: yup.string().required("Vui lòng nhập vị trí"),
//   startDate: yup.string().required("Vui lòng chọn ngày bắt đầu"),
//   endDate: yup.string().nullable(),
//   image: yup.mixed<File>().nullable(),
//   description: yup.string().nullable(),
// });
export const JobTitle = ({ job }: { job: Job }) => {
  const { data: savedJobs } = useGetSavedJobs();
  console.log(savedJobs);
  const isSavedJob = savedJobs?.some((savedJob) => savedJob.job.id === job.id);
  const user = useAuthStore((state) => state.user);

  const { mutate, isPending } = useSaveJob();
  const toggleSaveJob = (jobId: string) => {
    mutate({ jobId, userId: user?.id || "", interaction: "saved" });
  };

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row justify-start gap-2">
        <img
          src={job?.recruiter?.avatar || companyDefault}
          className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px]  md:w-[96px] md:h-[96px] rounded-full object-cover object-center"
        />
        <div className="flex flex-col justify-center gap-1 md:justify-start md:gap-3 md:py-2">
          <div className="font-bold text-primary text-lg sm:text-2xl md:text-3xl">
            {job?.title}
          </div>
          <div className="text-xs text-zinc-500 sm:text-sm">
            tại {job?.recruiter?.name}
          </div>
        </div>
      </div>
      <div className="flex flex-row justfiy-end gap-2">
        {" "}
        <button
          className="rounded-[10px] bg-[#EFE9FD] w-[40px] h-[40px] flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-500 cursor-pointer"
          onClick={() => toggleSaveJob(job.id)}
        >
          <Bookmark
            className={`w-[20px] transition-all duration-500
      ${
        isSavedJob
          ? "fill-primary text-primary"
          : "text-primary group-hover:fill-primary"
      }
    `}
          />
        </button>
        <Dialog>
          <DialogTrigger asChild>
            <button className="rounded-[10px] bg-primary w-[40px] h-[40px] flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-[1.01] sm:w-fit sm:px-5 hover:bg-[#38128A] transition-all duration-500 cursor-pointer">
              <div className="flex flex-row items-center justify-center gap-2">
                <span className="hidden sm:block text-white text-sm">
                  {" "}
                  Ứng tuyển
                </span>{" "}
                <Send className="w-[20px] text-white" />
              </div>
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form>
              <DialogHeader>
                <DialogTitle>
                  <div className="px-1">Ứng tuyển</div>
                </DialogTitle>
                <DialogDescription>
                  <div className="px-1 leading-[24px]">
                    Hoàn thiện thông tin bên dưới để gửi hồ sơ ứng tuyển vị trí
                    này.
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 px-1 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="description-1">Thư giới thiệu</Label>
                  <Textarea id="description-1" className="leading-[24px]" />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    Resume
                  </div>
                  <span className="text-xs italic text-zinc-500">
                    Đăng tải resume của bạn để hoàn tất quá trình ứng tuyển
                  </span>
                  <Label htmlFor="files">
                    <div
                      className={cn(
                        "file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "!text-zinc-500 flex flex-row items-center gap-1"
                      )}
                    >
                      <Upload size={15} />
                      <span className="!font-normal !text-[14px]">
                        Tải resume
                      </span>
                    </div>
                  </Label>
                  <Input
                    id="files"
                    placeholder="vd: Frontend Developer Intern"
                    type="file"
                    hidden
                    // onChange={(e) => {
                    //   handleFileChange(e);
                    //   if (e.target.files) {
                    //     setValue("image", e.target.files[0]);
                    //   }
                    // }}
                  />
                </div>
                {/* {previewURL && (
                  <div className="flex flex-col gap-2 items-start">
                    <img
                      src={previewURL}
                      className="rounded-md max-h-48 object-contain"
                      alt="preview"
                    />
                    <p className="text-xs text-zinc-500 break-all">
                      {fileName}
                    </p>
                  </div>
                )} */}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <OutlineButton label="Hủy" />
                </DialogClose>
                <PrimaryButton label="Xác nhận" loadingText="Đang tải..." />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
