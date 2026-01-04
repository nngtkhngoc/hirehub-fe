import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestionBank, getQuestionBankById, updateQuestionBank } from "@/apis/interview.api";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export const CreateQuestionBankPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadQuestionBank(Number(id));
    }
  }, [id]);

  const loadQuestionBank = async (bankId: number) => {
    setLoading(true);
    try {
      const data = await getQuestionBankById(bankId);
      setTitle(data.title);
      setDescription(data.description || "");
      // @ts-ignore - Assuming category might exist in some version or can be derived
      if (data.category) setCategory(data.category);
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions.map(q => q.content));
      }
    } catch (error) {
      console.error("Error loading question bank:", error);
      toast.error("Không thể tải thông tin ngân hàng câu hỏi");
      navigate("/recruiter/question-banks");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    const validQuestions = questions.filter((q) => q.trim());
    if (validQuestions.length === 0) {
      toast.error("Vui lòng thêm ít nhất một câu hỏi");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        recruiterId: Number(user.id),
        title,
        description,
        category,
        questions: validQuestions,
      };

      if (isEditMode) {
        await updateQuestionBank(Number(id), payload);
        toast.success("Đã cập nhật ngân hàng câu hỏi thành công!");
      } else {
        await createQuestionBank(payload);
        toast.success("Đã tạo ngân hàng câu hỏi thành công!");
      }
      navigate("/recruiter/question-banks");
    } catch (error) {
      console.error("Error saving question bank:", error);
      toast.error(isEditMode ? "Không thể cập nhật ngân hàng câu hỏi" : "Không thể tạo ngân hàng câu hỏi");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Chỉnh sửa Ngân hàng Câu hỏi" : "Tạo Ngân hàng Câu hỏi"}
        </h1>
      </div>

      <Card className="p-6 space-y-6 shadow-md border-none">
        <div>
          <Label htmlFor="title">Tiêu đề *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Câu hỏi phỏng vấn Backend Developer"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Danh mục *</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="TECHNICAL">Kỹ thuật (Technical)</option>
            <option value="BEHAVIORAL">Hành vi (Behavioral)</option>
            <option value="GENERAL">Chung (General)</option>
            <option value="HR">Nhân sự (HR)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn gọn về ngân hàng câu hỏi này..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <Label>Danh sách câu hỏi *</Label>
            <Button type="button" size="sm" onClick={addQuestion} variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Plus className="h-4 w-4 mr-1" />
              Thêm câu hỏi
            </Button>
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={index} className="flex gap-2 group animate-in slide-in-from-left-5 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                <Textarea
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder={`Câu hỏi ${index + 1}`}
                  rows={2}
                  className="flex-1 focus:ring-2 focus:ring-primary outline-none"
                />
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSubmit} disabled={submitting} className="min-w-[150px]">
            {submitting ? (isEditMode ? "Đang cập nhật..." : "Đang tạo...") : (isEditMode ? "Cập nhật Ngân hàng" : "Tạo Ngân hàng")}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/recruiter/question-banks")}
          >
            Hủy
          </Button>
        </div>
      </Card>
    </div>
  );
};
