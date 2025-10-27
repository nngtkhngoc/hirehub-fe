import { Link, useNavigate } from "react-router";

import { OutlineButton } from "../../ui/User/Button";
import { Logo } from "../../ui/User/Logo";

interface NavLink {
  label: string;
  link: string;
}

export const Header = () => {
  const navLinks: NavLink[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Việc làm", link: "/job-list" },
    { label: "Công ty", link: "/company-list" },
    { label: "Kết nối", link: "/user-list" },
  ];
  const location = window.location.pathname;
  const isActive = (link: string) => {
    return location === link;
  };
  const renderNavLinks = () => {
    return navLinks.map((navLink) => (
      <Link
        key={navLink.link}
        to={navLink.link}
        className={
          isActive(navLink.link)
            ? "text-primary font-bold text-[18px]"
            : "text-[18px]"
        }
      >
        {navLink.label}
      </Link>
    ));
  };

  const nav = useNavigate();
  const handleLogin = () => {
    nav("/auth");
  };

  return (
    <header className="flex justify-between items-center md:px-10 lg:px-20 h-[75px] border boder-b border-[#EBEBEB]">
      <Logo />
      <nav className="flex justify-around items-center gap-[32px]">
        {renderNavLinks()}
      </nav>
      <OutlineButton label="Đăng nhập" onClick={handleLogin} />
    </header>
  );
};
