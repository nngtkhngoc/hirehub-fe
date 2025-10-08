import { Menu, X } from "lucide-react";
import { Logo } from "../../ui/User/Logo";
import { OutlineButton } from "../../ui/User/Button";
import { useState } from "react";
import { Link } from "react-router";

interface NavLink {
  label: string;
  link: string;
}

export const Sidebar = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const navLinks: NavLink[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Việc làm", link: "/jobs" },
    { label: "Công ty", link: "/companies" },
    { label: "Kết nối", link: "/connect" },
  ];

  const location = window.location.pathname;
  const isActive = (link: string) => location === link;

  const renderNavLinks = () =>
    navLinks.map((navLink) => (
      <Link
        key={navLink.link}
        to={navLink.link}
        onClick={() => setIsOpenSidebar(false)}
        className={`text-[18px] text-center py-5 border-b border-zinc-100 transition ${
          isActive(navLink.link)
            ? "text-primary font-bold bg-zinc-50"
            : "text-gray-700 hover:bg-zinc-50"
        }`}
      >
        {navLink.label}
      </Link>
    ));

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-[#EBEBEB] relative">
      <Menu
        onClick={handleOpenSidebar}
        className="text-primary cursor-pointer"
      />
      <Logo />

      <OutlineButton label="Đăng ký" />

      {isOpenSidebar && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={handleOpenSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-30 flex flex-col bg-white w-full  h-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpenSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-4 border-b border-zinc-100 flex flex-row items-center justify-between">
          <Logo />
          <X
            onClick={handleOpenSidebar}
            className="text-primary cursor-pointer"
            size={30}
          />
        </div>
        <nav className="flex flex-col">{renderNavLinks()}</nav>
        <div className="p-6 mx-auto">
          <OutlineButton label="Đăng ký " />
        </div>
      </aside>
    </header>
  );
};
