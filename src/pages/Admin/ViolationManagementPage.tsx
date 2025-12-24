import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllReports, updateReportStatus, deleteReport } from "@/apis/admin.api";
import { toast } from "sonner";
import { Check, X, Trash2, Filter, Eye, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Report } from "@/types/Admin";

export const ViolationManagementPage = () => {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<string>("all");
    const [resourceName, setResourceName] = useState<string>("all");
    const [page, setPage] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "approve" | "reject" | "delete";
        reportId: number;
    } | null>(null);
    const [viewReport, setViewReport] = useState<Report | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-reports", status, resourceName, page],
        queryFn: () =>
            getAllReports({
                status: status === "all" ? undefined : status,
                resourceName: resourceName === "all" ? undefined : resourceName,
                page,
                size: 10,
            }),
    });

    const approveMutation = useMutation({
        mutationFn: (reportId: number) => updateReportStatus(reportId, "approved"),
        onSuccess: () => {
            toast.success("Đã chấp nhận báo cáo");
            queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
        },
        onError: () => toast.error("Có lỗi xảy ra"),
    });

    const rejectMutation = useMutation({
        mutationFn: (reportId: number) => updateReportStatus(reportId, "rejected"),
        onSuccess: () => {
            toast.success("Đã từ chối báo cáo");
            queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
        },
        onError: () => toast.error("Có lỗi xảy ra"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteReport,
        onSuccess: () => {
            toast.success("Đã xóa báo cáo");
            queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
        },
        onError: () => toast.error("Có lỗi xảy ra"),
    });

    const handleConfirmAction = () => {
        if (!confirmDialog) return;

        switch (confirmDialog.type) {
            case "approve":
                approveMutation.mutate(confirmDialog.reportId);
                break;
            case "reject":
                rejectMutation.mutate(confirmDialog.reportId);
                break;
            case "delete":
                deleteMutation.mutate(confirmDialog.reportId);
                break;
        }
        setConfirmDialog(null);
    };

    const reports = data?.content || [];
    const totalPages = data?.totalPages || 0;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Chờ xử lý
                    </span>
                );
            case "approved":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check size={12} className="mr-1" />
                        Đã chấp nhận
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <X size={12} className="mr-1" />
                        Đã từ chối
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    const getResourceInfo = (report: Report) => {
        const resource = report.resource;
        if (!resource) return { name: "N/A", type: "unknown" };

        if (resource.title) {
            return { name: resource.title, type: "job" };
        }
        if (resource.name || resource.email) {
            return { name: resource.name || resource.email, type: "user" };
        }
        return { name: `ID: ${resource.id}`, type: "unknown" };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Quản lý Vi phạm
                </h1>
                <p className="text-gray-500 mt-1">
                    Xem xét và xử lý các báo cáo vi phạm từ người dùng
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Select
                        value={status}
                        onValueChange={(val) => {
                            setStatus(val);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                            <SelectItem value="approved">Đã chấp nhận</SelectItem>
                            <SelectItem value="rejected">Đã từ chối</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={resourceName}
                        onValueChange={(val) => {
                            setResourceName(val);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Loại tài nguyên" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            <SelectItem value="user">Người dùng</SelectItem>
                            <SelectItem value="job">Công việc</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Đối tượng bị báo cáo
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Lý do
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Người báo cáo
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
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="animate-pulse">Đang tải...</div>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-gray-400"
                                    >
                                        Không có báo cáo nào
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => {
                                    const resourceInfo = getResourceInfo(report);
                                    return (
                                        <tr
                                            key={report.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {/* ID */}
                                            <td className="px-6 py-4 text-gray-600">#{report.id}</td>

                                            {/* Resource */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        {resourceInfo.type === "job" ? (
                                                            <Briefcase size={14} className="text-gray-500" />
                                                        ) : (
                                                            <User size={14} className="text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">
                                                            {resourceInfo.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 capitalize">
                                                            {resourceInfo.type === "job"
                                                                ? "Công việc"
                                                                : "Người dùng"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Reason */}
                                            <td className="px-6 py-4">
                                                <p className="text-gray-600 line-clamp-2 max-w-xs">
                                                    {report.reason}
                                                </p>
                                            </td>

                                            {/* Reporter */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium overflow-hidden">
                                                        {report.reporter?.avatar ? (
                                                            <img
                                                                src={report.reporter.avatar}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            report.reporter?.name?.charAt(0) || "U"
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {report.reporter?.name || report.reporter?.email}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(report.status)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewReport(report)}
                                                    >
                                                        <Eye size={14} />
                                                    </Button>

                                                    {report.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 border-green-300 hover:bg-green-50"
                                                                onClick={() =>
                                                                    setConfirmDialog({
                                                                        open: true,
                                                                        type: "approve",
                                                                        reportId: report.id,
                                                                    })
                                                                }
                                                            >
                                                                <Check size={14} />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                                                onClick={() =>
                                                                    setConfirmDialog({
                                                                        open: true,
                                                                        type: "reject",
                                                                        reportId: report.id,
                                                                    })
                                                                }
                                                            >
                                                                <X size={14} />
                                                            </Button>
                                                        </>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "delete",
                                                                reportId: report.id,
                                                            })
                                                        }
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
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
                                        className={
                                            page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
                                        }
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

            {/* View Report Dialog */}
            <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Chi tiết báo cáo #{viewReport?.id}</DialogTitle>
                    </DialogHeader>
                    {viewReport && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Trạng thái
                                </label>
                                <div className="mt-1">{getStatusBadge(viewReport.status)}</div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Đối tượng bị báo cáo
                                </label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium">
                                        {getResourceInfo(viewReport).name}
                                    </p>
                                    <p className="text-sm text-gray-500 capitalize">
                                        Loại: {getResourceInfo(viewReport).type === "job" ? "Công việc" : "Người dùng"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Lý do báo cáo
                                </label>
                                <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                                    {viewReport.reason}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Người báo cáo
                                </label>
                                <div className="mt-1 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                        {viewReport.reporter?.avatar ? (
                                            <img
                                                src={viewReport.reporter.avatar}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-medium">
                                                {viewReport.reporter?.name?.charAt(0) || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{viewReport.reporter?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {viewReport.reporter?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog
                open={confirmDialog?.open}
                onOpenChange={(open) => !open && setConfirmDialog(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog?.type === "approve" && "Xác nhận chấp nhận báo cáo"}
                            {confirmDialog?.type === "reject" && "Xác nhận từ chối báo cáo"}
                            {confirmDialog?.type === "delete" && "Xác nhận xóa báo cáo"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog?.type === "approve" &&
                                "Chấp nhận báo cáo này? Đối tượng bị báo cáo có thể bị xử lý."}
                            {confirmDialog?.type === "reject" &&
                                "Từ chối báo cáo này? Báo cáo sẽ được đánh dấu là không hợp lệ."}
                            {confirmDialog?.type === "delete" &&
                                "Xóa báo cáo này? Hành động này không thể hoàn tác."}
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
