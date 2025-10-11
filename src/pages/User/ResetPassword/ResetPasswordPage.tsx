import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { KeyRound } from "lucide-react";

import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import resetpassword from "@/assets/illustration/resetpassword.png";

export const ResetPasswpordPage = () => {
  const [openPassword, setOpenPassword] = useState(false);
  const [openCfPassword, setOpenCfPassword] = useState(false);

  return (
    <div className="w-full bg-cover bg-center flex items-center justify-center ">
      <div className="bg-white/73 px-6 py-20 md:px-8 rounded-[10px] shadow-[ -2px_4px_10px_0_#DFD2FA ] w-9/10 flex flex-col items-center gap-6 md:w-3/5 lg:w-max-[820px] lg:h-[534px] lg:flex-row justify-center lg:gap-10">
        <div className="flex flex-col justify-center items-center gap-15 lg:flex-row">
          <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-8 sm:px-8 py-10 gap-6 flex flex-col max-w-[340px]">
            <div className="flex flex-row items-center justify-start w-full gap-5">
              <div className="min-w-[50px] min-h-[50px] rounded-[5px] flex items-center justify-center shadow-[0_2px_10px_#DFD2FA]">
                <KeyRound size={24} className="text-primary" />
              </div>
              <div>
                <div className="font-bold text-[20px]">Đổi mật khẩu</div>
                <div className="text-[12px] font-light text-[#263238]">
                  Thay đổi mật khẩu của bạn tại đây
                </div>
              </div>
            </div>

            <form className="flex flex-col gap-5">
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
                <label
                  htmlFor="cfPassword"
                  className="text-[14px] font-semibold"
                >
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

            <div className="flex flex-row justify-center items-center gap-3">
              <OutlineButton label="Hủy" />
              <PrimaryButton label="Xác nhận" />
            </div>
          </div>

          <img src={resetpassword} alt="reset-password" />
        </div>
      </div>
    </div>
  );
};
