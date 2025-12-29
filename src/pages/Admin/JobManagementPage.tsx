import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllJobsAdmin, banJob, unbanJob, approveJob, rejectJob } from "@/apis/admin.api";
import { toast } from "sonner";
import { Search, Ban, UserCheck, Filter, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export const JobManagementPage = () => {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");
    const [level, setLevel] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [companySearch, setCompanySearch] = useState("");
    const [page, setPage] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "ban" | "unban" | "review"; // review = for pending jobs
        jobId: string;
        jobTitle: string;
    } | null>(null);
    const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
    const [actionReason, setActionReason] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["admin-jobs", keyword, level, status, companySearch, page],
        queryFn: () =>
            getAllJobsAdmin({
                keyword: keyword || undefined,
                level: level === "all" ? undefined : level,
                status: status === "all" ? undefined : status,
                recruiter: companySearch || undefined,
                page,
                size: 10,
            }),
    });

    const banMutation = useMutation({
        mutationFn: ({ jobId, reason }: { jobId: string; reason?: string }) => banJob(jobId, reason),
        onSuccess: () => {
            toast.success("Đã cấm công việc thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        },
        onError: () => toast.error("Có lỗi xảy ra khi cấm công việc"),
    });

    const unbanMutation = useMutation({
        mutationFn: unbanJob,
        onSuccess: () => {
            toast.success("Đã bỏ cấm công việc thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        },
        onError: () => toast.error("Có lỗi xảy ra khi bỏ cấm công việc"),
    });

    const approveMutation = useMutation({
        mutationFn: ({ jobId, reason }: { jobId: string; reason?: string }) => approveJob(jobId, reason),
        onSuccess: () => {
            toast.success("Đã duyệt công việc thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        },
        onError: () => toast.error("Có lỗi xảy ra khi duyệt công việc"),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ jobId, reason }: { jobId: string; reason?: string }) => rejectJob(jobId, reason),
        onSuccess: () => {
            toast.success("Đã từ chối công việc thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        },
        onError: () => toast.error("Có lỗi xảy ra khi từ chối công việc"),
    });

    const handleConfirmAction = () => {
        if (!confirmDialog) return;

        const reason = actionReason.trim() || undefined;

        switch (confirmDialog.type) {
            case "ban":
                banMutation.mutate({ jobId: confirmDialog.jobId, reason });
                break;
            case "unban":
                unbanMutation.mutate(confirmDialog.jobId);
                break;
            case "review":
                if (reviewAction === "approve") {
                    approveMutation.mutate({ jobId: confirmDialog.jobId, reason });
                } else {
                    rejectMutation.mutate({ jobId: confirmDialog.jobId, reason });
                }
                break;
        }
        setConfirmDialog(null);
        setActionReason("");
        setReviewAction("approve");
    };

    const jobs = data?.content || [];
    const totalPages = data?.totalPages || 0;
    console.log(jobs, "JOBS");
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("vi-VN");
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Quản lý công việc
                </h1>
                <p className="text-gray-500 mt-1">
                    Quản lý các bài đăng tuyển dụng, cấm hoặc xóa job vi phạm
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            placeholder="Tìm kiếm theo tiêu đề..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            className="pl-10"
                        />
                    </div>

                    {/* Company Search */}
                    <div className="relative min-w-[180px]">
                        <Input
                            placeholder="Tìm theo công ty..."
                            value={companySearch}
                            onChange={(e) => {
                                setCompanySearch(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>

                    {/* Level Filter */}
                    <Select
                        value={level}
                        onValueChange={(val) => {
                            setLevel(val);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-40">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Cấp bậc" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Cấp bậc</SelectItem>
                            <SelectItem value="Intern">Intern</SelectItem>
                            <SelectItem value="Fresher">Fresher</SelectItem>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Middle">Middle</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Lead">Lead</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        value={status}
                        onValueChange={(val) => {
                            setStatus(val);
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-40">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Trạng thái</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="approved">Đã duyệt</SelectItem>
                            <SelectItem value="banned">Bị từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Công việc
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Công ty
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Cấp bậc
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Ngày đăng
                                </th>
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
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="h-6 bg-gray-200 rounded-full w-16 mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <Empty className="py-12">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <Briefcase />
                                                </EmptyMedia>
                                                <EmptyTitle>Không tìm thấy công việc nào</EmptyTitle>
                                                <EmptyDescription>
                                                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => (
                                    <tr
                                        key={job.id}
                                        className={`transition-colors ${job.is_banned
                                            ? "bg-gray-100 opacity-60"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {/* Job Info */}
                                        <td className="px-6 py-4">
                                            <a
                                                href={`/job-details/${job.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block hover:text-primary"
                                            >
                                                <p className="font-medium text-gray-900 line-clamp-1 hover:text-primary hover:underline">
                                                    {job.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {job.workspace} • {job.type}
                                                </p>
                                            </a>
                                        </td>

                                        {/* Company */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium overflow-hidden ${job.is_banned
                                                    ? "bg-gray-300 text-gray-500"
                                                    : "bg-gray-100"
                                                    }`}>
                                                    {job.recruiter?.avatar ? (
                                                        <img
                                                            src={job.recruiter.avatar}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        job.recruiter?.name?.charAt(0) || "C"
                                                    )}
                                                </div>
                                                <span className="text-gray-600 text-sm line-clamp-1">
                                                    {job.recruiter?.name || "N/A"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Level */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {job.level || "N/A"}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {formatDate(job.postingDate)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            {job.status === "PENDING" ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Chờ duyệt
                                                </span>
                                            ) : job.status === "APPROVED" ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Đã duyệt
                                                </span>
                                            ) : job.status === "BANNED" || job.is_banned ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Bị từ chối
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    {job.status || "N/A"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-start justify-start gap-2 text-sm">
                                                {job.status === "PENDING" ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:cursor-pointer text-sm hover:text-blue-600"
                                                        onClick={() => {
                                                            setReviewAction("approve");
                                                            setActionReason("");
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "review",
                                                                jobId: job.id,
                                                                jobTitle: job.title,
                                                            });
                                                        }}
                                                    >
                                                        <CheckCircle size={14} className="mr-1" />
                                                        Xem xét
                                                    </Button>
                                                ) : (job.status === "APPROVED" || job.status === "ACTIVE") && !job.is_banned ? (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="text-white hover:cursor-pointer text-sm"
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "ban",
                                                                jobId: job.id,
                                                                jobTitle: job.title,
                                                            })
                                                        }
                                                    >
                                                        <Ban size={14} className="mr-1" />
                                                        Cấm
                                                    </Button>
                                                ) : (job.status === "BANNED" || job.is_banned) ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:cursor-pointer text-sm hover:text-blue-600"
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "unban",
                                                                jobId: job.id,
                                                                jobTitle: job.title,
                                                            })
                                                        }
                                                    >
                                                        <UserCheck size={14} className="mr-1" />
                                                        Bỏ cấm
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages >= 1 && (
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
                onOpenChange={(open) => {
                    if (!open) {
                        setConfirmDialog(null);
                        setActionReason("");
                        setReviewAction("approve");
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog?.type === "ban" && "Xác nhận cấm công việc"}
                            {confirmDialog?.type === "unban" && "Xác nhận bỏ cấm công việc"}
                            {confirmDialog?.type === "review" && "Xem xét công việc"}
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4">
                                <p>
                                    {confirmDialog?.type === "ban" &&
                                        `Bạn có chắc muốn cấm công việc "${confirmDialog.jobTitle}"? Công việc này sẽ không còn hiển thị cho người dùng.`}
                                    {confirmDialog?.type === "unban" &&
                                        `Bạn có chắc muốn bỏ cấm công việc "${confirmDialog?.jobTitle}"?`}
                                    {confirmDialog?.type === "review" &&
                                        `Xem xét công việc "${confirmDialog?.jobTitle}". Chọn hành động bên dưới.`}
                                </p>

                                {/* Action selection for review type */}
                                {confirmDialog?.type === "review" && (
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-700">Chọn hành động</Label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="reviewAction"
                                                    value="approve"
                                                    checked={reviewAction === "approve"}
                                                    onChange={() => setReviewAction("approve")}
                                                    className="w-4 h-4 text-green-600"
                                                />
                                                <span className="text-sm font-medium text-green-600">Duyệt</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="reviewAction"
                                                    value="reject"
                                                    checked={reviewAction === "reject"}
                                                    onChange={() => setReviewAction("reject")}
                                                    className="w-4 h-4 text-red-600"
                                                />
                                                <span className="text-sm font-medium text-red-600">Từ chối</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Reason input - show for ban and reject */}
                                {(confirmDialog?.type === "ban" || (confirmDialog?.type === "review" && reviewAction === "reject")) && (
                                    <div className="space-y-2">
                                        <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                                            Lý do (nếu có)
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Nhập lý do từ chối/cấm công việc..."
                                            value={actionReason}
                                            onChange={(e) => setActionReason(e.target.value)}
                                            rows={3}
                                            className="resize-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setActionReason("");
                            setReviewAction("approve");
                        }}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmAction}
                            className={confirmDialog?.type === "review" && reviewAction === "reject" ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                            {confirmDialog?.type === "review"
                                ? (reviewAction === "approve" ? "Duyệt" : "Từ chối")
                                : "Xác nhận"
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
