import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const SignUpCandidate = () => {
  const [openPassword, setOpenPassword] = useState(false);
  const [openCfPassword, setOpenCfPassword] = useState(false);

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
          Họ và tên
        </label>
        <input
          type="text"
          id="fname"
          className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
          placeholder="Nguyen Van A"
          required
        />
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
