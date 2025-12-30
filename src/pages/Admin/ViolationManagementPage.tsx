import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllReports, updateReportStatus, deleteReport } from "@/apis/admin.api";
import { toast } from "sonner";
import { Trash2, Filter, Eye, User, Briefcase, AlertTriangle } from "lucide-react";
import { SortableTableHeader } from "@/components/ui/SortableTableHeader";
import { useTableSort } from "@/hooks/useTableSort";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
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
    const { sortState, handleSort, sortData } = useTableSort();
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "delete";
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

    const updateStatusMutation = useMutation({
        mutationFn: ({ reportId, status }: { reportId: number; status: string }) =>
            updateReportStatus(reportId, status),
        onSuccess: () => {
            toast.success("Đã cập nhật trạng thái");
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

        if (confirmDialog.type === "delete") {
            deleteMutation.mutate(confirmDialog.reportId);
        }
        setConfirmDialog(null);
    };

    const reports = data?.content || [];
    const totalPages = data?.totalPages || 0;
    
    // Apply client-side sorting
    const sortedReports = useMemo(() => sortData(reports), [reports, sortState]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return "Đang xử lý";
            case "approved":
                return "Đã xử lý";
            case "rejected":
                return "Đã từ chối";
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "approved":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const handleStatusChange = (reportId: number, currentStatus: string, newStatus: string) => {
        // Không cho phép chuyển từ approved về pending
        if (currentStatus === "approved" && newStatus === "pending") {
            toast.error("Không thể chuyển từ 'Đã xử lý' về 'Đang xử lý'");
            return;
        }
        updateStatusMutation.mutate({ reportId, status: newStatus });
    };

    const getResourceInfo = (report: Report) => {
        const resource = report.resource;
        if (!resource) return { name: "N/A", type: "unknown", id: null };

        if (resource.title) {
            return { name: resource.title, type: "job", id: resource.id };
        }
        if (resource.name || resource.email) {
            return { name: resource.name || resource.email, type: "user", id: resource.id };
        }
        return { name: `ID: ${resource.id}`, type: "unknown", id: resource.id };
    };

    const handleResourceClick = (report: Report) => {
        const resourceInfo = getResourceInfo(report);
        if (!resourceInfo.id) return;

        if (resourceInfo.type === "job") {
            window.open(`/job-details/${resourceInfo.id}`, "_blank");
        } else if (resourceInfo.type === "user") {
            // Check if it's a recruiter to redirect to company-details
            const resource = report.resource as any;
            const isRecruiter = resource?.role?.name?.toLowerCase() === "recruiter";
            
            if (isRecruiter) {
                window.open(`/company-details/${resourceInfo.id}`, "_blank");
            } else {
                window.open(`/user/${resourceInfo.id}`, "_blank");
            }
        }
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
                            <SelectItem value="pending">Đang xử lý</SelectItem>
                            <SelectItem value="approved">Đã xử lý</SelectItem>
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
                                <SortableTableHeader
                                    label="ID"
                                    sortKey="id"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
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
                            ) : sortedReports.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <Empty className="py-12">
                                            <EmptyContent>
                                                <EmptyMedia variant="icon">
                                                    <AlertTriangle className="text-primary" />
                                                </EmptyMedia>
                                                <EmptyTitle>Không có báo cáo nào</EmptyTitle>
                                                <EmptyDescription>
                                                    Thử thay đổi bộ lọc hoặc chưa có báo cáo vi phạm nào
                                                </EmptyDescription>
                                            </EmptyContent>
                                        </Empty>
                                    </td>
                                </tr>
                            ) : (
                                sortedReports.map((report) => {
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
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                                                    onClick={() => handleResourceClick(report)}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        {resourceInfo.type === "job" ? (
                                                            <Briefcase size={14} className="text-gray-500" />
                                                        ) : (
                                                            <User size={14} className="text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1 hover:text-primary transition-colors">
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
                                                <Select
                                                    value={report.status}
                                                    onValueChange={(value) =>
                                                        handleStatusChange(report.id, report.status, value)
                                                    }
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <SelectTrigger
                                                        className={`w-36 h-8 text-xs font-medium border ${getStatusColor(
                                                            report.status
                                                        )}`}
                                                    >
                                                        <SelectValue>
                                                            {getStatusBadge(report.status)}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value="pending"
                                                            disabled={report.status === "approved"}
                                                        >
                                                            Đang xử lý
                                                        </SelectItem>
                                                        <SelectItem value="approved">Đã xử lý</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(
                                            viewReport.status
                                        )}`}
                                    >
                                        {getStatusBadge(viewReport.status)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Đối tượng bị báo cáo
                                </label>
                                <div
                                    className="mt-1 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleResourceClick(viewReport)}
                                >
                                    <p className="font-medium text-primary hover:underline">
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
                        <AlertDialogTitle>Xác nhận xóa báo cáo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Xóa báo cáo này? Hành động này không thể hoàn tác.
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
