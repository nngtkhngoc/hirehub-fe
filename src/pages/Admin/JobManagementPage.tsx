import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllJobsAdmin, banJob, unbanJob } from "@/apis/admin.api";
import { toast } from "sonner";
import { Search, Ban, UserCheck, Filter, Briefcase } from "lucide-react";
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

export const JobManagementPage = () => {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");
    const [level, setLevel] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [companySearch, setCompanySearch] = useState("");
    const [page, setPage] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "ban" | "unban";
        jobId: string;
        jobTitle: string;
    } | null>(null);

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
        mutationFn: banJob,
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

    const handleConfirmAction = () => {
        if (!confirmDialog) return;

        switch (confirmDialog.type) {
            case "ban":
                banMutation.mutate(confirmDialog.jobId);
                break;
            case "unban":
                unbanMutation.mutate(confirmDialog.jobId);
                break;
        }
        setConfirmDialog(null);
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
                            <SelectItem value="active">Hoạt động</SelectItem>
                            <SelectItem value="banned">Bị cấm</SelectItem>
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
                                            {job.is_banned ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Bị cấm
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Hoạt động
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-start justify-start gap-2 text-sm">
                                                {job.is_banned ? (
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
                                                ) : (
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
                onOpenChange={(open) => !open && setConfirmDialog(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog?.type === "ban" && "Xác nhận cấm công việc"}
                            {confirmDialog?.type === "unban" && "Xác nhận bỏ cấm công việc"}
                            {confirmDialog?.type === "delete" && "Xác nhận xóa công việc"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog?.type === "ban" &&
                                `Bạn có chắc muốn cấm công việc "${confirmDialog.jobTitle}"? Công việc này sẽ không còn hiển thị cho người dùng.`}
                            {confirmDialog?.type === "unban" &&
                                `Bạn có chắc muốn bỏ cấm công việc "${confirmDialog?.jobTitle}"?`}
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
