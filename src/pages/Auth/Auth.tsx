import authbg from "@/assets/images/authbg.png";
import { BigLogo } from "@/components/ui/User/Logo";
import { useState } from "react";

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
      <>
        <h2 className="text-[16px] font-bold text-black text-center">
          {content.title}
        </h2>
        <BigLogo />
        <p className="text-center font-light text-[12px]">
          {content.description}
        </p>
      </>
    );
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center "
      style={{
        backgroundImage: `url(${authbg})`,
      }}
    >
      <div className="bg-white/73 py-10 px-8 rounded-[10px] shadow-[ -2px_4px_10px_0_#DFD2FA ] w-9/10 flex flex-col items-center">
        {renderTabContents()}

        <div className="flex justify-center items-center w-full h-[48x] shadow-[0_2px_10px_0_#DFD2FA] rounded-[10px] bg-white">
          <div className="py-2 ">
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

        {/* Form */}
        <div className="mt-6 w-full">
          {authTab === "sign-in" ? (
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="border rounded-md p-2"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="border rounded-md p-2"
              />
              <button className="bg-primary text-white rounded-md py-2 mt-2">
                Đăng nhập
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Tên đầy đủ"
                className="border rounded-md p-2"
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded-md p-2"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="border rounded-md p-2"
              />
              <button className="bg-primary text-white rounded-md py-2 mt-2">
                Đăng ký
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
