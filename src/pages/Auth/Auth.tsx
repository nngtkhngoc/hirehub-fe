import { useState } from "react";

import { BigLogo } from "@/components/ui/User/Logo";
import { SignIn } from "./components/layout/SignIn";
import { SignUp } from "./components/layout/SignUp";
import auth from "@/assets/illustration/auth.png";

interface TabContent {
  title: string;
  description: string;
}

export const Auth = () => {
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-in");

  const tabContents: Record<"sign-in" | "sign-up", TabContent> = {
    "sign-in": {
      title: "Chào mừng quay lại",
      description:
        "Tiếp tục hành trình tìm việc và kết nối cơ hội ngay hôm nay.",
    },
    "sign-up": {
      title: "Chào mừng đến với HireHub",
      description: "Bắt đầu tạo hồ sơ để mở ra cánh cửa đến công việc mơ ước.",
    },
  };

  const renderTabContents = () => {
    const content = tabContents[authTab];
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-[16px] font-bold text-black text-center">
          {content.title}
        </h2>
        <BigLogo />
        <p className="text-center font-light text-[12px]">
          {content.description}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full bg-cover bg-center flex items-center justify-center lg:py-10 min-h-screen">
      <div className="bg-white/73 py-10 px-2 md:px-8 rounded-[10px] shadow-[ -2px_4px_10px_0_#DFD2FA ] w-9/10 flex flex-col items-center gap-6 md:w-3/5 lg:w-4/5 lg:flex-row justify-end lg:gap-10">
        <div className="flex flex-col justify-center items-center gap-5">
          {renderTabContents()}

          <div className="flex justify-center items-center w-full h-[48x] shadow-[0_2px_10px_0_#DFD2FA] rounded-[10px] bg-white">
            <div className="flex flex-row gap-2 items-center py-2 px-2">
              <button
                className={`w-[130px] h-[33px] rounded-[10px] font-bold text-[13px] ${
                  authTab === "sign-in"
                    ? "bg-[#5E1EE6] text-white shadow-[0_4px_10px_0_#DFD2FA]"
                    : "text-[#5E1EE6]"
                }`}
                onClick={() => setAuthTab("sign-in")}
              >
                Đăng Nhập
              </button>
              <button
                className={`w-[130px] h-[33px] rounded-[10px] font-bold text-[13px] ${
                  authTab === "sign-up"
                    ? "bg-[#5E1EE6] text-white shadow-[0_4px_10px_0_#DFD2FA]"
                    : "text-[#5E1EE6]"
                }`}
                onClick={() => setAuthTab("sign-up")}
              >
                Đăng ký
              </button>
            </div>
          </div>

          {authTab === "sign-in" ? <SignIn /> : <SignUp />}
        </div>
        <img
          src={auth}
          alt="sign in"
          className="hidden lg:block lg:w-[500px]"
        />
      </div>
    </div>
  );
};
