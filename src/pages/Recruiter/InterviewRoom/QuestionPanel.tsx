import { useState, useEffect } from "react";
import type { InterviewMessage, InterviewQuestion } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Loader2, Check, X } from "lucide-react";
import { getInterviewQuestions, evaluateQuestion, markQuestionAsSent } from "@/apis/interview.api";
import { toast } from "sonner";

interface QuestionPanelProps {
  questions: InterviewMessage[];
  onSendQuestion: (content: string) => void;
  roomId: number;
  disabled?: boolean;
}

interface SentQuestionStatus {
  content: string;
  messageId?: number;
  questionId?: number; // InterviewQuestion ID for API calls
  evaluation?: "PASS" | "FAIL" | "PENDING";
}

export const QuestionPanel = ({
  questions,
  onSendQuestion,
  roomId,
  disabled = false,
}: QuestionPanelProps) => {
  const [questionText, setQuestionText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [roomQuestions, setRoomQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentQuestions, setSentQuestions] = useState<
    Map<string, SentQuestionStatus>
  >(new Map());

  useEffect(() => {
    const fetchRoomQuestions = async () => {
      try {
        setLoading(true);
        const questions = await getInterviewQuestions(roomId);
        setRoomQuestions(questions);

        // Initialize sentQuestions with evaluation from backend
        const initialSentQuestions = new Map<string, SentQuestionStatus>();
        questions.forEach((q) => {
          initialSentQuestions.set(q.questionContent, {
            content: q.questionContent,
            questionId: q.id,
            evaluation: q.evaluation, // Load evaluation from backend
          });
        });
        setSentQuestions(initialSentQuestions);
      } catch (error) {
        console.error("Error fetching room questions:", error);
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomQuestions();
    }
  }, [roomId]);

  const handleSend = () => {
    if (questionText.trim()) {
      // Check if question is already sent to prevent duplicate
      const isAlreadySent =
        questions.some(
          (q) => q.type === "QUESTION" && q.content === questionText.trim()
        ) || sentQuestions.has(questionText.trim());

      if (isAlreadySent) {
        toast.warning("This question has already been sent");
        return;
      }

      onSendQuestion(questionText.trim());
      // Track sent question
      setSentQuestions((prev) => {
        const newMap = new Map(prev);
        newMap.set(questionText.trim(), {
          content: questionText.trim(),
          evaluation: undefined,
        });
        return newMap;
      });
      setQuestionText("");
      setShowInput(false);
      toast.success("Question sent to candidate");
    }
  };

  // Sync sent questions with actual questions from socket
  useEffect(() => {
    setSentQuestions((prev) => {
      const newMap = new Map(prev);
      let hasChanges = false;
      questions.forEach((q) => {
        if (q.type === "QUESTION" && !newMap.has(q.content)) {
          newMap.set(q.content, {
            content: q.content,
            messageId: q.id,
            evaluation: undefined,
          });
          hasChanges = true;
        }
      });
      return hasChanges ? newMap : prev;
    });
  }, [questions]);

  const handleQuestionClick = async (questionId: number, questionContent: string) => {
    console.log("test")
    if (disabled) {
      console.log("hoi")
      toast.error("Cannot send questions. This interview has ended.");
      return;
    }

    try {
      // Mark question as SENT in backend
      await markQuestionAsSent(questionId);

      // Update local roomQuestions state
      setRoomQuestions(prev =>
        prev.map(q =>
          q.id === questionId ? { ...q, status: "SENT" } : q
        )
      );

      // Send question to candidate via socket
      onSendQuestion(questionContent);
      toast.success("Question sent to candidate");
    } catch (error) {
      console.error("Error sending question:", error);
      toast.error("Failed to send question");
    }
  };

  const handleEvaluateQuestion = async (
    questionId: number,
    questionContent: string,
    evaluation: "PASS" | "FAIL"
  ) => {
    try {
      // Call backend API to save evaluation
      await evaluateQuestion(questionId, evaluation);

      // Update local state
      setSentQuestions((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(questionContent);
        if (existing) {
          newMap.set(questionContent, {
            ...existing,
            evaluation,
          });
        }
        return newMap;
      });

      toast.success(
        `Question marked as ${evaluation === "PASS" ? "Accepted" : "Declined"}`
      );
    } catch (error) {
      console.error("Error evaluating question:", error);
      toast.error("Failed to save evaluation");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Interview Questions</h2>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Room Questions - Available to send */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : roomQuestions.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">
              Available Questions ({roomQuestions.length})
            </h3>
            {roomQuestions.map((q) => {
              // Determine status based on backend data
              const isPending = q.status === "PENDING";
              const isSent = q.status === "SENT";
              const isEvaluated = q.evaluation !== undefined && q.evaluation !== null;

              return (
                <div
                  key={q.id}
                  className={`border rounded-lg p-3 ${isEvaluated
                    ? "bg-gray-50 border-gray-300"
                    : isSent
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200 hover:border-blue-300 cursor-pointer"
                    }`}
                  onClick={() =>
                    isPending &&
                    !disabled &&
                    handleQuestionClick(q.id, q.questionContent)
                  }
                >
                  <p className="text-sm text-gray-800">{q.questionContent}</p>

                  {/* Show status based on question state */}
                  {isSent && !isEvaluated && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      Sent
                    </span>
                  )}

                  {/* Pass/Fail Buttons - Only show after sent but not evaluated */}
                  {isSent && !isEvaluated && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEvaluateQuestion(
                            q.id,
                            q.questionContent,
                            "PASS"
                          );
                        }}
                        disabled={disabled}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Pass
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEvaluateQuestion(
                            q.id,
                            q.questionContent,
                            "FAIL"
                          );
                        }}
                        disabled={disabled}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Fail
                      </Button>
                    </div>
                  )}

                  {/* Evaluation Status */}
                  {isEvaluated && (
                    <div
                      className={`mt-2 text-xs font-medium ${q.evaluation === "PASS"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {q.evaluation === "PASS"
                        ? "✓ Passed"
                        : "✗ Failed"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>No questions available for this interview.</p>
          </div>
        )}
      </div>

      {/* Custom Question Input */}
      <div className="bg-white border-t p-4">
        {!showInput ? (
          <Button
            onClick={() => setShowInput(true)}
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            {disabled ? "Interview Ended" : "Add Custom Question"}
          </Button>
        ) : (
          <div className="space-y-2">
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={
                disabled
                  ? "Interview has ended - Read only mode"
                  : "Type your question..."
              }
              rows={3}
              className="w-full"
              disabled={disabled}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSend}
                disabled={!questionText.trim() || disabled}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button
                onClick={() => {
                  setShowInput(false);
                  setQuestionText("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
