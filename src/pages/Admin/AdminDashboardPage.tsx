import { useQuery } from "@tanstack/react-query";
import { getAllUsersAdmin, getAllJobsAdmin, getAllReports, getAllResumesAdmin } from "@/apis/admin.api";
import { Users, Briefcase, AlertTriangle, FileText } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const AdminDashboardPage = () => {
    // Determine default month range based on current month
    const currentMonth = new Date().getMonth(); // 0-11
    const defaultStartMonth = currentMonth < 6 ? 0 : 6; // Jan(0) or Jul(6)
    const defaultEndMonth = currentMonth < 6 ? 5 : 11; // Jun(5) or Dec(11)

    const [startMonth, setStartMonth] = useState(defaultStartMonth);
    const [endMonth, setEndMonth] = useState(defaultEndMonth);

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

    const { data: resumesData } = useQuery({
        queryKey: ["admin-resumes-count"],
        queryFn: () => getAllResumesAdmin(),
    });

    // Fetch all users and jobs for chart data
    const { data: allUsersData } = useQuery({
        queryKey: ["admin-all-users-chart"],
        queryFn: () => getAllUsersAdmin({ size: 1000 }),
    });

    const { data: allJobsData } = useQuery({
        queryKey: ["admin-all-jobs-chart"],
        queryFn: () => getAllJobsAdmin({ size: 1000 }),
    });

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    // Generate monthly chart data
    const chartData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const monthlyData: { [key: number]: { users: number; jobs: number } } = {};

        // Initialize all months
        for (let i = 0; i < 12; i++) {
            monthlyData[i] = { users: 0, jobs: 0 };
        }

        // Count users by month
        if (allUsersData?.content) {
            allUsersData.content.forEach((user: { createdAt?: string }) => {
                if (user.createdAt) {
                    const date = new Date(user.createdAt);
                    if (date.getFullYear() === currentYear) {
                        const month = date.getMonth();
                        monthlyData[month].users++;
                    }
                }
            });
        }

        // Count jobs by month
        if (allJobsData?.content) {
            allJobsData.content.forEach((job: { postingDate?: string }) => {
                if (job.postingDate) {
                    const date = new Date(job.postingDate);
                    if (date.getFullYear() === currentYear) {
                        const month = date.getMonth();
                        monthlyData[month].jobs++;
                    }
                }
            });
        }

        // Filter by selected month range
        return monthNames
            .map((name, index) => ({
                name,
                monthIndex: index,
                "Người dùng": monthlyData[index].users,
                "Công việc": monthlyData[index].jobs,
            }))
            .filter((_, index) => index >= startMonth && index <= endMonth);
    }, [allUsersData, allJobsData, startMonth, endMonth]);

    const stats = [
        {
            label: "Tổng người dùng",
            value: usersData?.totalElements || 0,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Tổng công việc",
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
            label: "Hồ sơ ứng tuyển",
            value: resumesData?.length || 0,
            icon: FileText,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Bảng điều khiển
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

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Thống kê theo tháng ({new Date().getFullYear()})
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Từ:</span>
                        <Select
                            value={startMonth.toString()}
                            onValueChange={(val) => {
                                const newStart = parseInt(val);
                                setStartMonth(newStart);
                                if (newStart > endMonth) {
                                    setEndMonth(newStart);
                                }
                            }}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((name, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-500">Đến:</span>
                        <Select
                            value={endMonth.toString()}
                            onValueChange={(val) => {
                                const newEnd = parseInt(val);
                                setEndMonth(newEnd);
                                if (newEnd < startMonth) {
                                    setStartMonth(newEnd);
                                }
                            }}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((name, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="Người dùng"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="Công việc"
                                fill="#10B981"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Thao tác nhanh
                </h2>
                <div className="grid grid-cols-4 gap-4">
                    <a
                        href="/admin/users"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-[#7749DA]/10 to-[#38128A]/10 hover:from-[#7749DA]/20 hover:to-[#38128A]/20 transition-colors"
                    >
                        <Users size={20} className="text-primary" />
                        <span className="font-medium text-gray-700">Quản lý người dùng</span>
                    </a>
                    <a
                        href="/admin/jobs"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-[#7749DA]/10 to-[#38128A]/10 hover:from-[#7749DA]/20 hover:to-[#38128A]/20 transition-colors"
                    >
                        <Briefcase size={20} className="text-primary" />
                        <span className="font-medium text-gray-700">Quản lý công việc</span>
                    </a>
                    <a
                        href="/admin/resumes"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-[#7749DA]/10 to-[#38128A]/10 hover:from-[#7749DA]/20 hover:to-[#38128A]/20 transition-colors"
                    >
                        <FileText size={20} className="text-primary" />
                        <span className="font-medium text-gray-700">Quản lý hồ sơ</span>
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
        </div>
    );
};
