/* eslint-disable react-refresh/only-export-components */
import { ExperienceCard } from "../ui/ExperienceCard";
import { experiences } from "@/mock/experience.mock";
import type { UserProfile } from "@/types/Auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  Edit3,
  Link,
  PlusCircle,
  SquarePen,
} from "lucide-react";
import { useMediaQuery } from "@mui/material";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { useRecruiter } from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import companyDefault from "@/assets/illustration/company.png";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreateExperienceFormData } from "@/types/Experience";
import { useCreateExperience } from "@/hooks/useExperience";
import { useProfile } from "@/hooks/useAuth";

export const createExperienceSchema: yup.ObjectSchema<CreateExperienceFormData> =
  yup.object({
    userId: yup.string().required(),
    companyId: yup.string().required("Vui lòng chọn công ty"),
    position: yup.string().required("Vui lòng nhập vị trí"),
    startDate: yup.string().required("Vui lòng chọn ngày bắt đầu"),
    endDate: yup.string().nullable(),
    image: yup.mixed<File>().nullable(),
    description: yup.string().nullable(),
  });

export const Experiences = ({
  user,
  setUserData,
}: {
  user: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile>>;
}) => {
  const [lastCard, setLastCard] = useState<number>(
    user.experiences?.length - 1
  );

  const renderExperiences = () =>
    user.experiences?.map((ex, index) => (
      <ExperienceCard experience={ex} lastCard={index == lastCard} />
    ));

  useEffect(() => {
    setLastCard(user.experiences?.length - 1);
  }, [user]);

  const { data: companies } = useRecruiter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const isMedium = useMediaQuery("(min-width:768px)");
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewURL(URL.createObjectURL(file));
    setFileName(file.name);
  };
  const { mutate, isPending } = useCreateExperience();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateExperienceFormData>({
    resolver: yupResolver(createExperienceSchema),
    defaultValues: {
      userId: user?.id ?? "",
      companyId: "",
      position: "",
      startDate: "",
      endDate: undefined,
      image: undefined,
      description: undefined,
    },
  });

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6] relative">
          <div className="font-bold text-[16px] md:text-[20px]">
            Kinh nghiệm
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <div className=" absolute top-6 right-7 flex flex-row items-center gap-2 text-[12px] font-regular text-primary cursor-pointer md:text-[14px]">
                <Edit3 size={isMedium ? 16 : 12} />
                <span>Sửa</span>
              </div>
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpenDialog(true);
                }}
              >
                <button
                  className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-black cursor-pointer"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  <PlusCircle
                    size={isMedium ? 16 : 12}
                    className="text-black"
                  />
                  <span>Thêm mới</span>{" "}
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  // handleSelectFile();
                }}
              >
                <div className="flex flex-row items-center gap-2 text-[12px] font-regular cursor-pointer md:text-[13px]">
                  <SquarePen size={isMedium ? 16 : 12} className="text-black" />
                  <span>Chỉnh sửa</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>{" "}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <form>
              <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                  <DialogTitle>
                    <div className="px-1">Thêm kinh nghiệm</div>
                  </DialogTitle>
                  <DialogDescription>
                    <div className="px-1 leading-[24px]">
                      Thêm vị trí làm việc mới của bạn ở đây
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 px-1 py-4">
                  {/* Position */}
                  <div className="grid gap-3">
                    <Label htmlFor="title">
                      <span>
                        Vị trí <span className="text-red-600">*</span>
                      </span>
                    </Label>
                    <Input
                      placeholder="vd: Frontend Developer Intern"
                      {...register("position")}
                    />
                    <p className="text-xs text-red-400 pt-2">
                      {errors.position?.message}
                    </p>
                  </div>

                  {/* Company */}
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">
                      <span>
                        Công ty <span className="text-red-600">*</span>
                      </span>
                    </Label>
                    <div
                      className="flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                            focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    >
                      <Select onValueChange={(v) => setValue("companyId", v)}>
                        <SelectTrigger className="!border-none !shadow-none !px-0 text-[13px] text-black">
                          <SelectValue placeholder="Chọn công ty" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Công ty</SelectLabel>
                            {companies?.map((company) => (
                              <SelectItem
                                key={company.id}
                                value={company.id}
                                className="text-black group cursor-pointer"
                              >
                                <div className="flex flex-row items-center justify-start gap-2 py-1 group-hover:text-primary">
                                  <img
                                    src={company.avatar || companyDefault}
                                    className="w-8 h-8 rounded-full object-cover object-center"
                                  />
                                  <div>{company.name}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>{" "}
                      <p className="text-xs text-red-400 pt-2">
                        {errors.companyId?.message}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="w-full flex flex-row gap-5">
                    {/* StartDate */}
                    <div className="flex flex-col gap-3 w-1/2">
                      <Label htmlFor="startDate">
                        <span>
                          Ngày bắt đầu <span className="text-red-600">*</span>
                        </span>
                      </Label>
                      <Popover
                        open={openCalendarStart}
                        onOpenChange={setOpenCalendarStart}
                        defaultOpen
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="input"
                            id="date"
                            className={cn(
                              "w-48 justify-between font-normal w-full text-[13px]",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            {startDate
                              ? startDate.toLocaleDateString()
                              : "Chọn ngày"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={startDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              setStartDate(date);
                              setValue(
                                "startDate",
                                date?.toISOString().slice(0, 10) ?? ""
                              );
                            }}
                            {...register("startDate")}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-red-400 pt-2">
                        {errors.startDate?.message}
                      </p>
                    </div>

                    {/* EndDate */}
                    <div className="flex flex-col gap-3 w-1/2">
                      <Label htmlFor="date">Ngày kết thúc</Label>
                      <Popover
                        open={openCalendarEnd}
                        onOpenChange={setOpenCalendarEnd}
                        defaultOpen
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="input"
                            id="date"
                            className={cn(
                              "w-48 justify-between font-normal w-full text-[13px]",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            {endDate
                              ? endDate.toLocaleDateString()
                              : "Chọn ngày"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={endDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              setEndDate(date);
                              setValue(
                                "endDate",
                                date?.toISOString().slice(0, 10) ?? ""
                              );
                            }}
                            {...register("endDate")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="grid gap-3">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      placeholder="Mô tả về kinh nghiệm của bạn"
                      rows={3}
                      {...register("description")}
                    />
                  </div>

                  {/* Files */}
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                      Hình ảnh
                    </div>
                    <span className="text-xs italic text-zinc-500">
                      Thêm hình ảnh mô tả khoảng thời gian làm việc của bạn
                    </span>
                    <Label htmlFor="files">
                      <div
                        className={cn(
                          "file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          "!text-zinc-500 flex flex-row items-center gap-1"
                        )}
                      >
                        <Link size={15} />
                        <span className="!font-normal !text-[14px]">
                          Thêm ảnh mới
                        </span>
                      </div>
                    </Label>
                    <Input
                      id="files"
                      placeholder="vd: Frontend Developer Intern"
                      type="file"
                      hidden
                      onChange={(e) => {
                        handleFileChange(e);
                        if (e.target.files) {
                          setValue("image", e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  {previewURL && (
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
                  )}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <OutlineButton
                      label="Hủy"
                      onClick={() => setOpenDialog(false)}
                    />
                  </DialogClose>
                  <PrimaryButton
                    label="Xác nhận"
                    loadingText="Đang tải..."
                    onClick={handleSubmit((data: CreateExperienceFormData) => {
                      data.userId = user.id;

                      console.log("Send data:", data);
                      mutate(data, {
                        onSuccess: () => {
                          setOpenDialog(false);
                        },
                      });
                    })}
                    disabled={isPending}
                  />
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
        <div className=" flex-col gap-4">{renderExperiences()}</div>
      </div>
    </div>
  );
};
