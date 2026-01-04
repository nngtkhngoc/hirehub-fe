import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionBankById } from "@/apis/interview.api";
import type { QuestionBank } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Edit, BookOpen, Clock, Tag } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const QuestionBankDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bank, setBank] = useState<QuestionBank | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadQuestionBank(Number(id));
        }
    }, [id]);

    const loadQuestionBank = async (bankId: number) => {
        try {
            const data = await getQuestionBankById(bankId);
            setBank(data);
        } catch (error) {
            console.error("Error loading question bank:", error);
            toast.error("Không thể tải thông tin ngân hàng câu hỏi");
            navigate("/recruiter/question-banks");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Card className="p-6">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    if (!bank) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/recruiter/question-banks")}
                        className="rounded-full"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{bank.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {bank.questions?.length || 0} câu hỏi
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Cập nhật: {new Date(bank.updatedAt).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                    </div>
                </div>
                <Button onClick={() => navigate(`/recruiter/question-banks/edit/${bank.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa Ngân hàng
                </Button>
            </div>

            <Card className="p-8 border-none shadow-md bg-white">
                <div className="space-y-8">
                    {bank.description && (
                        <div>
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                Mô tả
                            </h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {bank.description}
                            </p>
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Danh sách câu hỏi
                        </h2>
                        <div className="grid gap-4">
                            {bank.questions && bank.questions.length > 0 ? (
                                bank.questions.map((q, index) => (
                                    <div
                                        key={q.id || index}
                                        className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex gap-4">
                                            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <p className="text-gray-800 text-lg leading-relaxed pt-0.5">
                                                {q.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed">
                                    Chưa có câu hỏi nào trong ngân hàng này.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
