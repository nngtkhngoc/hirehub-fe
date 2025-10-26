import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import resetpassword from "@/assets/illustration/resetpassword.png";
import { resetPassword } from "@/apis/auth.api";
import { Toaster } from "@/components/ui/sonner";

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [cfPassword, setCfPassword] = useState("");
  const [openPassword, setOpenPassword] = useState(false);
  const [openCfPassword, setOpenCfPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { email: string; token: string; newPassword: string }) =>
      resetPassword(data),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/auth"), 1000);
    },
    onError: (err) => {
      console.log(err);
      const message = "Có lỗi xảy ra khi đặt lại mật khẩu!";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.trim().length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== cfPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!token) {
      toast.error("Thiếu token xác thực!");
      return;
    }

    mutate({ email: email || "", token, newPassword: password });
  };

  return (
    <div className="w-full bg-cover bg-center flex items-center justify-center">
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

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Mật khẩu mới */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-[14px] font-semibold">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={openPassword ? "text" : "password"}
                    className="border-b border-primary font-light text-[14px] py-2 focus:outline-none w-full"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {openPassword ? (
                    <Eye
                      strokeWidth={0.75}
                      className="absolute top-2 right-0 cursor-pointer"
                      size={16}
                      onClick={() => setOpenPassword(false)}
                    />
                  ) : (
                    <EyeOff
                      strokeWidth={0.75}
                      className="absolute top-2 right-0 cursor-pointer"
                      size={16}
                      onClick={() => setOpenPassword(true)}
                    />
                  )}
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
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
                    value={cfPassword}
                    onChange={(e) => setCfPassword(e.target.value)}
                    required
                  />
                  {openCfPassword ? (
                    <Eye
                      strokeWidth={0.75}
                      className="absolute top-2 right-0 cursor-pointer"
                      size={16}
                      onClick={() => setOpenCfPassword(false)}
                    />
                  ) : (
                    <EyeOff
                      strokeWidth={0.75}
                      className="absolute top-2 right-0 cursor-pointer"
                      size={16}
                      onClick={() => setOpenCfPassword(true)}
                    />
                  )}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-row justify-center items-center gap-3">
                <OutlineButton label="Hủy" onClick={() => navigate("/auth")} />
                <PrimaryButton
                  label={isPending ? "Đang xử lý..." : "Xác nhận"}
                  disabled={isPending}
                />
              </div>
            </form>
          </div>

          <img src={resetpassword} alt="reset-password" />
          <Toaster />
        </div>
      </div>
    </div>
  );
};
