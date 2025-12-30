import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Plus, MoreVertical, Eye, Users, XCircle, Trash2, Briefcase, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/lib/axios";
import { JobStatusBadge, type JobStatus } from "@/components/ui/JobStatusBadge";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface JobPosting {
    id: string;
    title: string;
    level: string;
    workspace: string;
    type: string;
    postingDate: string;
    isDeleted: boolean;
    isBanned: boolean;
    status?: string;
    candidatesCount?: number;
    recruiter?: {
        id: string;
        name: string;
        field?: string;
    };
}

const getJobStatus = (job: JobPosting): JobStatus => {
    if (job.status) return job.status as JobStatus;
    if (job.isDeleted) return "CLOSED";
    if (job.isBanned) return "BANNED";
    return "PENDING";
};

export const JobPostingsPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [keyword, setKeyword] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [page, setPage] = useState(0);

    // Fetch jobs
    const { data, isLoading } = useQuery({
        queryKey: ["recruiter-jobs", user?.id, keyword, selectedStatus, page],
        queryFn: async () => {
            const params: Record<string, string | number | undefined> = {
                recruiterId: user?.id,
                page,
                size: 10,
            };
            if (keyword) {
                params.keyword = keyword;
            }
            if (selectedStatus !== "ALL") {
                params.status = selectedStatus;
            }
            const res = await axiosClient.get(`${BASE_URL}/api/jobs`, { params });
            return res.data;
        },
        enabled: !!user?.id,
    });

    // Delete job mutation
    const deleteJobMutation = useMutation({
        mutationFn: async (jobId: string) => {
            await axiosClient.delete(`${BASE_URL}/api/jobs/${jobId}`);
        },
        onSuccess: () => {
            toast.success("Xóa việc làm thành công");
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
        },
        onError: () => toast.error("Xóa việc làm thất bại"),
    });

    // Update job status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ jobId, status }: { jobId: string; status: string }) => {
            await axiosClient.put(`${BASE_URL}/api/jobs/${jobId}/status`, { status });
        },
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
        },
        onError: () => toast.error("Cập nhật trạng thái thất bại"),
    });

    const jobs: JobPosting[] = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;

    const formatTimeAgo = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 60) return `Tạo ${diffMins} phút trước`;
            if (diffHours < 24) return `Tạo ${diffHours} giờ trước`;
            return `Tạo ${diffDays} ngày trước`;
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Quản lý Việc làm
                </h1>
                <p className="text-gray-500 mt-1">
                    Quản lý tất cả tin tuyển dụng của bạn ({totalElements} việc làm)
                </p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:flex-none w-full sm:w-64">
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

                        {/* Status Filter */}
                        <Select
                            value={selectedStatus}
                            onValueChange={(value) => {
                                setSelectedStatus(value);
                                setPage(0);
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                <SelectItem value="BANNED">Bị từ chối</SelectItem>
                                <SelectItem value="DRAFT">Bản nháp</SelectItem>
                                <SelectItem value="CLOSED">Đã đóng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Add New Button - Navigate to Create Page */}
                    <Button
                        onClick={() => navigate("/recruiter/jobs/create")}
                        className="h-10 px-6 w-full sm:w-auto"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Thêm mới
                    </Button>
                </div>
            </div>

            {/* Job List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải...</div>
                ) : jobs.length === 0 ? (
                    <div className="p-12">
                        <Empty className="border-none">
                            <EmptyContent>
                                <EmptyMedia variant="icon">
                                    <Briefcase className="text-primary" />
                                </EmptyMedia>
                                <EmptyTitle>Chưa có việc làm nào</EmptyTitle>
                                <EmptyDescription>
                                    Bạn chưa đăng việc làm nào. Hãy tạo tin tuyển dụng đầu tiên của bạn!
                                </EmptyDescription>
                            </EmptyContent>
                        </Empty>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {jobs.map((job) => {
                            const status = getJobStatus(job);
                            return (
                                <div
                                    key={job.id}
                                    className="p-6 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Left side - Job info */}
                                        <div className="space-y-2 flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {job.title}
                                                </h3>
                                                <JobStatusBadge status={status} />
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {job.level} · {job.workspace} · {job.type}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Users size={16} />
                                                <span className="font-medium">{job.candidatesCount || 0}</span>
                                                <span>ứng viên đã ứng tuyển</span>
                                            </div>
                                        </div>

                                        {/* Right side - Actions */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="text-sm text-gray-400 hidden sm:block">
                                                {formatTimeAgo(job.postingDate)}
                                            </span>

                                            {/* More Menu */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                                        <MoreVertical size={18} className="text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/job-details/${job.id}`)}
                                                    >
                                                        <Eye size={16} className="mr-2" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    {/* Edit option - only for DRAFT jobs */}
                                                    {(status === "DRAFT" || job.status === "DRAFT") && (
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
                                                        >
                                                            <Edit size={16} className="mr-2" />
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/recruiter/candidates?jobId=${job.id}`)}
                                                    >
                                                        <Users size={16} className="mr-2" />
                                                        Xem ứng viên ({job.candidatesCount || 0})
                                                    </DropdownMenuItem>
                                                    {/* Close job option - only for APPROVED/ACTIVE jobs */}
                                                    {(status === "APPROVED" || status === "ACTIVE") && (
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                if (confirm("Bạn có chắc chắn muốn đóng việc làm này không?")) {
                                                                    updateStatusMutation.mutate({ jobId: job.id, status: "CLOSED" });
                                                                }
                                                            }}
                                                            className="text-orange-600 focus:text-orange-600"
                                                        >
                                                            <XCircle size={16} className="mr-2" />
                                                            Đóng việc làm
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => {
                                                            if (confirm("Bạn có chắc chắn muốn xóa việc làm này không?")) {
                                                                deleteJobMutation.mutate(job.id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={16} className="mr-2" />
                                                        Xóa việc làm
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

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
        </div>
    );
};
