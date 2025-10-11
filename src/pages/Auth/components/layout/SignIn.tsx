import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import google from "@/assets/icons/google.png";

export const SignIn = () => {
  const [openPassword, setOpenPassword] = useState(false);

  return (
    <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-6 py-10 gap-6 flex flex-col w-full">
      <form className="flex flex-col gap-5">
        <div className="flex flex-col ">
          <label htmlFor="email" className="text-[14px] font-semibold">
            Email
          </label>
          <input
            type="text"
            className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
            placeholder="example@gmail.com"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[14px] font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              type={openPassword ? "text" : "password"}
              className="border-b border-primary font-light text-[14px] py-2 focus:outline-none w-full"
              placeholder="********"
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
      </form>

      <div className="w-full flex flex-col gap-3">
        <PrimaryButton label="Đăng Nhập" paddingX="w-full" />
        <div className="text-center text-[12px] text-[#263238]">hoặc</div>
        <OutlineButton
          label={
            <div className="w-full flex flex-row gap-2 justify-center items-center">
              <img src={google} alt="google" className="w-[20px] h-[20px]" />
              <span className="text-[12px] ">Đăng nhập bằng Google</span>
            </div>
          }
        />
      </div>
    </div>
  );
};
