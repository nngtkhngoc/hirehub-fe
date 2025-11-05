import { ExperienceCard } from "../ui/ExperienceCard";
import { experiences } from "@/mock/experience.mock";
import type { UserProfile } from "@/types/Auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit3, PlusCircle, SquarePen } from "lucide-react";
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

export const Experiences = ({ user }: { user: UserProfile }) => {
  const renderExperiences = () =>
    user.experiences?.map((ex, index) => (
      <ExperienceCard
        experience={ex}
        lastCard={index == experiences.length - 1 ? true : false}
      />
    ));

  const { data: companies } = useRecruiter();
  console.log(companies);
  const isMedium = useMediaQuery("(min-width:768px)");

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
          <div className="font-bold text-[16px] md:text-[20px]">
            Kinh nghiệm
          </div>
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
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <div className="flex flex-row items-center gap-2 text-[12px] md:text-[14px] text-black cursor-pointer">
                        <PlusCircle
                          size={isMedium ? 16 : 12}
                          className="text-black"
                        />
                        <span>Thêm mới</span>{" "}
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] ">
                      <DialogHeader>
                        <DialogTitle>
                          <div className="px-1">Chỉnh sửa thông tin cơ bản</div>
                        </DialogTitle>
                        <DialogDescription>
                          <div className="px-1 leading-[24px]">
                            Cập nhật hồ sơ của bạn tại đây. Nhấn "Xác nhận" để
                            ghi lại những thay đổi.
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 px-1 py-4">
                        <div className="grid gap-3">
                          <Label htmlFor="title">Vị trí</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="vd: Frontend Developer Intern"
                            // defaultValue={user.name || ""}
                            // onChange={(e) => {
                            //   setUserData((prev) => ({
                            //     ...prev,
                            //     name: e.target.value,
                            //   }));
                            // }}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="username-1">Công ty</Label>
                          <div
                            className="flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                            focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                          >
                            <Select
                            // onValueChange={(v) => setProvince(v)}
                            >
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
                          // onClick={handleSubmit}
                          // disabled={isPending}
                          loadingText="Đang tải..."
                        />
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
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
        </div>
        <div className=" flex-col gap-4">{renderExperiences()}</div>
      </div>
    </div>
  );
};
