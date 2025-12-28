import { useRef, useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SignUpRecruiterData } from "@/types/Auth";
import { useSignUpRecruiter } from "@/hooks/useAuth";
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import google from "@/assets/icons/google.png";

type SignUpRecruiterFormData = SignUpRecruiterData & {
  confirmPassword: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    name: yup.string().required("Vui lòng nhập tên công ty"),
    foundedYear: yup
      .number()
      .typeError("Vui lòng nhập năm hợp lệ")
      .min(1900, "Năm phải lớn hơn 1900")
      .max(new Date().getFullYear(), "Năm không được lớn hơn hiện tại")
      .default(undefined),
    numberOfEmployees: yup.string().default(undefined),
    password: yup
      .string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  })
  .required();

export const SignUpRecruiter = ({
  ref,
  setAuthTab,
}: {
  ref?: React.RefObject<HTMLInputElement>;
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
    setValue,
  } = useForm<SignUpRecruiterFormData>({
    resolver: yupResolver(
      schema
    ) as unknown as Resolver<SignUpRecruiterFormData>,
    mode: "onBlur",
  });
  const { mutate, isPending } = useSignUpRecruiter(() => {
    setAuthTab("sign-in");
  });

  const onSubmit: SubmitHandler<SignUpRecruiterFormData> = (data) => {
    const payload = (({
      email,
      name,
      password,
      foundedYear,
      numberOfEmployees,
    }) => ({
      email,
      name,
      password,
      foundedYear,
      numberOfEmployees,
    }))(data);
    mutate({ ...payload, roleId: 3 });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
          <span className="text-xs text-red-400 pt-2">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Company name */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-[14px] font-semibold">
          Tên công ty
        </label>
        <input
          id="name"
          type="text"
          placeholder="Công ty TNHH ABC"
          className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-xs text-red-400 pt-2">
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Năm & nhân viên */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col gap-3 w-1/2">
          <label htmlFor="foundedYear" className="text-[13px] font-semibold">
            Năm thành lập
          </label>
          <input
            id="foundedYear"
            type="number"
            placeholder="VD: 2015"
            className="border-b border-primary font-light text-[14px] py-2 focus:outline-none"
            {...register("foundedYear")}
          />
          {errors.foundedYear && (
            <span className="text-xs text-red-400 pt-2">
              {errors.foundedYear.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 w-1/2">
          <label
            htmlFor="numberOfEmployees"
            className="text-[13px] font-semibold"
          >
            Số lượng nhân viên
          </label>
          <Select
            onValueChange={(value) =>
              setValue("numberOfEmployees", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full text-[13px]">
              <SelectValue placeholder="Chọn số lượng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small" className="text-[13px]">
                {"< 50"}
              </SelectItem>
              <SelectItem value="medium" className="text-[13px]">
                {"> 50 & < 100"}
              </SelectItem>
              <SelectItem value="big" className="text-[13px]">
                {"> 100"}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.numberOfEmployees && (
            <span className="text-xs text-red-400 pt-2">
              {errors.numberOfEmployees.message}
            </span>
          )}
        </div>
      </div>

      {/* Password */}
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

      {/* Confirm Password */}
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
