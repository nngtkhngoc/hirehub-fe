import { Link, useNavigate } from "react-router";

import { OutlineButton } from "../../ui/User/Button";
import { Logo } from "../../ui/User/Logo";
import { useAuthStore } from "@/stores/useAuthStore";
import profile from "@/assets/illustration/profile.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle } from "lucide-react";
import { useSignOut } from "@/hooks/useAuth";

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
            ? "text-primary font-bold text-[16px]"
            : "text-[16px]"
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

  const user = useAuthStore((state) => state.user);
  const { mutate: handleSignOut, isPending } = useSignOut();
  const handleLogout = () => {
    handleSignOut();
  };

  return (
    <header className="flex justify-between items-center md:px-10 lg:px-20 h-[75px] border boder-b border-[#EBEBEB]">
      <Logo />
      <nav className="flex justify-around items-center gap-[32px]">
        {renderNavLinks()}
      </nav>
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
    </header>
  );
};
