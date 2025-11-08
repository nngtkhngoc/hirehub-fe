/* eslint-disable react-refresh/only-export-components */
import type { Experience, UpdateExperienceFormData } from "@/types/Experience";
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
  useDeleteExperience,
  useUpdateExperience,
} from "@/hooks/useExperience";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  Link,
  SquarePen,
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
import { useRecruiter } from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import companyDefault from "@/assets/illustration/company.png";
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

export const updateExperienceSchema: yup.ObjectSchema<UpdateExperienceFormData> =
  yup.object({
    companyId: yup.string().required("Vui lòng chọn công ty"),
    position: yup.string().required("Vui lòng nhập vị trí"),
    type: yup.string().required("Vui lòng chọn loại công việc"),
    startDate: yup.string().required("Vui lòng chọn ngày bắt đầu"),
    endDate: yup.string().nullable(),
    image: yup.mixed<File>().nullable(),
    description: yup.string().nullable(),
  });
interface Type {
  label: string;
  value: string;
}

export const ExperienceCard = ({
  experience,
  lastCard,
  key,
}: {
  experience: Experience;
  lastCard: boolean;
  key: number;
}) => {
  const startDate = experience?.startDate
    ? new Date(experience?.startDate)
    : undefined;
  const endDate = experience?.endDate
    ? new Date(experience?.endDate)
    : new Date();

  const calculateTime = () => {
    if (!startDate) return "N/A";

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) return `${months} tháng`;
    if (months === 0) return `${years} năm`;
    return `${years} năm ${months} tháng`;
  };

  const formatDate = (date: Date | null | undefined) =>
    date ? `T${date.getMonth() + 1}/${date.getFullYear()}` : "N/A";

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteExperience();

  const handleDeleteExperience = () => {
    deleteMutate(experience?.id?.toString());
  };

  const { data: companies } = useRecruiter();
  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [openCompany, setOpenCompany] = useState(false);
  const [company, setCompany] = useState(experience.company);
  const [updateStartDate, setUpdateStartDate] = useState<Date | undefined>(
    startDate
  );
  const [updateEndDate, setUpdateEndDate] = useState<Date | undefined>(
    experience?.endDate ? new Date(experience?.endDate) : undefined
  );
  console.log(updateEndDate, "hello");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewURL(URL.createObjectURL(file));
    setFileName(file.name);
  };
  const { mutate, isPending } = useUpdateExperience();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateExperienceFormData>({
    resolver: yupResolver(updateExperienceSchema),
    defaultValues: {
      companyId: experience?.company?.id,
      position: experience?.position,
      startDate: updateStartDate?.toISOString().split("T")[0],
      type: experience?.type,
      endDate: updateEndDate?.toISOString().split("T")[0],
      image: experience?.image,
      description: experience?.description,
    },
  });

  const types: Type[] = [
    { label: "Part-time", value: "part-time" },
    { label: "Full-time", value: "full-time" },
    { label: "Thực tập", value: "internship" },
    { label: "Tình nguyện", value: "voluntary" },
  ];
  return (
    <div
      className={`w-full py-6 flex flex-row items-center gap-4 justify-left relative ${
        lastCard ? "" : "border-b border-[#BCBCBC]"
      }`}
      key={key}
    >
      <div className="absolute top-6 right-0 flex flex-row items-center gap-3 ">
        <SquarePen
          className="w-[17px]"
          onClick={() => {
            setOpenDialog(true);
          }}
        />

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
              onSubmit={handleSubmit((data: UpdateExperienceFormData) => {
                console.log("Send data:", data);
                mutate(
                  { id: experience?.id?.toString() || "", data },
                  { onSuccess: () => setOpenDialog(false) }
                );
              })}
            >
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
                  {errors.position?.message && (
                    <span className="text-xs text-red-400">
                      {errors.position?.message}
                    </span>
                  )}
                </div>

                {/* Type */}
                <div className="grid gap-3">
                  <Label htmlFor="type">
                    <span>
                      Loại hình <span className="text-red-600">*</span>
                    </span>
                  </Label>

                  <div
                    className="flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                            focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  >
                    <Select
                      onValueChange={(v) =>
                        setValue("type", v, {
                          shouldValidate: true,
                        })
                      }
                      {...register("type")}
                    >
                      <SelectTrigger className="!border-none !shadow-none !px-0 text-[13px] text-black">
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Loại hình</SelectLabel>
                          {types?.map((type, indx) => (
                            <SelectItem
                              key={indx}
                              value={type.value}
                              className="text-black group cursor-pointer"
                            >
                              <div>{type.label}</div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>{" "}
                  </div>
                  {errors.type?.message && (
                    <span className="text-xs text-red-400 ">
                      {errors.type?.message}
                    </span>
                  )}
                </div>

                {/* Company */}
                <div className="grid gap-3">
                  <Label>
                    <span>
                      Công ty <span className="text-red-600">*</span>
                    </span>
                  </Label>

                  <Popover open={openCompany} onOpenChange={setOpenCompany}>
                    <PopoverTrigger asChild>
                      <div
                        role="combobox"
                        aria-expanded={openCompany}
                        className="cursor-pointer !font-primary flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                            focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                      >
                        {company ? (
                          <div className="flex flex-row items-center gap-1 text-[13px] text-black">
                            <img
                              src={
                                companies?.find((c) => c.id === company.id)
                                  ?.avatar || companyDefault
                              }
                              className="w-6 h-6 rounded-full object-cover mr-2"
                              alt=""
                            />{" "}
                            {companies?.find((c) => c.id === company.id)?.name}
                          </div>
                        ) : (
                          "Chọn công ty"
                        )}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Tìm kiếm công ty..."
                          className="text-[13px]"
                          {...register("companyId")}
                        />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy công ty.</CommandEmpty>
                          <CommandGroup>
                            {companies?.map((c) => (
                              <CommandItem
                                key={c.id}
                                value={c.id}
                                onSelect={() => {
                                  setCompany(c);
                                  setValue("companyId", c.id, {
                                    shouldValidate: true,
                                  });
                                  setOpenCompany(false);
                                }}
                                className="text-[13px]"
                              >
                                <img
                                  src={c.avatar || companyDefault}
                                  className="w-6 h-6 rounded-full object-cover mr-2"
                                  alt=""
                                />
                                {c.name}
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    company.id === c.id
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

                  {errors.companyId?.message && (
                    <span className="text-xs text-red-400 pt-1">
                      {errors.companyId?.message}
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
                        setValue("image", e.target.files[0], {
                          shouldValidate: true,
                        });
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
                    <span className="text-xs text-zinc-500 break-all">
                      {fileName}
                    </span>
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
                Bạn có chắc muốn xóa kinh nghiệm này?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-primary">
                Hành động này không thể hoàn tác. Kinh nghiệm sẽ bị xóa vĩnh
                viễn.
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

      <div className="rounded-full border-2 border-[#F2F2F2] w-[60px] h-[60px] overflow-hidden flex items-center justify-center shrink-0">
        <img
          src={experience?.company?.avatar || ""}
          alt={experience?.company?.name || ""}
          className="object-contain w-[30px] h-[30px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4 justify-start text-[18px] font-bold">
          <div>{experience?.company?.name}</div>
          <div className="px-3 py-1 bg-[#DFDEDE] rounded-[30px] flex items-center justify-center text-[10px] font-light capitalize">
            {experience?.type}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[14px] text-[#888888] font-regular">
            {experience?.position}
          </div>

          <div className="flex flex-row items-center gap-1 sm:gap-3 text-[12px] text-[#a6a6a6]">
            <span>
              {formatDate(startDate)} -{" "}
              {experience?.endDate ? formatDate(endDate) : "Hiện tại"}
            </span>
            <span>•</span>
            <span>{calculateTime()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
