import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestionBanksByRecruiterId, deleteQuestionBank } from "@/apis/interview.api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { QuestionBank } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
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

const ITEMS_PER_PAGE = 10;

export const QuestionBankListPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    loadQuestionBanks();
  }, [user]);

  const loadQuestionBanks = async () => {
    if (!user) return;
    try {
      const data = await getQuestionBanksByRecruiterId(Number(user.id));
      setQuestionBanks(data);
    } catch (error) {
      console.error("Error loading question banks:", error);
      toast.error("Không thể tải ngân hàng câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      await deleteQuestionBank(deleteDialog.id);
      toast.success("Đã xóa ngân hàng câu hỏi thành công");
      loadQuestionBanks();
      setDeleteDialog(null);
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Không thể xóa ngân hàng câu hỏi");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(questionBanks.length / ITEMS_PER_PAGE);
  const paginatedBanks = questionBanks.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-title text-gray-900">
            Quản lý Ngân hàng Câu hỏi</h1>
          <p className="text-gray-500 mt-1">
            Quản lý câu hỏi phỏng vấn của bạn ({questionBanks.length} ngân hàng)</p>
        </div>
        <Button onClick={() => navigate("/recruiter/question-banks/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo Ngân hàng Câu hỏi
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse flex flex-col h-full">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : questionBanks.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Chưa có Ngân hàng Câu hỏi
          </h3>
          <p className="text-gray-600 mb-4">
            Tạo ngân hàng câu hỏi đầu tiên để bắt đầu phỏng vấn
          </p>
          <Button onClick={() => navigate("/recruiter/question-banks/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo Ngân hàng Câu hỏi
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBanks.map((bank) => (
              <Card key={bank.id} className="p-6 hover:bg-gray-50/50 transition-all hover:shadow-md flex flex-col h-full group">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-xs text-gray-400 font-medium font-mono uppercase tracking-wider">
                      ID: #{bank.id}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {bank.questions?.length || 0} câu hỏi
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {bank.title}
                  </h3>

                  {bank.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {bank.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <div
                    className="flex items-center gap-2 text-primary font-semibold text-sm cursor-pointer hover:underline"
                    onClick={() => navigate(`/recruiter/question-banks/${bank.id}`)}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Chi tiết</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 shadow-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/recruiter/question-banks/edit/${bank.id}`);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600 shadow-none"
                      onClick={() => setDeleteDialog({
                        open: true,
                        id: bank.id,
                        title: bank.title
                      })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
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
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog?.open}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ngân hàng câu hỏi "{deleteDialog?.title}" không?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

