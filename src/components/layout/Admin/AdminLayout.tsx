import { Outlet, Navigate, NavLink } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Users,
  Briefcase,
  AlertTriangle,
  LayoutDashboard,
  Home,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronDown,
  Sun,
  Moon,
  Search,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const navItems = [
  { path: "/", icon: Home, label: "Trang chủ" },
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { path: "/admin/users", icon: Users, label: "Quản lý Users" },
  { path: "/admin/jobs", icon: Briefcase, label: "Quản lý Jobs" },
  { path: "/admin/violations", icon: AlertTriangle, label: "Vi phạm" },
];

export const AdminLayout = () => {
  const { user } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  if (!user || user.role?.name?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                H
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-gray-800">HireHub Admin</span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft
                size={18}
                className={`text-gray-500 transition-transform ${sidebarCollapsed ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive && item.path !== "/"
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon size={20} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t border-gray-100 space-y-1">
            {/* Help Center with badge */}
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100">
              <div className="relative">
                <HelpCircle size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              {!sidebarCollapsed && <span>Help Center</span>}
            </button>

            {/* Settings */}
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100">
              <Settings size={20} />
              {!sidebarCollapsed && <span>Setting</span>}
            </button>

            {/* Theme Toggle */}
            {!sidebarCollapsed && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1 mt-2">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-all ${!darkMode
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                    }`}
                >
                  <Sun size={14} />
                  Light
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-all ${darkMode
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                    }`}
                >
                  <Moon size={14} />
                  Dark
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-64 bg-gray-50 border-gray-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                  ⌘ F
                </span>
              </div>

              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-6 ml-8">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Reports
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Analytics
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Logs
                </a>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell size={20} className="text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <MessageSquare size={20} className="text-gray-500" />
              </button>

              {/* Profile */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "Admin"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {user.name?.charAt(0) || "A"}
                    </span>
                  )}
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};
