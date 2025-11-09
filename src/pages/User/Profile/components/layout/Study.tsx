/* eslint-disable react-refresh/only-export-components */
import type { UserProfile } from "@/types/Auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckIcon,
  CheckLine,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  Edit3,
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
import { Input } from "@/components/ui/input";
import universityDefault from "@/assets/illustration/univeristy.png";
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
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StudyCard } from "../ui/StudyCard";
import type { CreateStudyData } from "@/types/Study";
import { useCreateStudy, useUniversity } from "@/hooks/useStudy";
import type { University } from "@/types/University";

export const createStudySchema: yup.ObjectSchema<CreateStudyData> = yup.object({
  userId: yup.string().required(),
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

export const Study = ({ user }: { user: UserProfile }) => {
  const [editable, setEditable] = useState(false);

  const renderStudies = () =>
    user?.studies?.map((std, index) => (
      <StudyCard
        study={std}
        lastCard={index == user?.studies.length - 1 ? true : false}
        key={std?.id}
        editable={editable}
      />
    ));

  const isMedium = useMediaQuery("(min-width:768px)");

  const { data: universities } = useUniversity();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);
  const [openUniversity, setOpenUniversity] = useState(false);
  const [university, setUniversity] = useState<University | undefined>(
    undefined
  );

  const { mutate, isPending } = useCreateStudy();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateStudyData>({
    resolver: yupResolver(createStudySchema),
    defaultValues: {
      userId: user?.id ?? "",
      universityId: "",
      major: "",
      degree: "",
      startDate: "",
      endDate: undefined,
    },
  });
  useEffect(() => {
    if (user?.id) {
      setValue("userId", user.id);
    }
  }, [user, setValue]);
  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6] relative">
          <div className="font-bold text-[16px] md:text-[20px]">Học vấn</div>{" "}
          {editable && (
            <div
              onClick={() => {
                setEditable(false);
              }}
              className="absolute top-6 right-23 flex flex-row items-center gap-2 text-[12px] font-regular text-zinc-500 cursor-pointer md:text-[14px]"
            >
              <CheckLine />
              <span>Hoàn tất</span>
            </div>
          )}
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
                  setEditable(true);
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  <div className="px-1">Thêm học vấn</div>
                </DialogTitle>
                <DialogDescription>
                  <div className="px-1 leading-[24px]">
                    Thêm thông tin về học vấn của bạn ở đây
                  </div>
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(
                  (data: CreateStudyData) => {
                    mutate(data, {
                      onSuccess: () => setOpenDialog(false),
                    });
                  },
                  (errors) => {
                    console.log("Validation errors:", errors);
                  }
                )}
              >
                <input type="hidden" {...register("userId")} />
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
                    <Label htmlFor="major">Chuyên ngành</Label>
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
                                date?.toISOString().slice(0, 10) ?? "",
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
        </div>
        <div className=" flex-col gap-4">{renderStudies()}</div>
      </div>
    </div>
  );
};
