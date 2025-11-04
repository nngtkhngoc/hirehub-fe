/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import type { SignInData } from "@/types/Auth";
import google from "@/assets/icons/google.png";
import { signIn } from "@/apis/auth.api";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Địa chỉ email không hợp lệ")
      .required("Vui lòng nhập email"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
  })
  .required();

export const SignIn = ({ ref }: { ref: any }) => {
  const [openPassword, setOpenPassword] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const nav = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      toast.success("Đăng nhập thành công!", {
        duration: 1000,
      });
      setUser(data.data);
      setTimeout(() => nav("/"), 500);
    },
    onError: (err) => {
      toast.error("Đăng nhập thất bại!", {
        duration: 1000,
      });
      console.log(err);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignInData> = (profile) => {
    mutate(profile);
  };

  return (
    <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-6 sm:px-8 py-10 gap-6 flex flex-col">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-[14px] font-semibold">
            Email
          </label>
          <input
            {...register("email")}
            className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
            placeholder="example@gmail.com"
            ref={(el) => {
              register("email").ref(el);
              if (typeof ref === "function") ref(el);
              else if (ref)
                (ref as React.RefObject<HTMLInputElement | null>).current = el;
            }}
          />{" "}
          <p className="text-xs text-red-400 pt-2">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[14px] font-semibold">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={openPassword ? "text" : "password"}
              {...register("password")}
              className="border-b border-primary font-light text-[14px] py-2 focus:outline-none w-full"
              placeholder="********"
            />
            <p className="text-xs text-red-400 pt-2">
              {errors.password?.message}
            </p>

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

        <Link
          to="/auth/forget-password"
          className="text-[12px] font-semibold text-right underline text-primary"
        >
          Quên mật khẩu?
        </Link>
        <PrimaryButton
          label={isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          disabled={isPending}
          paddingX="w-full"
        />
      </form>

      <div className="w-full flex flex-col gap-3">
        <div className="text-center text-[12px] text-[#263238]">hoặc</div>
        <OutlineButton
          label={
            <div className="w-full flex flex-row gap-2 justify-center items-center">
              <img src={google} alt="google" className="w-[20px] h-[20px]" />
              <span className="text-[12px]">Đăng nhập bằng Google</span>
            </div>
          }
        />
      </div>
    </div>
  );
};
