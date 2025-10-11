import { ChevronDownIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const SignUpRecruiter = () => {
  const [openPassword, setOpenPassword] = useState(false);
  const [openCfPassword, setOpenCfPassword] = useState(false);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <form className="flex flex-col gap-5">
      <div className="flex flex-col ">
        <label htmlFor="email" className="text-[14px] font-semibold">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
          placeholder="example@gmail.com"
          required
        />
      </div>

      <div className="flex flex-col ">
        <label htmlFor="fname" className="text-[14px] font-semibold">
          Tên công ty
        </label>
        <input
          type="text"
          id="fname"
          className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
          placeholder="Công ty TNHH Abc"
          required
        />
      </div>

      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col gap-3 w-1/2">
          <label htmlFor="date" className="text-[13px] font-semibold">
            Ngày thành lập
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className={cn(
                  "w-48 justify-between font-normal w-full text-[13px]",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? date.toLocaleDateString() : "Chọn ngày"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3 w-1/2">
          <label htmlFor="employees" className="text-[13px] font-semibold">
            Số lượng nhân viên
          </label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Chọn số lượng"
                className="text-[13px]"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small" className="text-[13px]">
                {"< 50"}
              </SelectItem>
              <SelectItem value="medium" className="text-[13px]">
                {"> 50 & < 100"}
              </SelectItem>
              <SelectItem value="large" className="text-[13px]">
                {"> 100"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="text-[14px] font-semibold">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            type={openPassword ? "text" : "password"}
            className="border-b border-primary font-light text-[14px] py-2 focus:outline-none w-full"
            placeholder="********"
            required
            id="pasword"
          />
          {openPassword ? (
            <Eye
              strokeWidth={0.75}
              className="absolute top-2 right-0 cursor-pointer"
              size={16}
              onClick={() => {
                setOpenPassword(false);
              }}
            />
          ) : (
            <EyeOff
              strokeWidth={0.75}
              className="absolute top-2 right-0 cursor-pointer"
              size={16}
              onClick={() => {
                setOpenPassword(true);
              }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="cfPassword" className="text-[14px] font-semibold">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <input
            type={openCfPassword ? "text" : "password"}
            className="border-b border-primary font-light text-[14px] py-2 focus:outline-none w-full"
            placeholder="********"
            required
            id="cfPasword"
          />
          {openCfPassword ? (
            <Eye
              strokeWidth={0.75}
              className="absolute top-2 right-0 cursor-pointer"
              size={16}
              onClick={() => {
                setOpenCfPassword(false);
              }}
            />
          ) : (
            <EyeOff
              strokeWidth={0.75}
              className="absolute top-2 right-0 cursor-pointer"
              size={16}
              onClick={() => {
                setOpenCfPassword(true);
              }}
            />
          )}
        </div>
      </div>
    </form>
  );
};
