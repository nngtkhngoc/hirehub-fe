/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import type { ApplyJob, ApplyJobFormData, Job } from "@/types/Job";
import companyDefault from "@/assets/illustration/company.png";
import { Bookmark, FolderClosed, Send, Upload } from "lucide-react";
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
import {
  useApplyJob,
  useGetAppliedJobs,
  useGetSavedJobs,
  useSaveJob,
} from "@/hooks/useJob";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";

export const applyJobSchema: yup.ObjectSchema<ApplyJobFormData> = yup.object({
  jobId: yup.string().required(),
  userId: yup.string().required(),
  cover_letter: yup.string().nullable(),
  resumeFile: yup.mixed<File>().required("Vui lòng tải resume"),
});

export const JobTitle = ({ job }: { job: Job }) => {
  const user = useAuthStore((state) => state.user);

  const { data: savedJobs } = useGetSavedJobs();
  const { data: appliedJobs } = useGetAppliedJobs();

  const isSavedJob = savedJobs?.some(
    (savedJob: any) => savedJob?.job?.id == job?.id
  );
  const isAppliedJob = appliedJobs?.some(
    (appliedJob: any) => appliedJob?.job?.id == job?.id
  );
  const matchedAppliedJob = appliedJobs?.find(
    (appliedJob: ApplyJob) => appliedJob?.job?.id === job?.id
  );

  const { mutate, isPending } = useSaveJob();
  const toggleSaveJob = (jobId: string) => {
    mutate({ jobId, userId: user?.id || "", interaction: "saved" });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplyJobFormData>({
    resolver: yupResolver(applyJobSchema),
    defaultValues: {
      userId: user?.id ?? "",
      jobId: job?.id,
      cover_letter: undefined,
      resumeFile: undefined,
    },
  });

  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewURL(URL.createObjectURL(file));
    setFileName(file.name);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const { mutate: applyMutate, isPending: pendingApply } = useApplyJob();
  const onSubmit = (data: ApplyJobFormData) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập!");
    }
    applyMutate(data as any, {
      onSuccess: () => {
        setOpenDialog(false);
        setPreviewURL(null);
        setFileName(null);
      },
    });
  };
  return (
    <div className="flex flex-row w-full justify-between bg-white rounded-[10px] border-2 border-[#f2f2f2] py-8 md:px-10">
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
        {user?.role?.name?.toLowerCase() !== "recruiter" && (
          <button
            className="rounded-[10px] bg-[#EFE9FD] w-[40px] h-[40px] flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-500 cursor-pointer"
            onClick={() => toggleSaveJob(job?.id)}
            disabled={isPending}
          >
            <Bookmark
              className={`w-[20px] transition-all duration-500
      ${isSavedJob
                  ? "fill-primary text-primary"
                  : "text-primary group-hover:fill-primary"
                }
    `}
            />
          </button>
        )}
        {user?.role?.name?.toLowerCase() !== "recruiter" && (
          isAppliedJob ? (
            <a
              target="_blank"
              href={matchedAppliedJob.link}
              className="rounded-[10px] bg-primary w-[40px] h-[40px] flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-[1.01] sm:w-fit sm:px-5 hover:bg-[#38128A] transition-all duration-500 cursor-pointer"
            >
              <div className="flex flex-row items-center justify-center gap-2">
                <span className="hidden sm:block text-white text-sm">
                  Xem hồ sơ
                </span>
                <FolderClosed className="w-[20px] text-white" />
              </div>
            </a>
          ) : (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild onClick={() => setOpenDialog(true)}>
                <button className="rounded-[10px] bg-primary w-[40px] h-[40px] flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-[1.01] sm:w-fit sm:px-5 hover:bg-[#38128A] transition-all duration-500 cursor-pointer">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <span className="hidden sm:block text-white text-sm">
                      Ứng tuyển
                    </span>
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
                        Hoàn thiện thông tin bên dưới để gửi hồ sơ ứng tuyển vị
                        trí này.
                      </div>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 px-1 py-4">
                    <div className="grid gap-3">
                      <Label htmlFor="description-1">Thư giới thiệu</Label>
                      <Textarea
                        className="leading-[24px]"
                        {...register("cover_letter")}
                      />
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                        <span>Resume</span>{" "}
                        <span className="text-red-600">*</span>
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
                            {previewURL ? fileName : "Tải resume"}
                          </span>
                        </div>
                      </Label>
                      <Input
                        id="files"
                        type="file"
                        hidden
                        onChange={(e) => {
                          handleFileChange(e);
                          if (e.target.files) {
                            setValue("resumeFile", e.target.files[0]);
                          }
                        }}
                      />
                      <p className="text-xs text-red-400 pt-2">
                        {errors.resumeFile?.message}
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <OutlineButton label="Hủy" />
                    </DialogClose>
                    <PrimaryButton
                      label="Xác nhận"
                      loadingText="Đang tải..."
                      disabled={pendingApply}
                      onClick={handleSubmit(onSubmit)}
                    />
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )
        )}
      </div>
    </div>
  );
};
