import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Plus, MoreVertical, ArrowLeft, X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
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
import { cn } from "@/lib/utils";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

type JobStatus = "ACTIVE" | "CLOSED" | "UNACTIVE";


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

interface Skill {
    id: number;
    name: string;
}

const levels = ["Fresher", "Junior", "Middle", "Senior", "Lead", "Manager"];
const workspaces = ["Remote", "Onsite", "Hybrid"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

const getJobStatus = (job: JobPosting): JobStatus => {
    // Use status from API if available, otherwise calculate from flags
    if (job.status) return job.status as JobStatus;
    if (job.isDeleted) return "CLOSED";
    if (job.isBanned) return "UNACTIVE";
    return "ACTIVE";
};

const StatusBadge = ({ status }: { status: JobStatus }) => {
    const styles = {
        ACTIVE: "bg-green-100 text-green-700",
        CLOSED: "bg-gray-100 text-gray-600",
        UNACTIVE: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
};

export const JobPostingsPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [keyword, setKeyword] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [page, setPage] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "",
        workspace: "",
        type: "",
        address: "",
        applyLink: "",
        skillIds: [] as number[],
    });

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

    // Fetch skills
    const { data: skillsData } = useQuery({
        queryKey: ["skills"],
        queryFn: async () => {
            const res = await axiosClient.get(`${BASE_URL}/api/skills`);
            return res.data as Skill[];
        },
    });

    const skills = skillsData || [];

    // Create job mutation
    const createJobMutation = useMutation({
        mutationFn: async (data: typeof formData & { recruiterId: number }) => {
            const res = await axiosClient.post(`${BASE_URL}/api/jobs`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Job created successfully!");
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
            setIsCreateModalOpen(false);
            resetForm();
        },
        onError: () => toast.error("Failed to create job"),
    });

    // Delete job mutation
    const deleteJobMutation = useMutation({
        mutationFn: async (jobId: string) => {
            await axiosClient.delete(`${BASE_URL}/api/jobs/${jobId}`);
        },
        onSuccess: () => {
            toast.success("Job deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
        },
        onError: () => toast.error("Failed to delete job"),
    });

    // Update job status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ jobId, status }: { jobId: string; status: string }) => {
            await axiosClient.put(`${BASE_URL}/api/jobs/${jobId}/status`, { status });
        },
        onSuccess: () => {
            toast.success("Job status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
        },
        onError: () => toast.error("Failed to update job status"),
    });

    const jobs: JobPosting[] = data?.content || [];
    const totalPages = data?.totalPages || 0;

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            level: "",
            workspace: "",
            type: "",
            address: "",
            applyLink: "",
            skillIds: [],
        });
    };

    const handleCreateJob = () => {
        if (!formData.title || !formData.level || !formData.workspace) {
            toast.error("Please fill in all required fields");
            return;
        }
        createJobMutation.mutate({
            ...formData,
            recruiterId: user?.id as number,
        });
    };

    const toggleSkill = (skillId: number) => {
        setFormData((prev) => ({
            ...prev,
            skillIds: prev.skillIds.includes(skillId)
                ? prev.skillIds.filter((id) => id !== skillId)
                : [...prev.skillIds, skillId],
        }));
    };

    const formatTimeAgo = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 60) return `Created ${diffMins}m ago`;
            if (diffHours < 24) return `Created ${diffHours}h ago`;
            return `Created ${diffDays}d ago`;
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
                    <p className="text-gray-500">Here's all job list</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            placeholder="Search by job title..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            className="pl-10 w-64 bg-white"
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
                        <SelectTrigger className="w-36 bg-white">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                            <SelectItem value="UNACTIVE">Unactive</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Add New Button */}
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        <Plus size={18} className="mr-2" />
                        Add New
                    </Button>
                </div>
            </div>

            {/* Job List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : jobs.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        No jobs found. Create your first job posting!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {jobs.map((job) => {
                            const status = getJobStatus(job);
                            return (
                                <div
                                    key={job.id}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        {/* Left side - Job info */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {job.title}
                                                </h3>
                                                <StatusBadge status={status} />
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {job.level} · {job.recruiter?.name || "Company"}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                                                    <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white" />
                                                    <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white" />
                                                </div>
                                                <span>{job.candidatesCount || 0} Candidates Applied</span>
                                            </div>
                                        </div>

                                        {/* Right side - Actions */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-400">
                                                {formatTimeAgo(job.postingDate)}
                                            </span>

                                            {/* Status Select */}
                                            <Select
                                                value={status}
                                                onValueChange={(newStatus) => {
                                                    if (newStatus !== status) {
                                                        updateStatusMutation.mutate({ jobId: job.id, status: newStatus });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-28 h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                                    <SelectItem value="UNACTIVE">Unactive</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* More Menu */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical size={18} className="text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/job-details/${job.id}`)}
                                                    >
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/recruiter/jobs/${job.id}/candidates`)}
                                                    >
                                                        View Candidates
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this job?")) {
                                                                deleteJobMutation.mutate(job.id);
                                                            }
                                                        }}
                                                    >
                                                        Delete Job
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

            {/* Create Job Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <DialogTitle className="text-xl font-bold">Create New Job</DialogTitle>
                                <p className="text-gray-500 text-sm">Fill in the job details below</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Job Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Senior full-stack"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        {/* Level & Workspace */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Level *</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Workspace *</Label>
                                <Select
                                    value={formData.workspace}
                                    onValueChange={(value) => setFormData({ ...formData, workspace: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select workspace" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workspaces.map((ws) => (
                                            <SelectItem key={ws} value={ws}>
                                                {ws}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Type & Address */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Job Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="e.g. Ho Chi Minh"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Apply Link */}
                        <div className="space-y-2">
                            <Label htmlFor="applyLink">Apply Link</Label>
                            <Input
                                id="applyLink"
                                placeholder="https://example.com/apply"
                                value={formData.applyLink}
                                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                            />
                        </div>

                        {/* Skills - Multi-select Dropdown */}
                        <div className="space-y-2">
                            <Label>Skills</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between h-auto min-h-[40px] font-normal"
                                    >
                                        <div className="flex flex-wrap gap-1">
                                            {formData.skillIds.length === 0 ? (
                                                <span className="text-gray-500">Select skills...</span>
                                            ) : (
                                                formData.skillIds.map((skillId) => {
                                                    const skill = skills.find((s) => s.id === skillId);
                                                    return skill ? (
                                                        <Badge
                                                            key={skillId}
                                                            variant="secondary"
                                                            className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                        >
                                                            {skill.name}
                                                            <X
                                                                size={12}
                                                                className="ml-1 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleSkill(skillId);
                                                                }}
                                                            />
                                                        </Badge>
                                                    ) : null;
                                                })
                                            )}
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search skills..." />
                                        <CommandList>
                                            <CommandEmpty>No skills found.</CommandEmpty>
                                            <CommandGroup className="max-h-64 overflow-auto">
                                                {skills.map((skill) => (
                                                    <CommandItem
                                                        key={skill.id}
                                                        value={skill.name}
                                                        onSelect={() => toggleSkill(skill.id)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={formData.skillIds.includes(skill.id)}
                                                                className="pointer-events-none"
                                                            />
                                                            {skill.name}
                                                        </div>
                                                        <Check
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                formData.skillIds.includes(skill.id)
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Job Title: Human Resources Assistant&#10;Job Description: This position reports to the Human Resources (HR) director and interfaces with company managers and HR staff..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={8}
                                className="resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    resetForm();
                                }}
                                className="border-primary/30 text-primary hover:bg-primary/10"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateJob}
                                className="bg-primary hover:bg-primary/90 text-white"
                                disabled={createJobMutation.isPending}
                            >
                                {createJobMutation.isPending ? "Creating..." : "Create Job"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
