import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsersAdmin, verifyUser, banUser, unbanUser } from "@/apis/admin.api";
import { toast } from "sonner";
import { Search, Check, Ban, UserCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const UserManagementPage = () => {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");
    const [role, setRole] = useState<string>("all");
    const [page, setPage] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "verify" | "ban" | "unban";
        userId: number;
        userName: string;
    } | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-users", keyword, role, page],
        queryFn: () =>
            getAllUsersAdmin({
                keyword: keyword || undefined,
                role: role === "all" ? undefined : role,
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Quản lý Users
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
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Lọc theo role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
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
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="animate-pulse">Đang tải...</div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-gray-400"
                                    >
                                        Không tìm thấy người dùng nào
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        {/* User Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden">
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
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.name || "Chưa đặt tên"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ID: {user.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>

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

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {user.isBanned ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        <Ban size={12} className="mr-1" />
                                                        Bị cấm
                                                    </span>
                                                ) : user.isVerified ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        <Check size={12} className="mr-1" />
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
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Verify button for recruiters */}
                                                {user.role?.resource?.toLowerCase() === "recruiter" &&
                                                    !user.isVerified &&
                                                    !user.isBanned && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 border-green-300 hover:bg-green-50"
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
                                                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
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
