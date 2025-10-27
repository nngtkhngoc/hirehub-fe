import { useState } from "react";
import { BadgeQuestionMark } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import forgetpassword from "@/assets/illustration/forgetpassword.png";
import mailsent from "@/assets/illustration/mailsent.png";
import { sendPasswordReset } from "@/apis/auth.api";
import { Toaster } from "@/components/ui/sonner";

export const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const nav = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: sendPasswordReset,
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (err) => {
      toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(email);
  };

  if (success) {
    return (
      <div className="w-full bg-cover bg-center flex items-center justify-center">
        <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-8 sm:px-8 py-10 gap-6 flex flex-col max-w-[370px] items-center justify-center">
          <img
            src={mailsent}
            alt="sent mail successfully"
            className="w-fit h-fit"
          />
          <div className="font-bold text-[20px] text-center whitespace-nowrap">
            Mail đã được gửi thành công!
          </div>
          <div className="text-[12px] font-light text-[#263238] text-center">
            Vui lòng kiểm tra email để chuyển sang bước tiếp theo.
          </div>
          <PrimaryButton
            label="Quay lại đăng nhập"
            onClick={() => nav("/auth/sign-in")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/73 px-6 py-20 md:px-8 rounded-[10px] shadow-[ -2px_4px_10px_0_#DFD2FA ] w-9/10 flex flex-col items-center gap-6 md:w-3/5 lg:w-max-[820px] lg:h-[534px] lg:flex-row justify-center lg:gap-10">
        <div className="flex flex-col justify-center items-center gap-15 lg:flex-row">
          <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-8 sm:px-8 py-10 gap-6 flex flex-col max-w-[340px]">
            <div className="flex flex-row items-center justify-start w-full gap-5">
              <div className="min-w-[50px] min-h-[50px] rounded-[5px] flex items-center justify-center shadow-[0_2px_10px_#DFD2FA]">
                <BadgeQuestionMark size={24} className="text-primary" />
              </div>
              <div>
                <div className="font-bold text-[20px]">Quên mật khẩu</div>
                <div className="text-[12px] font-light text-[#263238]">
                  Nhập email đã đăng ký để cài lại mật khẩu
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[14px] font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div className="flex flex-row justify-center items-center gap-3">
                <OutlineButton
                  label="Hủy"
                  onClick={() => nav("/auth/sign-in")}
                />
                <PrimaryButton
                  label={isPending ? "Đang gửi..." : "Xác nhận"}
                  disabled={isPending}
                />
              </div>
            </form>
          </div>

          <img
            src={forgetpassword}
            alt="forget-password"
            className="hidden lg:block"
          />
        </div>

        <Toaster position="top-center" />
      </div>
    </div>
  );
};
