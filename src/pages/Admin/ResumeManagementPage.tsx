import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllResumesAdmin } from "@/apis/admin.api";
import { Search, FileText, Eye, ExternalLink, Filter } from "lucide-react";
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import profile from "@/assets/illustration/profile.png";

export const ResumeManagementPage = () => {
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [coverLetterDialog, setCoverLetterDialog] = useState<{
        open: boolean;
        content: string | null;
        userName: string;
    } | null>(null);

    const { data: resumes, isLoading } = useQuery({
        queryKey: ["admin-resumes"],
        queryFn: () => getAllResumesAdmin(),
    });

    // Filter resumes based on search and status
    const filteredResumes = resumes?.filter((resume) => {
        const matchesKeyword =
            keyword === "" ||
            resume.user?.name?.toLowerCase().includes(keyword.toLowerCase()) ||
            resume.user?.email?.toLowerCase().includes(keyword.toLowerCase()) ||
            resume.job?.title?.toLowerCase().includes(keyword.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || resume.status === statusFilter;

        return matchesKeyword && matchesStatus;
    }) || [];

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: vi });
        } catch {
            return dateStr;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "NOT VIEW":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Chưa xem
                    </span>
                );
            case "VIEWED":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Đã xem
                    </span>
                );
            case "ACCEPTED":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Đã chấp nhận
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Đã từ chối
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-title text-gray-900">
                    Quản lý Hồ sơ ứng tuyển
                </h1>
                <p className="text-gray-500 mt-1">
                    Xem tất cả hồ sơ ứng tuyển vào các công việc
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            placeholder="Tìm kiếm theo tên, email, công việc..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="NOT VIEW">Chưa xem</SelectItem>
                            <SelectItem value="VIEWED">Đã xem</SelectItem>
                            <SelectItem value="ACCEPTED">Đã chấp nhận</SelectItem>
                            <SelectItem value="REJECTED">Đã từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Resumes Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Ứng viên
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Công việc
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Ngày nộp
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="animate-pulse">Đang tải...</div>
                                    </td>
                                </tr>
                            ) : filteredResumes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-gray-400"
                                    >
                                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Không tìm thấy hồ sơ nào</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredResumes.map((resume) => (
                                    <tr key={resume.id} className="hover:bg-gray-50 transition-colors">
                                        {/* User Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                                                    {resume.user?.avatar ? (
                                                        <img
                                                            src={resume.user.avatar}
                                                            alt={resume.user.name || ""}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={profile}
                                                            alt="Default"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {resume.user?.name || "N/A"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {resume.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Job Info */}
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">
                                                {resume.job?.title || "N/A"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {resume.job?.recruiter?.name}
                                            </p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(resume.status)}
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {formatDate(resume.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* View Resume */}
                                                {resume.link && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                                        onClick={() => window.open(resume.link, "_blank")}
                                                    >
                                                        <ExternalLink size={14} className="mr-1" />
                                                        CV
                                                    </Button>
                                                )}

                                                {/* View Cover Letter */}
                                                {resume.coverLetter && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setCoverLetterDialog({
                                                                open: true,
                                                                content: resume.coverLetter,
                                                                userName: resume.user?.name || "Ứng viên",
                                                            })
                                                        }
                                                    >
                                                        <Eye size={14} className="mr-1" />
                                                        Thư
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

                {/* Summary */}
                <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
                    Tổng cộng: {filteredResumes.length} hồ sơ
                </div>
            </div>

            {/* Cover Letter Dialog */}
            <Dialog
                open={coverLetterDialog?.open}
                onOpenChange={(open) => !open && setCoverLetterDialog(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Thư ứng tuyển - {coverLetterDialog?.userName}
                        </DialogTitle>
                        <DialogDescription>
                            Nội dung thư xin việc của ứng viên
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap p-4 bg-gray-50 rounded-lg">
                            {coverLetterDialog?.content || "Không có nội dung"}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
