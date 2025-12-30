import { Outlet, Navigate, NavLink } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import {
    LayoutDashboard,
    Briefcase,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronDown,
    Sun,
    Moon,
    Search,
    Bell,
    MessageSquare,
    Home,
    FileText,
    Users,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const recruitmentSubItems = [
    { path: "/recruiter/jobs", label: "Việc làm", icon: FileText },
    { path: "/recruiter/candidates", label: "Ứng viên", icon: Users },
];

export const RecruiterLayout = () => {
    const { user } = useAuthStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [recruitmentOpen, setRecruitmentOpen] = useState(true);

    if (!user || user.role?.name?.toLowerCase() !== "recruiter") {
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
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold">
                                H
                            </div>
                            {!sidebarCollapsed && (
                                <span className="font-bold text-gray-800">HireHub</span>
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
                        {/* Back to Home */}
                        <NavLink
                            to="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-100"
                        >
                            <Home size={20} />
                            {!sidebarCollapsed && <span className="font-medium">Trang chủ</span>}
                        </NavLink>

                        {/* Dashboard */}
                        <NavLink
                            to="/recruiter"
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? "bg-primary text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <LayoutDashboard size={20} />
                            {!sidebarCollapsed && <span className="font-medium">Bảng điều khiển</span>}
                        </NavLink>

                        {/* Recruitment Section */}
                        <div className="pt-4">
                            <button
                                onClick={() => setRecruitmentOpen(!recruitmentOpen)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-100 ${sidebarCollapsed ? "justify-center" : "justify-between"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Briefcase size={20} className="text-primary" />
                                    {!sidebarCollapsed && (
                                        <span className="font-medium">Tuyển dụng</span>
                                    )}
                                </div>
                                {!sidebarCollapsed && (
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${recruitmentOpen ? "" : "-rotate-90"
                                            }`}
                                    />
                                )}
                            </button>

                            {/* Sub items */}
                            {recruitmentOpen && !sidebarCollapsed && (
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                                    {recruitmentSubItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive
                                                        ? "text-primary bg-primary/10 font-medium"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                    }`
                                                }
                                            >
                                                <Icon size={18} />
                                                {item.label}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <NavLink
                            to="/recruiter/profile"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? "bg-primary text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Settings size={20} />
                            {!sidebarCollapsed && <span className="font-medium">Hồ sơ</span>}
                        </NavLink>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Search */}
                        <div className="flex items-center gap-4">
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                                <Bell size={20} className="text-gray-500" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                                <MessageSquare size={20} className="text-gray-500" />
                            </button>
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
