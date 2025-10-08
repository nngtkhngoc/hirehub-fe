import { Link, useNavigate } from "react-router";
import { Logo } from "../../ui/User/Logo";
import { OutlineButton } from "../../ui/User/Button";

interface NavLink {
  label: string;
  link: string;
}

export const Header = () => {
  const navLinks: NavLink[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Việc làm", link: "/jobs" },
    { label: "Công ty", link: "/companies" },
    { label: "Kết nối", link: "/connect" },
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
    nav("/login");
  };

  return (
    <header className="flex justify-between items-center px-20 h-[75px] border boder-b border-[#EBEBEB]">
      <Logo />
      <nav className="flex justify-around items-center gap-[32px]">
        {renderNavLinks()}
      </nav>
      <OutlineButton label="Đăng nhập" onClick={handleLogin} />
    </header>
  );
};
