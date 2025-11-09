import type { UserProfile } from "@/types/Auth";
import { Edit3, X } from "lucide-react";
import { SkillCard } from "../ui/SkillCard";
import { useMediaQuery } from "@mui/material";
import { useSkill } from "@/hooks/useSkill";
import { useEffect, useState } from "react";
import type { Skill } from "@/types/Skill";
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
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { Label } from "@/components/ui/label";
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
import { useUpdateUser } from "@/hooks/useUser";

export const Skills = ({ user }: { user: UserProfile }) => {
  const renderSkills = () =>
    user?.skills?.map((skill) => <SkillCard text={skill.name} />);
  const isMedium = useMediaQuery("(min-width:768px)");

  const [updateSkills, setUpdateSkills] = useState<Skill[] | undefined>(
    user?.skills
  );

  useEffect(() => {
    setUpdateSkills(user?.skills);
  }, [user?.skills]);

  const { data: listSkills } = useSkill();
  const skillOptions = listSkills?.filter(
    (skill) => !updateSkills?.some((s) => s.name === skill.name)
  );

  const [openSkills, setOpenSkills] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { mutate, isPending } = useUpdateUser();

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("id", user?.id);

    updateSkills?.forEach((skill) => {
      formData.append("skillIds", skill.id);
    });

    mutate(formData);
    setOpenEditDialog(false);
  };

  const renderSelectedSkills = () =>
    updateSkills?.map((skill) => (
      <div className="flex items-center gap-1 rounded-[10px] w-fit border-2 boder-[#CCCCCC] h-[40px] px-[8px] font-medium text-[14px] flex flex-row items-center justify-center">
        {skill.name}
        <button
          onClick={() =>
            setUpdateSkills(updateSkills.filter((s) => s.name !== skill.name))
          }
          className="hover:bg-zinc-200 w-[20px] h-[20px] flex items-center justify-center rounded-full"
        >
          <X className="w-[14px] text-red-600 cursor-pointer " />
        </button>
      </div>
    ));

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
        <div className="font-bold text-[16px] md:text-[20px]">Kĩ năng</div>
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
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
                  <div className="px-1">Chỉnh sửa kĩ năng của bạn</div>
                </DialogTitle>
                <DialogDescription>
                  <span className="px-1 leading-[24px]">
                    Cập nhật kĩ năng của bạn tại đây. Nhấn "Xác nhận" để ghi lại
                    những thay đổi.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 px-1 py-4">
                <div className="grid gap-3">
                  <Label>
                    <span>
                      Kĩ năng <span className="text-red-600">*</span>
                    </span>
                  </Label>

                  <Popover open={openSkills} onOpenChange={setOpenSkills}>
                    <PopoverTrigger asChild>
                      <div
                        role="combobox"
                        aria-expanded={openSkills}
                        className="cursor-pointer !font-primary flex flex-row items-center gap-2 px-2 text-[#888888] file:text-foreground placeholder:text-zinc-400 selection:bg-primary selection:text-primary dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                            focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                      >
                        Chọn kĩ năng
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-full p-0"
                      align="start"
                      side="bottom"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Tìm kiếm kĩ năng..."
                          className="text-[13px]"
                        />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy kĩ năng.</CommandEmpty>
                          <CommandGroup>
                            {skillOptions?.map((u) => (
                              <CommandItem
                                key={u.id}
                                value={u.name}
                                onSelect={() => {
                                  setUpdateSkills([...(updateSkills || []), u]);
                                  setOpenSkills(false);
                                }}
                                className="text-[13px]"
                              >
                                {u.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  {renderSelectedSkills()}
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
      </div>
      <div className="gap-3 w-4/5 flex flex-row flex-wrap pt-4">
        {renderSkills()}
      </div>
    </div>
  );
};
