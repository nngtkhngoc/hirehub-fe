import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";

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
import {
  Bell,
  BriefcaseBusiness,
  LogOut,
  UserCircle,
  Shield,
  Users,
} from "lucide-react";
import { useSignOut } from "@/hooks/useAuth";
import {
  useNotifications,
  useUnreadNotificationCount,
  useNotificationActions,
} from "@/hooks/useNotification";
import { NotificationItem } from "@/components/ui/User/NotificationItem";
import type { Notification } from "@/types/Notification";
import { Badge } from "@/components/ui/badge";

interface NavLink {
  label: string;
  link: string;
}

export const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  console.log(items, "!@#");

  const navLinks: NavLink[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Việc làm", link: "/job-list" },
    { label: "Công ty", link: "/company-list" },
    { label: "Kết nối", link: "/user-list" },
    { label: "Nhắn tin", link: "/chat" },
  ];
  const location = window.location.pathname;
  const isActive = (link: string) => {
    if (link === "/") return location === "/";
    if (link === "/job-list" && location.startsWith("/job-details"))
      return true;
    if (link === "/company-list" && location.startsWith("/company-details"))
      return true;
    if (link === "/user-list" && location.startsWith("/user/")) return true;
    return location.startsWith(link);
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

  // Notification hooks
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: notificationsData, isFetching } = useNotifications(page, 10);
  const { markAsRead, markAllAsRead } = useNotificationActions();

  // Append notifications when page changes
  useEffect(() => {
    if (!notificationsData) return;
    console.log(notificationsData.content, "notificationsData");
    setItems(() => {
      return [...notificationsData.content];
    });
  }, [notificationsData]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle notification click
  const handleNotificationClick = (noti: Notification) => {
    console.log("Notification clicked:", noti);
    console.log("Redirect URL:", noti.redirectUrl);
    if (!noti.isRead) {
      markAsRead.mutate(noti.id);
    }
    if (noti.redirectUrl) {
      setShowNotifications(false);
      nav(noti.redirectUrl);
    }
  };

  return (
    <header className="flex justify-between items-center md:px-10 lg:px-20 h-[75px] border boder-b border-[#EBEBEB]">
      <Logo />
      <nav className="flex justify-around items-center gap-[32px]">
        {renderNavLinks()}
      </nav>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        {user && (
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {unreadCount > 0 && (
                <Badge
                  className="min-w-5 h-5 rounded-full px-1 absolute -right-1 -top-1 flex items-center justify-center"
                  variant="destructive"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}

              <Bell size={22} className="text-gray-600" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-xl">Thông báo</h3>
                  <div className="flex gap-2">
                    <button className="text-blue-500 text-sm font-medium hover:underline">
                      Tất cả
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="text-gray-500 text-sm hover:underline">
                      Chưa đọc
                    </button>
                  </div>
                </div>

                {/* Notification List */}
                <div className="max-h-[450px] overflow-y-auto">
                  {items.length === 0 && !isFetching ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell size={40} className="mx-auto mb-2 text-gray-300" />
                      <p>Không có thông báo mới</p>
                    </div>
                  ) : (
                    items.map((noti) => (
                      <NotificationItem
                        key={noti.id}
                        notification={noti}
                        onClick={handleNotificationClick}
                      />
                    ))
                  )}

                  {/* Load more */}
                  {notificationsData &&
                    page + 1 < notificationsData.totalPages && (
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        className="w-full p-3 text-blue-500 text-sm font-medium hover:bg-gray-50 border-t"
                        disabled={isFetching}
                      >
                        {isFetching ? "Đang tải..." : "Xem thông báo trước đó"}
                      </button>
                    )}
                </div>

                {/* Mark all as read */}
                {items.some((item) => !item.isRead) && items.length > 0 && (
                  <div className="border-t">
                    <button
                      onClick={() => markAllAsRead.mutate()}
                      className="w-full p-3 text-primary hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* User Avatar / Login */}
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

                {/* User (Candidate) Only Links */}
                {user.role?.name?.toLowerCase() !== "admin" &&
                  user.role?.name?.toLowerCase() !== "recruiter" && (
                    <>
                      <DropdownMenuItem>
                        <Link
                          to="/my-jobs"
                          className="flex flex-row items-center justify-start gap-2"
                        >
                          <BriefcaseBusiness className="text-[16px]" />
                          Công việc
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          to="/my-connections"
                          className="flex flex-row items-center justify-start gap-2"
                        >
                          <Users className="text-[16px]" />
                          Kết nối
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

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
      </div>
    </header>
  );
};
