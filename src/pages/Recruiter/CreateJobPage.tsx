import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronsUpDown, X, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/lib/axios";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const levels = ["Fresher", "Junior", "Middle", "Senior", "Lead", "Manager"];
const workspaces = ["Remote", "Onsite", "Hybrid"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

interface Skill {
    id: number;
    name: string;
}

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
        applyLink: "",
        skillIds: [] as number[],
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

    const createJobMutation = useMutation({
        mutationFn: async (data: typeof formData & { isDraft?: boolean }) => {
            const endpoint = data.isDraft ? `${BASE_URL}/api/jobs/draft` : `${BASE_URL}/api/jobs`;
            const res = await axiosClient.post(endpoint, {
                ...data,
                recruiterId: user?.id,
            });
            return res.data;
        },
        onSuccess: (_, variables) => {
            if (variables.isDraft) {
                toast.success("Lưu bản nháp thành công!");
            } else {
                toast.success("Tạo việc làm thành công!");
            }
            navigate("/recruiter/jobs");
        },
        onError: () => toast.error("Tạo việc làm thất bại"),
    });

    const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();
        if (!isDraft && (!formData.title || !formData.level || !formData.workspace)) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }
        if (isDraft && !formData.title) {
            toast.error("Vui lòng nhập tiêu đề việc làm");
            return;
        }
        createJobMutation.mutate({
            ...formData,
            isDraft,
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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
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
                    <h1 className="text-2xl font-bold text-gray-900">Tạo việc làm mới</h1>
                    <p className="text-gray-500">Nhập thông tin chi tiết việc làm dưới đây</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề việc làm *</Label>
                    <Input
                        id="title"
                        placeholder="Ví dụ: Lập trình viên Frontend cao cấp"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                {/* Level & Workspace */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Cấp bậc *</Label>
                        <Select
                            value={formData.level}
                            onValueChange={(value) => setFormData({ ...formData, level: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn cấp bậc" />
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
                        <Label>Nơi làm việc *</Label>
                        <Select
                            value={formData.workspace}
                            onValueChange={(value) => setFormData({ ...formData, workspace: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn nơi làm việc" />
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
                        <Label>Loại hình công việc</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại hình" />
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
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                            id="address"
                            placeholder="Ví dụ: Thành phố Hồ Chí Minh"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                {/* Apply Link */}
                <div className="space-y-2">
                    <Label htmlFor="applyLink">Link ứng tuyển</Label>
                    <Input
                        id="applyLink"
                        placeholder="https://example.com/ung-tuyen"
                        value={formData.applyLink}
                        onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                    />
                </div>

                {/* Skills - Multi-select Dropdown */}
                <div className="space-y-2">
                    <Label>Kỹ năng</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between h-auto min-h-[40px] font-normal"
                            >
                                <div className="flex flex-wrap gap-1">
                                    {formData.skillIds.length === 0 ? (
                                        <span className="text-gray-500">Chọn kỹ năng...</span>
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
                                <CommandInput placeholder="Tìm kiếm kỹ năng..." />
                                <CommandList>
                                    <CommandEmpty>Không tìm thấy kỹ năng.</CommandEmpty>
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

                {/* Description - Rich Text Editor */}
                <div className="space-y-2">
                    <Label>Mô tả công việc</Label>
                    <RichTextEditor
                        content={formData.description}
                        onChange={(content) => setFormData({ ...formData, description: content })}
                        placeholder="Mô tả vai trò công việc, trách nhiệm, yêu cầu..."
                    />
                    <p className="text-sm text-gray-500">
                        Sử dụng thanh công cụ phía trên để định dạng văn bản: <strong>đậm</strong>, <em>nghiêng</em>, gạch chân, danh sách, v.v.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/recruiter/jobs")}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={createJobMutation.isPending}
                        className="border-gray-300"
                    >
                        <Save size={18} className="mr-2" />
                        {createJobMutation.isPending ? "Đang lưu..." : "Lưu bản nháp"}
                    </Button>
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90"
                        disabled={createJobMutation.isPending}
                    >
                        <Send size={18} className="mr-2" />
                        {createJobMutation.isPending ? "Đang tạo..." : "Tạo việc làm"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
