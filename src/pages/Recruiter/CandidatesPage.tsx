import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Eye, FileText, ExternalLink } from "lucide-react";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/lib/axios";
import { useNavigate } from "react-router";

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
    { value: "ALL", label: "All Status" },
    { value: "NOT VIEW", label: "Not Viewed" },
    { value: "VIEWED", label: "Viewed" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
];

const getStatusBadgeStyles = (status: string) => {
    switch (status) {
        case "NOT VIEW":
            return "bg-gray-100 text-gray-700";
        case "VIEWED":
            return "bg-blue-100 text-blue-700";
        case "ACCEPTED":
            return "bg-green-100 text-green-700";
        case "REJECTED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export const CandidatesPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [keyword, setKeyword] = useState("");
    const [selectedJob, setSelectedJob] = useState<string>("ALL");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

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
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["recruiter-candidates"] });
        },
        onError: () => toast.error("Failed to update status"),
    });

    const jobs: JobPosting[] = jobsData?.content || [];
    const resumes: Resume[] = resumesData || [];

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                    <p className="text-gray-500">
                        Manage all candidates who applied to your jobs
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
                        placeholder="Search by name or email..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="pl-10 w-64 bg-white"
                    />
                </div>

                {/* Job Filter */}
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="w-48 bg-white">
                        <SelectValue placeholder="Filter by Job" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Jobs</SelectItem>
                        {jobs.map((job) => (
                            <SelectItem key={job.id} value={job.id.toString()}>
                                {job.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Results count */}
                <span className="text-sm text-gray-500">
                    {filteredResumes.length} candidates found
                </span>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : filteredResumes.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        No candidates found.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Job Applied</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResumes.map((resume) => (
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
                                    </TableCell>

                                    {/* Applied Date */}
                                    <TableCell>
                                        <span className="text-gray-600">
                                            {formatDate(resume.createdAt)}
                                        </span>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="p-0 h-auto">
                                                    <Badge className={`${getStatusBadgeStyles(resume.status)} cursor-pointer`}>
                                                        {resume.status}
                                                    </Badge>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {statusOptions.filter(s => s.value !== "ALL").map((option) => (
                                                    <DropdownMenuItem
                                                        key={option.value}
                                                        onClick={() => handleStatusChange(resume.id, option.value)}
                                                        className={resume.status === option.value ? "bg-gray-100" : ""}
                                                    >
                                                        {option.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="icon"
                                                onClick={() => navigate(`/user/${resume.user.id}`)}
                                                title="View Profile"
                                                className="bg-primary hover:bg-primary/90 text-white"
                                            >
                                                <Eye size={18} />
                                            </Button>
                                            {resume.link && (
                                                <Button
                                                    size="icon"
                                                    onClick={() => window.open(resume.link, "_blank")}
                                                    title="View Resume"
                                                    className="bg-primary hover:bg-primary/90 text-white"
                                                >
                                                    <FileText size={18} />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                onClick={() => navigate(`/chat/${resume.user.id}`)}
                                                title="Message Candidate"
                                                className="bg-primary hover:bg-primary/90 text-white"
                                            >
                                                <ExternalLink size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};
