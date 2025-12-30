import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllResumesAdmin, banResume, unbanResume, getAllUsersAdmin } from "@/apis/admin.api";
import { Search, FileText, Eye, Filter, Ban, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { SortableTableHeader } from "@/components/ui/SortableTableHeader";
import { useTableSort } from "@/hooks/useTableSort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import profile from "@/assets/illustration/profile.png";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export const ResumeManagementPage = () => {
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedUserId, setSelectedUserId] = useState<number | "">("");
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const { sortState, handleSort, sortData } = useTableSort();
    const [coverLetterDialog, setCoverLetterDialog] = useState<{
        open: boolean;
        content: string | null;
        userName: string;
    } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "ban" | "unban";
        resumeId: number;
        userName: string;
        banReason?: string | null;
    } | null>(null);
    const [actionReason, setActionReason] = useState("");

    const queryClient = useQueryClient();

    // Fetch users for filter
    const { data: usersData } = useQuery({
        queryKey: ["admin-users-list"],
        queryFn: () => getAllUsersAdmin({ role: "user", size: 1000 }),
    });

    // Fetch recruiters for company filter
    const { data: recruitersData } = useQuery({
        queryKey: ["admin-recruiters-list"],
        queryFn: () => getAllUsersAdmin({ role: "recruiter", size: 1000 }),
    });

    const { data: resumes, isLoading } = useQuery({
        queryKey: ["admin-resumes", statusFilter, selectedUserId, selectedCompanyId],
        queryFn: () => getAllResumesAdmin({
            status: statusFilter === "all" ? undefined : statusFilter,
            user: selectedUserId || undefined,
            recruiter: selectedCompanyId || undefined,
        }),
    });

    // Ban mutation
    const banMutation = useMutation({
        mutationFn: ({ resumeId, reason }: { resumeId: number; reason: string }) => banResume(resumeId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-resumes"] });
            toast.success("Đã cấm hồ sơ thành công");
            setConfirmDialog(null);
            setActionReason("");
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cấm hồ sơ");
        },
    });

    // Unban mutation
    const unbanMutation = useMutation({
        mutationFn: (resumeId: number) => unbanResume(resumeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-resumes"] });
            toast.success("Đã bỏ cấm hồ sơ thành công");
            setConfirmDialog(null);
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi bỏ cấm hồ sơ");
        },
    });

    // Filter resumes based on search (Frontend filtering for keyword only)
    const filteredResumes = resumes?.filter((resume) => {
        const matchesKeyword =
            keyword === "" ||
            resume.user?.name?.toLowerCase().includes(keyword.toLowerCase()) ||
            resume.user?.email?.toLowerCase().includes(keyword.toLowerCase()) ||
            resume.job?.title?.toLowerCase().includes(keyword.toLowerCase());

        return matchesKeyword;
    }) || [];

    // Apply sorting
    const sortedResumes = useMemo(() => sortData(filteredResumes), [filteredResumes, sortState]);

    // Pagination
    const totalPages = Math.ceil(sortedResumes.length / ITEMS_PER_PAGE);
    const paginatedResumes = sortedResumes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when filters change
    const handleKeywordChange = (value: string) => {
        setKeyword(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleUserChange = (value: string | number) => {
        setSelectedUserId(value as number | "");
        setCurrentPage(1);
    };

    const handleCompanyChange = (value: string | number) => {
        setSelectedCompanyId(value as number | "");
        setCurrentPage(1);
    };

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

    const handleConfirmAction = () => {
        if (!confirmDialog) return;
        if (confirmDialog.type === "ban") {
            banMutation.mutate({ resumeId: confirmDialog.resumeId, reason: actionReason });
        } else {
            unbanMutation.mutate(confirmDialog.resumeId);
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
                            onChange={(e) => handleKeywordChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter size={16} className="mr-2" />
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="NOT VIEW">Chưa xem</SelectItem>
                            <SelectItem value="VIEWED">Đã xem</SelectItem>
                            <SelectItem value="ACCEPTED">Đã chấp nhận</SelectItem>
                            <SelectItem value="REJECTED">Đã từ chối</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* User Filter */}
                    <Combobox
                        options={(usersData?.content || []).map((u: any) => ({
                            value: u.id,
                            label: u.name || u.email
                        }))}
                        value={selectedUserId}
                        onChange={handleUserChange}
                        placeholder="Lọc theo ứng viên"
                        emptyMessage="Không tìm thấy ứng viên"
                        className="w-full sm:w-48"
                        icon={<Filter size={16} />}
                    />

                    {/* Company Filter */}
                    <Combobox
                        options={(recruitersData?.content || []).map((r: any) => ({
                            value: r.id,
                            label: r.name || r.email
                        }))}
                        value={selectedCompanyId}
                        onChange={handleCompanyChange}
                        placeholder="Lọc theo công ty"
                        emptyMessage="Không tìm thấy công ty"
                        className="w-full sm:w-48"
                        icon={<Filter size={16} />}
                    />
                </div>
            </div>

            {/* Resumes Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <SortableTableHeader
                                    label="ID"
                                    sortKey="id"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Ứng viên
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Công việc
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Trạng thái
                                </th>
                                <SortableTableHeader
                                    label="Ngày nộp"
                                    sortKey="createdAt"
                                    currentSortKey={sortState.key}
                                    currentSortDirection={sortState.direction}
                                    onSort={handleSort}
                                />
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="animate-pulse">Đang tải...</div>
                                    </td>
                                </tr>
                            ) : paginatedResumes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-gray-400"
                                    >
                                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Không tìm thấy hồ sơ nào</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedResumes.map((resume) => (
                                    <tr
                                        key={resume.id}
                                        className={`transition-colors ${resume.status === "BANNED"
                                            ? "bg-gray-100 opacity-60"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {/* ID */}
                                        <td className="px-6 py-4 text-gray-600">#{resume.id}</td>

                                        {/* User Info - Click to open CV */}
                                        <td
                                            className="px-6 py-4 cursor-pointer"
                                            onClick={() => resume.link && window.open(resume.link, "_blank")}
                                            title={resume.link ? "Click để xem CV" : "Không có CV"}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden ${resume.status === "BANNED"
                                                    ? "bg-gray-300"
                                                    : "bg-gradient-to-br from-primary to-purple-600"
                                                    }`}>
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
                                                    <p className={`font-medium ${resume.status === "BANNED" ? "text-gray-500" : "text-gray-900 hover:text-blue-600"}`}>
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
                                            <p className={`font-medium ${resume.status === "BANNED" ? "text-gray-500" : "text-gray-900"}`}>
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
                                                {/* View Cover Letter */}
                                                {resume.coverLetter && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="hover:cursor-pointer text-sm"
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

                                                {/* Ban/Unban Button - Same style as Job Management */}
                                                {resume.status === "BANNED" ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:cursor-pointer text-sm hover:text-blue-600"
                                                        onClick={() =>
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "unban",
                                                                resumeId: resume.id,
                                                                userName: resume.user?.name || "Ứng viên",
                                                                banReason: resume.banReason,
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
                                                        onClick={() => {
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "ban",
                                                                resumeId: resume.id,
                                                                userName: resume.user?.name || "Ứng viên",
                                                            });
                                                            setActionReason("");
                                                        }}
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </Button>
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <Button
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={16} />
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {/* Summary */}
                <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
                    Hiển thị {paginatedResumes.length} / {filteredResumes.length} hồ sơ
                    {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
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

            {/* Ban/Unban Confirmation Dialog - Same style as Job Management */}
            <AlertDialog
                open={confirmDialog?.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setConfirmDialog(null);
                        setActionReason("");
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">
                            {confirmDialog?.type === "ban" && "Xác nhận cấm hồ sơ"}
                            {confirmDialog?.type === "unban" && "Xác nhận bỏ cấm hồ sơ"}
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4">
                                {/* Resume Info */}
                                <div className="bg-gray-50 rounded-lg p-3 border">
                                    <p className="text-sm text-gray-600">Ứng viên:</p>
                                    <p className="font-medium text-gray-900">{confirmDialog?.userName}</p>
                                </div>

                                {/* Ban Reason - show for unban type when available */}
                                {confirmDialog?.type === "unban" && confirmDialog.banReason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Ban className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                                                    Lý do bị cấm bởi Admin
                                                </span>
                                                <p className="text-sm text-red-800 bg-red-100 rounded p-2">
                                                    {confirmDialog.banReason}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action description */}
                                <p className="text-sm text-gray-600">
                                    {confirmDialog?.type === "ban" &&
                                        "Hồ sơ này sẽ không còn hiển thị cho nhà tuyển dụng."}
                                    {confirmDialog?.type === "unban" &&
                                        "Hồ sơ sẽ được hiển thị lại cho nhà tuyển dụng."}
                                </p>

                                {/* Reason input - show for ban */}
                                {confirmDialog?.type === "ban" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                                            Lý do (nếu có)
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Nhập lý do cấm hồ sơ..."
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
                        }}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmAction}
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
