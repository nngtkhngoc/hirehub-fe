import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Eye, FileText, MessageCircle, Clock, UserCheck, UserX, Ban, Filter, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/lib/axios";
import { useNavigate, useSearchParams } from "react-router";
import { createConversation, type CreateConversationRequest } from "@/apis/conversation.api";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface UserSummary {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    position?: string;
}

interface JobSummary {
    id: number;
    title: string;
    level?: string;
    status?: string;
    isBanned?: boolean;
}

interface Resume {
    id: number;
    link: string;
    status: string;
    coverLetter?: string;
    createdAt: string;
    user: UserSummary;
    job: JobSummary;
}

interface JobPosting {
    id: string;
    title: string;
}

const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái", icon: null, color: "" },
    { value: "NOT VIEW", label: "Chưa xem", icon: Clock, color: "text-gray-600" },
    { value: "VIEWED", label: "Đã xem", icon: Eye, color: "text-blue-600" },
    { value: "ACCEPTED", label: "Đã chấp nhận", icon: UserCheck, color: "text-green-600" },
    { value: "REJECTED", label: "Đã từ chối", icon: UserX, color: "text-red-600" },
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case "NOT VIEW":
            return {
                bg: "bg-gray-100",
                text: "text-gray-700",
                label: "Chưa xem",
                icon: Clock
            };
        case "VIEWED":
            return {
                bg: "bg-blue-100",
                text: "text-blue-700",
                label: "Đã xem",
                icon: Eye
            };
        case "ACCEPTED":
            return {
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Chấp nhận",
                icon: UserCheck
            };
        case "REJECTED":
            return {
                bg: "bg-red-100",
                text: "text-red-700",
                label: "Từ chối",
                icon: UserX
            };
        default:
            return {
                bg: "bg-gray-100",
                text: "text-gray-700",
                label: status,
                icon: Clock
            };
    }
};

