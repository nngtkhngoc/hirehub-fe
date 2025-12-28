/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { SignUpCandidateData } from "@/types/Auth";
import { useSignUpCandidate } from "@/hooks/useAuth";
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import google from "@/assets/icons/google.png";

type SignUpCandidateFormData = SignUpCandidateData & {
  confirmPassword: string;
};

const schema: yup.ObjectSchema<SignUpCandidateFormData> = yup
  .object({
    email: yup
      .string()
      .email("Địa chỉ email không hợp lệ")
      .required("Vui lòng nhập email"),
    name: yup.string().required("Vui lòng nhập họ và tên"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  })
  .required();

export const SignUpCandidate = ({
  ref,
  setAuthTab,
}: {
  ref: any;
  setAuthTab: React.Dispatch<React.SetStateAction<"sign-in" | "sign-up">>;
}) => {
  const [openPassword, setOpenPassword] = useState(false);
  const [openCfPassword, setOpenCfPassword] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref && emailRef.current) {
      emailRef.current.focus();
    }
  }, [ref]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpCandidateFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const { mutate, isPending } = useSignUpCandidate(() => {
    setAuthTab("sign-in");
  });

  const onSubmit: SubmitHandler<SignUpCandidateFormData> = (data) => {
    const payload = (({ email, name, password }) => ({
      email,
      name,
      password,
    }))(data);
    mutate({ ...payload, roleId: 1 });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-[14px] font-semibold">
          Email
        </label>
        <input
          id="email"
          type="text"
          placeholder="example@gmail.com"
          className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
          {...register("email")}
          ref={(el) => {
            register("email").ref(el);
            if (ref && el) ref.current = el;
          }}
        />
        {errors.email && (
          <span className="text-red-500 text-xs  pt-2">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Họ và tên */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-[14px] font-semibold">
          Họ và tên
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nguyen Van A"
          className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-xs text-red-400 pt-2">
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Mật khẩu */}
      <div className="flex flex-col">
        <label htmlFor="password" className="text-[14px] font-semibold">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="password"
            type={openPassword ? "text" : "password"}
            placeholder="********"
            className="border-b border-primary font-light text-[14px] py-2 focus:outline-none w-full"
            {...register("password")}
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
        {errors.password && (
          <span className="text-xs text-red-400 pt-2">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Xác nhận mật khẩu */}
      <div className="flex flex-col">
        <label htmlFor="confirmPassword" className="text-[14px] font-semibold">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={openCfPassword ? "text" : "password"}
            placeholder="********"
            className="border-b border-primary font-light text-[14px] py-2 focus:outline-none w-full"
            {...register("confirmPassword")}
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
        {errors.confirmPassword && (
          <span className="text-xs text-red-400 pt-2">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>
      <div className="w-full flex flex-col gap-3">
        <PrimaryButton
          label="Đăng ký"
          paddingX="w-full"
          type="submit"
          loadingText="Đang tải..."
          disabled={isPending}
          loading={isPending}
        />
        <div className="text-center text-[12px] text-[#263238]">hoặc</div>
        <OutlineButton
          label={
            <div className="w-full flex flex-row gap-2 justify-center items-center">
              <img src={google} alt="google" className="w-[20px] h-[20px]" />
              <span className="text-[12px]">Đăng ký bằng Google</span>
            </div>
          }
        />
      </div>
    </form>
  );
};
