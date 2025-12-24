import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const levels = ["Fresher", "Junior", "Middle", "Senior", "Lead", "Manager"];
const workspaces = ["Remote", "Onsite", "Hybrid"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

export const CreateJobPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "",
        workspace: "",
        type: "",
        address: "",
    });

    const createJobMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await axiosClient.post(`${BASE_URL}/api/jobs`, {
                ...data,
                recruiterId: user?.id,
                skillsId: [],
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Job created successfully!");
            navigate("/recruiter/jobs");
        },
        onError: () => toast.error("Failed to create job"),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.level || !formData.workspace) {
            toast.error("Please fill in all required fields");
            return;
        }
        createJobMutation.mutate(formData);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/recruiter/jobs")}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
                    <p className="text-gray-500">Fill in the job details below</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Senior Frontend Developer"
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
                            placeholder="e.g. Ho Chi Minh City"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the job role, responsibilities, requirements..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={8}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/recruiter/jobs")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600"
                        disabled={createJobMutation.isPending}
                    >
                        {createJobMutation.isPending ? "Creating..." : "Create Job"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
