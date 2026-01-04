import { useState, useEffect } from "react";
import type { InterviewQuestion } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getInterviewQuestions, evaluateQuestion } from "@/apis/interview.api";
import { toast } from "sonner";

interface QuestionRecommendedPanelProps {
  roomId: number;
  disabled?: boolean;
}

export const QuestionRecommendedPanel = ({ roomId, disabled = false }: QuestionRecommendedPanelProps) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [roomId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getInterviewQuestions(roomId);
      setQuestions(data);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (questionId: number, evaluation: "PASS" | "FAIL") => {
    if (disabled) {
      toast.error("Cannot evaluate. This interview has ended.");
      return;
    }

    try {
      setEvaluating(questionId);
      const updatedQuestion = await evaluateQuestion(questionId, evaluation);
      
      // Update local state
      setQuestions(prev =>
        prev.map(q => (q.id === questionId ? updatedQuestion : q))
      );
      
      toast.success(`Question marked as ${evaluation}`);
    } catch (error) {
      console.error("Error evaluating question:", error);
      toast.error("Failed to evaluate question");
    } finally {
      setEvaluating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Question Recommended</h2>
        <p className="text-xs text-gray-500 mt-1">
          {questions.length} question{questions.length !== 1 ? "s" : ""} • 
          {questions.filter(q => q.status === "ANSWERED").length} answered
        </p>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No questions found</p>
            <p className="text-xs mt-1">This interview doesn't have any questions yet.</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className={`border rounded-lg p-4 ${
                question.status === "ANSWERED"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Question Number & Status */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Q{index + 1}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      question.status === "ANSWERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {question.status === "ANSWERED" ? "Answered" : "Pending"}
                  </span>
                </div>

                {/* Evaluation Status */}
                {question.evaluation && (
                  <div className="flex items-center gap-1">
                    {question.evaluation === "PASS" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-600">PASS</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">FAIL</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Question Content */}
              <p className="text-sm font-medium text-gray-900 mb-3">
                {question.questionContent}
              </p>

              {/* Answer */}
              {question.answer ? (
                <div className="bg-white rounded-md p-3 mb-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Answer:</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {question.answer}
                  </p>
                  {question.answeredAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Answered at: {new Date(question.answeredAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-md p-3 mb-3 border border-gray-200">
                  <p className="text-xs text-gray-400 italic">No answer yet</p>
                </div>
              )}

              {/* Evaluation Buttons */}
              {question.status === "ANSWERED" && !disabled && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={question.evaluation === "PASS" ? "default" : "outline"}
                    className={`flex-1 ${
                      question.evaluation === "PASS"
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                    }`}
                    onClick={() => handleEvaluate(question.id, "PASS")}
                    disabled={evaluating === question.id}
                  >
                    {evaluating === question.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Pass
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant={question.evaluation === "FAIL" ? "default" : "outline"}
                    className={`flex-1 ${
                      question.evaluation === "FAIL"
                        ? "bg-red-600 hover:bg-red-700"
                        : "hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    }`}
                    onClick={() => handleEvaluate(question.id, "FAIL")}
                    disabled={evaluating === question.id}
                  >
                    {evaluating === question.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Fail
                      </>
                    )}
                  </Button>
                </div>
              )}

              {question.status === "PENDING" && (
                <div className="text-center py-2 text-xs text-gray-400">
                  Waiting for candidate to answer...
                </div>
              )}

              {disabled && question.status === "ANSWERED" && !question.evaluation && (
                <div className="text-center py-2 text-xs text-gray-400">
                  Not evaluated
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t px-4 py-3">
        <div className="text-xs text-gray-600">
          <p className="flex items-center justify-between">
            <span>Evaluated:</span>
            <span className="font-medium">
              {questions.filter(q => q.evaluation).length} / {questions.length}
            </span>
          </p>
          <p className="flex items-center justify-between mt-1">
            <span>Pass Rate:</span>
            <span className="font-medium text-green-600">
              {questions.length > 0
                ? Math.round(
                    (questions.filter(q => q.evaluation === "PASS").length /
                      questions.filter(q => q.evaluation).length) *
                      100
                  ) || 0
                : 0}
              %
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

