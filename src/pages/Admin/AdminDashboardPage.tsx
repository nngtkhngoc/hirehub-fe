import { useQuery } from "@tanstack/react-query";
import { getAllUsersAdmin, getAllJobsAdmin, getAllReports } from "@/apis/admin.api";
import { Users, Briefcase, AlertTriangle, TrendingUp } from "lucide-react";

export const AdminDashboardPage = () => {
    const { data: usersData } = useQuery({
        queryKey: ["admin-users-count"],
        queryFn: () => getAllUsersAdmin({ size: 1 }),
    });

    const { data: jobsData } = useQuery({
        queryKey: ["admin-jobs-count"],
        queryFn: () => getAllJobsAdmin({ size: 1 }),
    });

    const { data: reportsData } = useQuery({
        queryKey: ["admin-reports-count"],
        queryFn: () => getAllReports({ status: "pending", size: 1 }),
    });

    const stats = [
        {
            label: "Tổng Users",
            value: usersData?.totalElements || 0,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Tổng Jobs",
            value: jobsData?.totalElements || 0,
            icon: Briefcase,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
        },
        {
            label: "Báo cáo chờ xử lý",
            value: reportsData?.totalElements || 0,
            icon: AlertTriangle,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            label: "Recruiter chờ duyệt",
            value: 0, // Will be calculated from pending recruiters
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                    Xin chào! Đây là tổng quan hệ thống HireHub.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stat.value.toLocaleString()}
                                </p>
                            </div>
                            <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                            >
                                <stat.icon size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Thao tác nhanh
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a
                        href="/admin/users"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-[#7749DA]/10 to-[#38128A]/10 hover:from-[#7749DA]/20 hover:to-[#38128A]/20 transition-colors"
                    >
                        <Users size={20} className="text-primary" />
                        <span className="font-medium text-gray-700">Quản lý Users</span>
                    </a>
                    <a
                        href="/admin/jobs"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-[#7749DA]/10 to-[#38128A]/10 hover:from-[#7749DA]/20 hover:to-[#38128A]/20 transition-colors"
                    >
                        <Briefcase size={20} className="text-primary" />
                        <span className="font-medium text-gray-700">Quản lý Jobs</span>
                    </a>
                    <a
                        href="/admin/violations"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-[#7749DA]/10 to-[#38128A]/10 hover:from-[#7749DA]/20 hover:to-[#38128A]/20 transition-colors"
                    >
                        <AlertTriangle size={20} className="text-primary" />
                        <span className="font-medium text-gray-700">Xử lý vi phạm</span>
                    </a>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Hoạt động gần đây
                </h2>
                <div className="text-center py-8 text-gray-400">
                    <p>Chưa có hoạt động nào được ghi lại</p>
                </div>
            </div>
        </div>
    );
};
