import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Eye, Check, X, FileText } from "lucide-react";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

type ApplicationStatus = "NOT VIEW" | "VIEWED" | "ACCEPTED" | "REJECTED";

interface Application {
    id: number;
    link: string;
    status: ApplicationStatus;
    coverLetter: string | null;
    createdAt: string | null;
    user: {
        id: number;
        email: string;
        name: string;
        address: string | null;
        avatar: string | null;
        position: string | null;
    };
    job: {
        id: string;
        title: string;
        level: string;
        workspace: string;
    };
}

const statusColors: Record<ApplicationStatus, string> = {
    "NOT VIEW": "bg-gray-100 text-gray-600",
    VIEWED: "bg-blue-100 text-blue-700",
    ACCEPTED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
};

export const CandidatesPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [jobFilter, setJobFilter] = useState<string>("ALL");
    const [page, setPage] = useState(0);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    // Fetch recruiter's jobs for filter dropdown
    const { data: jobsData } = useQuery({
        queryKey: ["recruiter-jobs-filter", user?.id],
        queryFn: async () => {
            const res = await axiosClient.get(`${BASE_URL}/api/jobs`, {
                params: {
                    recruiterId: user?.id,
                    size: 100,
                },
            });
            return res.data?.content || [];
        },
        enabled: !!user?.id,
    });

    const recruiterJobs = jobsData || [];

    const { data, isLoading } = useQuery({
        queryKey: ["recruiter-applications", user?.id, jobFilter, page],
        queryFn: async () => {
            const res = await axiosClient.get(`${BASE_URL}/api/resumes`, {
                params: {
                    recruiter: user?.id,
                    job: jobFilter !== "ALL" ? jobFilter : undefined,
                    page,
                    size: 10,
                },
            });
            return res.data;
        },
        enabled: !!user?.id,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            await axiosClient.put(`${BASE_URL}/api/resumes/${id}`, { status });
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["recruiter-applications"] });
            setSelectedApplication(null);
        },
        onError: () => toast.error("Failed to update status"),
    });

    const applications: Application[] = Array.isArray(data) ? data : data?.content || [];
    const totalPages = data?.totalPages || 1;

    const filteredApplications = applications.filter((app) => {
        if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
        if (keyword && !app.user.name.toLowerCase().includes(keyword.toLowerCase())) return false;
        return true;
    });

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "N/A";
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
                <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                <p className="text-gray-500">Manage all job applications</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-xs">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            placeholder="Search candidates..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Job Filter */}
                    <Select value={jobFilter} onValueChange={(value) => {
                        setJobFilter(value);
                        setPage(0);
                    }}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by job" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Jobs</SelectItem>
                            {recruiterJobs.map((job: { id: string; title: string }) => (
                                <SelectItem key={job.id} value={String(job.id)}>
                                    {job.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="NOT VIEW">Not Viewed</SelectItem>
                            <SelectItem value="VIEWED">Viewed</SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Candidate
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Applied For
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="animate-pulse">Loading...</div>
                                    </td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        No applications found
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Candidate */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                                                    {app.user.avatar ? (
                                                        <img
                                                            src={app.user.avatar}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-medium">
                                                            {app.user.name?.charAt(0) || "U"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{app.user.name}</p>
                                                    <p className="text-sm text-gray-500">{app.user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Job */}
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{app.job.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {app.job.level} · {app.job.workspace}
                                            </p>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(app.createdAt)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[app.status]
                                                    }`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelectedApplication(app)}
                                                >
                                                    <Eye size={14} className="mr-1" />
                                                    View
                                                </Button>
                                                {app.link && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => window.open(app.link, "_blank")}
                                                    >
                                                        <FileText size={14} className="mr-1" />
                                                        CV
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
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() => setPage(i)}
                                            isActive={page === i}
                                            className="cursor-pointer"
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
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

            {/* Application Detail Modal */}
            <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                    </DialogHeader>

                    {selectedApplication && (
                        <div className="space-y-4">
                            {/* Candidate Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                                    {selectedApplication.user.avatar ? (
                                        <img
                                            src={selectedApplication.user.avatar}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-xl font-medium">
                                            {selectedApplication.user.name?.charAt(0) || "U"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedApplication.user.name}</h3>
                                    <p className="text-gray-500">{selectedApplication.user.email}</p>
                                    {selectedApplication.user.position && (
                                        <p className="text-sm text-gray-400">{selectedApplication.user.position}</p>
                                    )}
                                </div>
                            </div>

                            {/* Job Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">Applied for</p>
                                <p className="font-medium">{selectedApplication.job.title}</p>
                                <p className="text-sm text-gray-500">
                                    {selectedApplication.job.level} · {selectedApplication.job.workspace}
                                </p>
                            </div>

                            {/* Cover Letter */}
                            {selectedApplication.coverLetter && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                                    <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-4">
                                        {selectedApplication.coverLetter}
                                    </p>
                                </div>
                            )}

                            {/* Resume Link */}
                            {selectedApplication.link && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => window.open(selectedApplication.link, "_blank")}
                                >
                                    <FileText size={16} className="mr-2" />
                                    View Resume
                                </Button>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                                    onClick={() =>
                                        updateStatusMutation.mutate({
                                            id: selectedApplication.id,
                                            status: "REJECTED",
                                        })
                                    }
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <X size={16} className="mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                    onClick={() =>
                                        updateStatusMutation.mutate({
                                            id: selectedApplication.id,
                                            status: "ACCEPTED",
                                        })
                                    }
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <Check size={16} className="mr-2" />
                                    Accept
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
