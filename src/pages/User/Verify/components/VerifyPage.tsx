import { Mail } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import verify from "@/assets/illustration/verify.png";

export const VerifyPage = () => {
  return (
    <div className="w-full bg-cover bg-center flex items-center justify-center ">
      <div className="bg-white/73 px-6 py-20 md:px-8 rounded-[10px] shadow-[ -2px_4px_10px_0_#DFD2FA ] w-9/10 flex flex-col items-center gap-6 md:w-3/5 lg:w-max-[820px] lg:h-[534px] lg:flex-row justify-end lg:gap-10">
        <div className="flex flex-col justify-center items-center gap-5 lg:flex-row">
          <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-4 sm:px-8 py-10 gap-6 flex flex-col max-w-[340px]">
            <div className="flex flex-row items-center justify-start w-full gap-5">
              <div className="min-w-[50px] min-h-[50px] rounded-[5px] flex items-center justify-center shadow-[0_2px_10px_#DFD2FA]">
                <Mail size={24} className="text-primary" />
              </div>
              <div>
                <div className="font-bold text-[20px]">Kiểm tra email</div>
                <div className="text-[12px] font-light text-[#263238]">
                  Chúng tôi đã gửi mã code tới example@gmail.com
                </div>
              </div>
            </div>

            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="text-[12px] text-center">
              <span className="font-light"> Không nhận được mã? </span>
              <span className="text-primary underline font-bold">
                Nhấn để gửi lại
              </span>
            </div>

            <div className="flex flex-row justify-center items-center gap-3">
              <OutlineButton label="Hủy" />
              <PrimaryButton label="Xác thực" />
            </div>
          </div>

          <img
            src={verify}
            alt="verify"
            className="hidden lg:block lg:w-[360px]"
          />
        </div>
      </div>
    </div>
  );
};
