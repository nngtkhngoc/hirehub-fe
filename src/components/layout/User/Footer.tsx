import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronUp,
  Home,
  Mail,
  PhoneCall,
  Send,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { PrimaryButton } from "../../ui/User/Button";
import { Logo } from "../../ui/User/Logo";
import { Link } from "react-router";
import twitter from "../../../assets/icons/twitter.png";
import instagram from "../../../assets/icons/instagram.png";
import facebook from "../../../assets/icons/facebook.png";
import { useState } from "react";

interface FooterNavItem {
  label: string;
  link: string;
  icon: LucideIcon;
}

interface ContactInfor {
  icon: LucideIcon;
  content: string;
}

export const Footer = () => {
  const navItems: FooterNavItem[] = [
    { label: "Trang chủ", link: "/", icon: Home },
    { label: "Việc làm", link: "/jobs", icon: BriefcaseBusiness },
    { label: "Công ty", link: "/companies", icon: Building2 },
    { label: "Kết nối", link: "/connect", icon: UserPlus },
  ];
  const renderNavItem = () => {
    return navItems.map((item) => (
      <Link
        to={item.link}
        key={item.link}
        className="flex items-center gap-2 md:pb-0 py-5 md:border-none border-b border-[#A6A6A6] w-fit"
      >
        <item.icon size={16} />
        <span className="font-light text-[15px]">{item.label}</span>
      </Link>
    ));
  };

  const contactInfor: ContactInfor[] = [
    { icon: PhoneCall, content: "+0123 456 789" },
    { icon: Mail, content: "example@gmail.com" },
    { icon: Send, content: "Gửi thông tin liên hệ" },
  ];
  const renderContactInfor = () => {
    return contactInfor.map((item) => (
      <div
        className="flex flex-row gap-[13px] items-center font-light"
        key={item.content}
      >
        <item.icon size={24} />
        <span className="text-[15px]">{item.content}</span>
      </div>
    ));
  };

  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <footer className="md:h-[350px]">
      <section className="flex flex-col px-8 py-8 gap-1 md:gap-0 md:h-[300px]  md:flex-row justify-between md:items-center md:px-20 bg-gradient-to-r from-[#F7F6F8] to-[#EEE5FF]">
        <section className="flex flex-col justify-between items-center md:items-start md:w-[400px] gap-[16px] pb-10 md:pb-0">
          <Logo />
          <p className="font-light text-[12px] md:text-[14px] text-justify text-[#263238] md:w-[340px] leading-[24px]">
            Nền tảng tuyển dụng hiện đại, nơi các doanh nghiệp dễ dàng tìm kiếm
            ứng viên phù hợp và ứng viên nhanh chóng tiếp cận những cơ hội việc
            làm chất lượng
          </p>
          <div>
            <PrimaryButton label="Bắt đầu ngay" />
          </div>
        </section>

        <section className="flex flex-col md:justify-between items-start md:w-[370px] gap-0 md:gap-[16px]">
          <div
            className="flex flex-row justify-between items-center w-full border-y border-[#A6A6A6] md:py-0 md:border-none"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <h2 className="font-extrabold py-5 md:py-0">Về HireHub</h2>
            {isNavOpen ? (
              <ChevronUp className="block md:hidden cursor-pointer" />
            ) : (
              <ChevronDown className="block md:hidden cursor-pointer" />
            )}
          </div>

          <div
            className={`flex flex-col md:block transition-all duration-300 overflow-hidden w-full ${
              isNavOpen ? "max-h-60" : "max-h-0 md:max-h-none hidden md:block"
            }`}
          >
            {renderNavItem()}
          </div>
        </section>

        <section className="flex flex-col justify-between items-start md:w-[370px] gap-[16px] md:py-0 py-5">
          <h2 className="font-extrabold">Liên hệ để hợp tác tại</h2>
          <div className="flex flex-row gap-2 items-center">
            <img
              src={instagram}
              alt="instagram"
              className="object-cover w-7 h-7"
            />
            <img src={facebook} alt="facebook" />
            <img
              src={twitter}
              alt="twitter"
              className="object-cover h-6 pl-1"
            />
          </div>
          <div className="flex flex-col gap-[15px]">{renderContactInfor()}</div>
        </section>
      </section>

      <section className="text-center flex justify-center items-center h-[50px] bg-[#212737] text-[#C7C7C7] text-[14px]">
        Copyright © 2025 HireHub. All rights reserved.
      </section>
    </footer>
  );
};
