import { Link, useNavigate } from "react-router";

import { OutlineButton } from "../../ui/User/Button";
import { Logo } from "../../ui/User/Logo";
import { useAuthStore } from "@/stores/useAuthStore";
import profile from "@/assets/illustration/default_profile.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BriefcaseBusiness, LogOut, UserCircle, Shield, Users } from "lucide-react";
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
    { label: "Nhắn tin", link: "/chat" },
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
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  to="/profile"
                  className="flex flex-row items-center justify-start gap-2"
                >
                  <UserCircle className="text-[16px]" />
                  Hồ sơ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/my-jobs"
                  className="flex flex-row items-center justify-start gap-2"
                >
                  <BriefcaseBusiness className="text-[16px]" />
                  Công việc
                </Link>
              </DropdownMenuItem>

              {/* Admin Dashboard Link */}
              {user.role?.name?.toLowerCase() === "admin" && (
                <DropdownMenuItem>
                  <Link
                    to="/admin"
                    className="flex flex-row items-center justify-start gap-2"
                  >
                    <Shield className="text-[16px]" />
                    Quản trị
                  </Link>
                </DropdownMenuItem>
              )}

              {/* Recruiter Dashboard Link */}
              {user.role?.name?.toLowerCase() === "recruiter" && (
                <DropdownMenuItem>
                  <Link
                    to="/recruiter"
                    className="flex flex-row items-center justify-start gap-2"
                  >
                    <Users className="text-[16px]" />
                    Tuyển dụng
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem>
                <button
                  className="flex flex-row items-center justify-start gap-2"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  <LogOut className="text-[16px]" />
                  Đăng xuất
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
