/* eslint-disable react-refresh/only-export-components */
import type { Study, UpdateStudyData } from "@/types/Study";
import universityDefault from "@/assets/illustration/univeristy.png";
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

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  Trash2,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useDeleteStudy,
  useUniversity,
  useUpdateStudy,
} from "@/hooks/useStudy";
import type { University } from "@/types/University";

export const updateStudySchema: yup.ObjectSchema<UpdateStudyData> = yup.object({
  universityId: yup.string().required("Vui lòng chọn trường học"),
  major: yup.string().nullable(),
  degree: yup.string().required("Vui lòng chọn bằng cấp"),
  startDate: yup.string().required("Vui lòng chọn ngày bắt đầu"),
  endDate: yup.string().nullable(),
});

const degreeOptions = [
  "Tốt nghiệp THPT",
  "Trung cấp",
  "Cao đẳng",
  "Đại học",
  "Thạc sĩ",
  "Tiến sĩ",
];

export const StudyCard = ({
  study,
  lastCard,
}: {
  study: Study;
  lastCard: boolean;
}) => {
  const startDate = study?.startDate ? new Date(study?.startDate) : undefined;
  const endDate = study?.endDate ? new Date(study?.endDate) : new Date();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteStudy();

  const handleDeleteExperience = () => {
    deleteMutate(study?.id?.toString());
  };

  const { data: universities } = useUniversity();

  const [updateStartDate, setUpdateStartDate] = useState<Date | undefined>(
    startDate
  );
  const [updateEndDate, setUpdateEndDate] = useState<Date | undefined>(
    study?.endDate ? endDate : undefined
  );
  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);
  const [openUniversity, setOpenUniversity] = useState(false);
  const [university, setUniversity] = useState<University | undefined>(
    undefined
  );

  const { mutate, isPending } = useUpdateStudy();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateStudyData>({
    resolver: yupResolver(updateStudySchema),
    defaultValues: {
      universityId: study?.university?.id?.toString() || "",
      major: study?.major || "",
      degree: study?.degree || "",
      startDate: updateStartDate?.toISOString().split("T")[0],
      endDate: updateEndDate?.toISOString().split("T")[0],
    },
  });

  return (
    <div
      className={`w-full py-6 flex flex-row items-center gap-4 justify-left relative ${
        lastCard ? "" : "border-b border-[#BCBCBC]"
      }`}
    >
      <div className="absolute top-6 right-0 flex flex-row items-center gap-3 ">
        {/* Edit experience */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[425px]">
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
            <form
              onSubmit={handleSubmit((data: UpdateStudyData) => {
                mutate(
                  { id: study?.id?.toString() || "", data },
                  { onSuccess: () => setOpenDialog(false) }
                );
              })}
            >
              <div className="grid gap-4 px-1 py-4">
                {/* University */}{" "}
                <div className="grid gap-3">
                  <Label>
                    <span>
                      Trường <span className="text-red-600">*</span>
                    </span>
                  </Label>

                  <Popover
                    open={openUniversity}
                    onOpenChange={setOpenUniversity}
                  >
                    <PopoverTrigger asChild>
                      <div
                        role="combobox"
                        aria-expanded={openUniversity}
                        className="cursor-pointer !font-primary flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                            focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                      >
                        {university ? (
                          <div className="flex flex-row items-center gap-1 text-[13px] text-black">
                            <img
                              src={
                                universities?.find(
                                  (u) => u?.id === university?.id
                                )?.logo || universityDefault
                              }
                              className="w-6 h-6 rounded-full object-cover mr-2"
                              alt=""
                            />{" "}
                            {
                              universities?.find(
                                (u) => u?.id === university?.id
                              )?.name
                            }
                          </div>
                        ) : (
                          "Chọn trường học"
                        )}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Tìm kiếm trường học..."
                          className="text-[13px]"
                          {...register("universityId")}
                        />
                        <CommandList>
                          <CommandEmpty>
                            Không tìm thấy trường học.
                          </CommandEmpty>
                          <CommandGroup>
                            {universities?.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={u.name}
                                onSelect={() => {
                                  setUniversity(u);
                                  setValue("universityId", u.id?.toString(), {
                                    shouldValidate: true,
                                  });
                                  setOpenUniversity(false);
                                }}
                                className="text-[13px]"
                              >
                                <img
                                  src={u.logo || universityDefault}
                                  className="w-6 h-6 rounded-full object-cover mr-2"
                                  alt={u.name}
                                />
                                {u.name}
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    university?.id === u.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {errors.universityId?.message && (
                    <span className="text-xs text-red-400 pt-1">
                      {errors.universityId?.message}
                    </span>
                  )}
                </div>
                {/* Major */}{" "}
                <div className="grid gap-3">
                  <Label>Chuyên ngành</Label>
                  <Input
                    placeholder="vd: Software Engineer"
                    {...register("major")}
                  />
                  {errors.major?.message && (
                    <span className="text-xs text-red-400">
                      {errors.major?.message}
                    </span>
                  )}
                </div>
                {/* Degree */}
                <div className="grid gap-3">
                  <Label htmlFor="degree">
                    <span>
                      Bằng cấp <span className="text-red-600">*</span>
                    </span>
                  </Label>

                  <div
                    className="flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                                           focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  >
                    <Select
                      onValueChange={(v) =>
                        setValue("degree", v, {
                          shouldValidate: true,
                        })
                      }
                      {...register("degree")}
                    >
                      <SelectTrigger className="!border-none !shadow-none !px-0 text-[13px] text-black">
                        <SelectValue placeholder="Chọn bằng cấp" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Loại hình</SelectLabel>
                          {degreeOptions?.map((degree, indx) => (
                            <SelectItem
                              key={indx}
                              value={degree}
                              className="text-black group cursor-pointer"
                            >
                              <div>{degree}</div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>{" "}
                  </div>
                  {errors.degree?.message && (
                    <span className="text-xs text-red-400 ">
                      {errors.degree?.message}
                    </span>
                  )}
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
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="input"
                          id="date"
                          className={cn(
                            "w-48 justify-between font-normal w-full text-[13px]",
                            !updateStartDate && "text-muted-foreground"
                          )}
                        >
                          {updateStartDate
                            ? updateStartDate.toLocaleDateString()
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
                          selected={updateStartDate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setUpdateStartDate(date);
                            setValue(
                              "startDate",
                              date?.toISOString().split("T")[0] ?? "",
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          {...register("startDate")}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate?.message && (
                      <span className="text-xs text-red-400 pt-2">
                        {errors.startDate?.message}
                      </span>
                    )}
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
                            !updateEndDate && "text-muted-foreground"
                          )}
                        >
                          {updateEndDate
                            ? updateEndDate.toLocaleDateString()
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
                          selected={updateEndDate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setUpdateEndDate(date);
                            setValue(
                              "endDate",
                              date?.toISOString().slice(0, 10) ?? "",
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          {...register("endDate")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <OutlineButton
                    label="Hủy"
                    onClick={() => setOpenDialog(false)}
                  />
                </DialogClose>
                <PrimaryButton
                  type="submit"
                  label="Xác nhận"
                  loadingText="Đang tải..."
                  disabled={isPending}
                />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete experience */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash2 className="text-red-600 w-[17px] cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="!font-primary">
                Bạn có chắc muốn xóa học vấn này?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-primary">
                Hành động này không thể hoàn tác. Học vấn sẽ bị xóa vĩnh viễn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={handleDeleteExperience}
              >
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="rounded-full border-2 border-[#F2F2F2] w-[60px] h-[60px] overflow-hidden flex items-center justify-center shrink-0 ">
        <img
          src={study?.university?.logo || universityDefault}
          alt={study?.university?.name}
          className="object-contain w-[30px] h-[30px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[18px] font-bold"> {study?.university?.name}</div>
        <div className="flex flex-col gap-1">
          <div className="text-[14px] text-[#888888] font-regular">
            {study?.major}
          </div>
          <div className="flex flex-row items-center justify-left gap-1 sm:gap-3">
            <div className="text-[12px] font-regular text-[#a6a6a6]">
              T{startDate?.getMonth()}/{startDate?.getFullYear()} -{" "}
              {study?.endDate ? (
                <span>
                  T{endDate?.getMonth()}/{endDate?.getFullYear()}
                </span>
              ) : (
                "Hiện tại"
              )}
            </div>
            <div className="text-[12px] font-regular text-[#a6a6a6]">•</div>
            <div className="text-[12px] font-regular text-[#a6a6a6]">
              {study?.degree}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
