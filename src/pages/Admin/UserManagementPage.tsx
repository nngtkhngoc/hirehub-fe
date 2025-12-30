import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsersAdmin, verifyUser, banUser, unbanUser } from "@/apis/admin.api";
import { toast } from "sonner";
import { Search, Ban, UserCheck, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription
} from "@/components/ui/empty";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SortableTableHeader } from "@/components/ui/SortableTableHeader";
import { useTableSort } from "@/hooks/useTableSort";

export const UserManagementPage = () => {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");
    const [role, setRole] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [page, setPage] = useState(0);
    const { sortState, handleSort, sortData } = useTableSort();

    // Helper function to format date or return '-' for null/undefined
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "verify" | "ban" | "unban";
        userId: number;
        userName: string;
    } | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-users", keyword, role, status, page],
        queryFn: () =>
            getAllUsersAdmin({
                keyword: keyword || undefined,
                role: role === "all" ? undefined : role,
                status: status === "all" ? undefined : status,
                page,
                size: 10,
            }),
    });

    const verifyMutation = useMutation({
        mutationFn: verifyUser,
        onSuccess: () => {
            toast.success("Đã duyệt tài khoản thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: () => toast.error("Có lỗi xảy ra khi duyệt tài khoản"),
    });

    const banMutation = useMutation({
        mutationFn: banUser,
        onSuccess: () => {
            toast.success("Đã cấm tài khoản thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: () => toast.error("Có lỗi xảy ra khi cấm tài khoản"),
    });

    const unbanMutation = useMutation({
        mutationFn: unbanUser,
        onSuccess: () => {
            toast.success("Đã bỏ cấm tài khoản thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: () => toast.error("Có lỗi xảy ra khi bỏ cấm tài khoản"),
    });

    const handleConfirmAction = () => {
        if (!confirmDialog) return;

        switch (confirmDialog.type) {
            case "verify":
                verifyMutation.mutate(confirmDialog.userId);
                break;
            case "ban":
                banMutation.mutate(confirmDialog.userId);
                break;
            case "unban":
                unbanMutation.mutate(confirmDialog.userId);
                break;
        }
        setConfirmDialog(null);
    };

    const users = data?.content || [];
    const totalPages = data?.totalPages || 0;
    
    // Apply client-side sorting
    const sortedUsers = useMemo(() => sortData(users), [users, sortState]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Quản lý người dùng
                </h1>
                <p className="text-gray-500 mt-1">
                    Duyệt tài khoản công ty, cấm hoặc bỏ cấm người dùng
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            placeholder="Tìm kiếm theo tên, email..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={role}
                        onValueChange={(val) => {
                            setRole(val);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-50">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Lọc theo role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Loại tài khoản</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={status}
                        onValueChange={(val) => {
                            setStatus(val);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-40">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Trạng thái</SelectItem>
                            <SelectItem value="verified">Đã xác thực</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="banned">Bị cấm</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <SortableTableHeader
                                    label="ID"
                                    sortKey="id"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
                                <SortableTableHeader
                                    label="Người dùng"
                                    sortKey="name"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
                                <SortableTableHeader
                                    label="Email"
                                    sortKey="email"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Vai trò
                                </th>
                                <SortableTableHeader
                                    label="Ngày tạo"
                                    sortKey="createdAt"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
                                <SortableTableHeader
                                    label="Đăng nhập cuối"
                                    sortKey="lastLogin"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                // Skeleton loading
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : sortedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        <Empty className="py-12">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <Users />
                                                </EmptyMedia>
                                                <EmptyTitle>Không tìm thấy người dùng nào</EmptyTitle>
                                                <EmptyDescription>
                                                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    </td>
                                </tr>
                            ) : (
                                sortedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className={`transition-colors ${user.isBanned
                                            ? "bg-gray-100 opacity-60"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {/* ID */}
                                        <td className="px-6 py-4 text-gray-600">#{user.id}</td>

                                        {/* User Info */}
                                        <td className="px-6 py-4 max-w-[180px]">
                                            <a
                                                href={`/profile/${user.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 hover:text-primary"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold overflow-hidden ${user.isBanned
                                                    ? "bg-gray-300 text-gray-500"
                                                    : "bg-gradient-to-br from-primary to-purple-600 text-white"
                                                    }`}>
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name || ""}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        user.name?.charAt(0) || "U"
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <p className="font-medium text-gray-900 truncate hover:text-primary hover:underline">
                                                                {user.name || "Chưa đặt tên"}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {user.name || "Chưa đặt tên"}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </a>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 max-w-[160px]">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-gray-600 text-[14px] block truncate cursor-default">
                                                        {user.email}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {user.email}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.role?.resource?.toLowerCase() === "recruiter"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {user.role?.resource || "User"}
                                            </span>
                                        </td>

                                        {/* Created At */}
                                        <td className="px-6 py-4 max-w-[146px]">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-gray-600 text-sm block truncate whitespace-nowrap cursor-default">
                                                        {formatDate(user.createdAt)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {formatDate(user.createdAt)}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>

                                        {/* Last Login */}
                                        <td className="px-6 py-4 max-w-[146px]">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-gray-600 text-sm block truncate whitespace-nowrap cursor-default">
                                                        {formatDate(user.lastLogin)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {formatDate(user.lastLogin)}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {user.isBanned ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        Bị cấm
                                                    </span>
                                                ) : user.isVerified ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        Đã xác thực
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                        Chờ duyệt
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-start justify-start gap-2 text-sm">
                                                {/* Verify button for unverified users */}
                                                {!user.isVerified &&
                                                    !user.isBanned && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 border-green-300 hover:bg-green-50 hover:cursor-pointer text-sm hover:text-green-600"
                                                            onClick={() =>
                                                                setConfirmDialog({
                                                                    open: true,
                                                                    type: "verify",
                                                                    userId: Number(user.id),
                                                                    userName: user.name || user.email,
                                                                })
                                                            }
                                                        >
                                                            <UserCheck size={14} className="mr-1" />
                                                            Duyệt
                                                        </Button>
                                                    )}

                                                {/* Ban/Unban button */}
                                                {user.isBanned ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:cursor-pointer text-sm hover:text-blue-600"
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "unban",
                                                                userId: Number(user.id),
                                                                userName: user.name || user.email,
                                                            })
                                                        }
                                                    >
                                                        <UserCheck size={14} className="mr-1" />
                                                        Bỏ cấm
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="text-white hover:cursor-pointer text-sm"
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "ban",
                                                                userId: Number(user.id),
                                                                userName: user.name || user.email,
                                                            })
                                                        }
                                                    >
                                                        <Ban size={14} className="mr-1" />
                                                        Cấm
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="border-t border-gray-100 p-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => page > 0 && setPage(page - 1)}
                                        className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const pageNum = page < 3 ? i : page - 2 + i;
                                    if (pageNum >= totalPages) return null;
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() => setPage(pageNum)}
                                                isActive={page === pageNum}
                                                className="cursor-pointer"
                                            >
                                                {pageNum + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => page < totalPages - 1 && setPage(page + 1)}
                                        className={
                                            page >= totalPages - 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog
                open={confirmDialog?.open}
                onOpenChange={(open) => !open && setConfirmDialog(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog?.type === "verify" && "Xác nhận duyệt tài khoản"}
                            {confirmDialog?.type === "ban" && "Xác nhận cấm tài khoản"}
                            {confirmDialog?.type === "unban" && "Xác nhận bỏ cấm tài khoản"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog?.type === "verify" &&
                                `Bạn có chắc muốn duyệt tài khoản recruiter "${confirmDialog.userName}"?`}
                            {confirmDialog?.type === "ban" &&
                                `Bạn có chắc muốn cấm tài khoản "${confirmDialog?.userName}"? Người dùng này sẽ không thể truy cập hệ thống.`}
                            {confirmDialog?.type === "unban" &&
                                `Bạn có chắc muốn bỏ cấm tài khoản "${confirmDialog?.userName}"?`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmAction}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
