import { Link, useNavigate } from "react-router";
import { useState } from "react";

import { Menu, X } from "lucide-react";

import { OutlineButton } from "../../ui/User/Button";
import { Logo } from "../../ui/User/Logo";
import { useAuthStore } from "@/stores/useAuthStore";
import profile from "@/assets/illustration/default_profile.webp";
import { LogOut, UserCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/useAuth";

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

  const nav = useNavigate();
  const handleLogin = () => {
    nav("/auth");
  };

  const user = useAuthStore((state) => state.user);

  const { mutate: handleSignOut, isPending } = useSignOut();
  const handleLogout = () => {
    handleSignOut();
  };

  return (
    <header className=" flex justify-between items-center px-6 py-4 border-b border-[#EBEBEB] relative">
      <Menu
        onClick={handleOpenSidebar}
        className="text-primary cursor-pointer"
      />
      <Logo />

      {user ? (
        <div className="w-[50px] h-[50px] object-cover rounded-full overflow-hidden cursor-pointer">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <img
                src={user.avatar ? user.avatar : profile}
                alt="avatar"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex flex-row items-center justify-start gap-2">
                  <UserCircle className="text-[16px]" />
                  Profile
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <button
                  className="flex flex-row items-center justify-start gap-2"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  <LogOut className="text-[16px]" />
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <OutlineButton label="Đăng nhập" onClick={handleLogin} />
      )}

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
          {user ? (
            <OutlineButton label="Đăng xuất" onClick={handleLogout} />
          ) : (
            <OutlineButton label="Đăng nhập" onClick={handleLogin} />
          )}
        </div>
      </aside>
    </header>
  );
};