export const CandidatesPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [keyword, setKeyword] = useState("");

    // Read jobId from URL params
    const jobIdFromUrl = searchParams.get("jobId");
    const [selectedJob, setSelectedJob] = useState<string>(jobIdFromUrl || "ALL");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

    // Sync URL params with state
    useEffect(() => {
        if (jobIdFromUrl) {
            setSelectedJob(jobIdFromUrl);
        }
    }, [jobIdFromUrl]);

    // Update URL when job filter changes
    const handleJobFilterChange = (value: string) => {
        setSelectedJob(value);
        if (value === "ALL") {
            searchParams.delete("jobId");
        } else {
            searchParams.set("jobId", value);
        }
        setSearchParams(searchParams);
    };

    // Fetch jobs for filter dropdown
    const { data: jobsData } = useQuery({
        queryKey: ["recruiter-jobs-filter", user?.id],
        queryFn: async () => {
            const res = await axiosClient.get(`${BASE_URL}/api/jobs`, {
                params: {
                    recruiterId: user?.id,
                    size: 100,
                },
            });
            return res.data;
        },
        enabled: !!user?.id,
    });

    // Fetch candidates/resumes
    const { data: resumesData, isLoading } = useQuery({
        queryKey: ["recruiter-candidates", user?.id, selectedJob, selectedStatus],
        queryFn: async () => {
            const params: Record<string, string | number | undefined> = {
                recruiter: user?.id,
            };
            if (selectedJob !== "ALL") {
                params.job = selectedJob;
            }
            if (selectedStatus !== "ALL") {
                params.status = selectedStatus;
            }
            const res = await axiosClient.get(`${BASE_URL}/api/resumes`, { params });
            return res.data as Resume[];
        },
        enabled: !!user?.id,
    });

    // Update resume status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const res = await axiosClient.put(`${BASE_URL}/api/resumes/${id}`, { status });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            queryClient.invalidateQueries({ queryKey: ["recruiter-candidates"] });
        },
        onError: () => toast.error("Cập nhật trạng thái thất bại"),
    });

    // Create direct conversation mutation
    const createDirectConversation = useMutation({
        mutationFn: (payload: CreateConversationRequest) => createConversation(payload),
        onSuccess: (data) => {
            navigate(`/chat/conversation/${data.id}`);
        },
        onError: () => {
            toast.error("Không thể mở cuộc trò chuyện. Vui lòng thử lại!", {
                duration: 2000,
            });
        },
    });

    const jobs: JobPosting[] = jobsData?.content || [];
    const resumes: Resume[] = resumesData || [];

    // Get current job title for display
    const currentJobTitle = selectedJob !== "ALL"
        ? jobs.find(j => j.id === selectedJob)?.title
        : null;

    // Filter by keyword (search by name or email)
    const filteredResumes = resumes.filter((resume) => {
        if (!keyword) return true;
        const searchLower = keyword.toLowerCase();
        return (
            resume.user.name?.toLowerCase().includes(searchLower) ||
            resume.user.email?.toLowerCase().includes(searchLower) ||
            resume.job.title?.toLowerCase().includes(searchLower)
        );
    });

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const handleStatusChange = (resumeId: number, newStatus: string) => {
        updateStatusMutation.mutate({ id: resumeId, status: newStatus });
    };

    const handleOpenChat = (targetUserId: number) => {
        if (!user?.id) {
            navigate("/auth");
            return;
        }

        createDirectConversation.mutate({
            type: "DIRECT",
            creatorId: parseInt(user.id),
            participantIds: [parseInt(user.id), targetUserId],
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ứng viên</h1>
                    <p className="text-gray-500">
                        {currentJobTitle
                            ? `Danh sách ứng viên cho: "${currentJobTitle}"`
                            : "Quản lý tất cả ứng viên đã ứng tuyển việc làm của bạn"
                        }
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="pl-10 w-64 bg-white"
                    />
                </div>
                {/* Job Filter */}
                <Select value={selectedJob} onValueChange={handleJobFilterChange}>
                    <SelectTrigger className="w-48 bg-white">
                        <Filter size={16} className="mr-2 text-gray-400" />
                        <SelectValue placeholder="Lọc theo việc làm" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả việc làm</SelectItem>
                        {jobs.map((job) => (
                            <SelectItem key={job.id} value={job.id.toString()}>
                                {job.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-44 bg-white">
                        <Filter size={16} className="mr-2 text-gray-400" />
                        <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải...</div>
                ) : filteredResumes.length === 0 ? (
                    <div className="p-12">
                        <Empty className="border-none">
                            <EmptyContent>
                                <EmptyMedia variant="icon">
                                    <Users className="text-primary" />
                                </EmptyMedia>
                                <EmptyTitle>Chưa có ứng viên nào</EmptyTitle>
                                <EmptyDescription>
                                    Chưa có ứng viên nào ứng tuyển vào vị trí này hoặc không có ứng viên phù hợp với bộ lọc.
                                </EmptyDescription>
                            </EmptyContent>
                        </Empty>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ứng viên</TableHead>
                                <TableHead>Việc làm ứng tuyển</TableHead>
                                <TableHead>Ngày ứng tuyển</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResumes.map((resume) => {
                                const statusConfig = getStatusConfig(resume.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <TableRow key={resume.id}>
                                        {/* Candidate Info */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={resume.user.avatar} alt={resume.user.name} />
                                                    <AvatarFallback>
                                                        {resume.user.name?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p
                                                        className="font-medium text-gray-900 hover:text-primary cursor-pointer"
                                                        onClick={() => navigate(`/user/${resume.user.id}`)}
                                                    >
                                                        {resume.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {resume.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Job Applied */}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <p
                                                        className="font-medium text-gray-900 hover:text-primary cursor-pointer"
                                                        onClick={() => navigate(`/job-details/${resume.job.id}`)}
                                                    >
                                                        {resume.job.title}
                                                    </p>
                                                    {resume.job.level && (
                                                        <p className="text-sm text-gray-500">{resume.job.level}</p>
                                                    )}
                                                </div>
                                                {/* Banned job tag */}
                                                {(resume.job.status === "BANNED" || resume.job.isBanned) && (
                                                    <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                                                        <Ban size={12} />
                                                        Đã cấm
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Applied Date */}
                                        <TableCell>
                                            <span className="text-gray-600">
                                                {formatDate(resume.createdAt)}
                                            </span>
                                        </TableCell>

                                        {/* Status - Improved UI with Select */}
                                        <TableCell>
                                            {/* If job is banned, show status as read-only */}
                                            {(resume.job.status === "BANNED" || resume.job.isBanned) ? (
                                                <div className="flex items-center gap-2 px-2 py-1.5 opacity-60">
                                                    <StatusIcon size={16} className={statusConfig.text} />
                                                    <Badge className={`${statusConfig.bg} ${statusConfig.text} font-medium`}>
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>
                                            ) : (
                                                <Select
                                                    value={resume.status}
                                                    onValueChange={(value) => handleStatusChange(resume.id, value)}
                                                >
                                                    <SelectTrigger className="w-40 h-9 border-0 bg-transparent hover:bg-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            <StatusIcon size={16} className={statusConfig.text} />
                                                            <Badge className={`${statusConfig.bg} ${statusConfig.text} font-medium`}>
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {/* Only show ACCEPTED and REJECTED as options to change - VIEWED is auto-set on CV view */}
                                                        {statusOptions.filter(s => s.value !== "ALL" && s.value !== "NOT VIEW" && s.value !== "VIEWED").map((option) => {
                                                            const Icon = option.icon;
                                                            return (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        {Icon && <Icon size={16} className={option.color} />}
                                                                        <span>{option.label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => navigate(`/user/${resume.user.id}`)}
                                                    title="Xem hồ sơ"
                                                    className="h-8 w-8 hover:bg-gray-100"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                {resume.link && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            if (resume.status === "NOT VIEW" && !(resume.job.status === "BANNED" || resume.job.isBanned)) {
                                                                handleStatusChange(resume.id, "VIEWED");
                                                            }
                                                            window.open(resume.link, "_blank");
                                                        }}
                                                        title="Xem CV"
                                                        className="h-8 w-8 hover:bg-gray-100"
                                                    >
                                                        <FileText size={16} />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleOpenChat(resume.user.id)}
                                                    title="Nhắn tin"
                                                    className="h-8 w-8 hover:bg-gray-100"
                                                >
                                                    <MessageCircle size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};
