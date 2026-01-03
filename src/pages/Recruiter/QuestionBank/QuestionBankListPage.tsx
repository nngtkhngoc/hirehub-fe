import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestionBanksByRecruiterId, deleteQuestionBank } from "@/apis/interview.api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { QuestionBank } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const QuestionBankListPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadQuestionBanks();
  }, [user]);

  const loadQuestionBanks = async () => {
    if (!user) return;
    try {
      const data = await getQuestionBanksByRecruiterId(user.id);
      setQuestionBanks(data);
    } catch (error) {
      console.error("Error loading question banks:", error);
      toast.error("Failed to load question banks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question bank?")) return;
    
    try {
      await deleteQuestionBank(id);
      toast.success("Question bank deleted");
      loadQuestionBanks();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete question bank");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Question Banks</h1>
          <p className="text-gray-600">Manage your interview questions</p>
        </div>
        <Button onClick={() => navigate("/recruiter/question-banks/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Question Bank
        </Button>
      </div>

      {questionBanks.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Question Banks
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first question bank to start conducting interviews
          </p>
          <Button onClick={() => navigate("/recruiter/question-banks/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Question Bank
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questionBanks.map((bank) => (
            <Card key={bank.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{bank.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {bank.category}
                    </span>
                  </div>
                  {bank.description && (
                    <p className="text-gray-600 mb-3">{bank.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {bank.questions?.length || 0} questions
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/recruiter/question-banks/${bank.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(bank.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

