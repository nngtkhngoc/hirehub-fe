import { useState, useEffect } from "react";
import type { InterviewMessage, InterviewQuestion } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Loader2, Check, X } from "lucide-react";
import { getInterviewQuestions } from "@/apis/interview.api";
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
  evaluation?: "ACCEPT" | "DECLINED";
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

  const handleQuestionClick = (questionContent: string) => {
    if (disabled) {
      toast.error("Cannot send questions. This interview has ended.");
      return;
    }

    // Check if question is already sent to prevent duplicate
    const isAlreadySent =
      questions.some(
        (q) => q.type === "QUESTION" && q.content === questionContent
      ) || sentQuestions.has(questionContent);

    if (isAlreadySent) {
      toast.warning("This question has already been sent");
      return;
    }

    // Send question to candidate
    onSendQuestion(questionContent);
    // Track sent question immediately to prevent duplicate clicks
    setSentQuestions((prev) => {
      const newMap = new Map(prev);
      newMap.set(questionContent, {
        content: questionContent,
        evaluation: undefined,
      });
      return newMap;
    });
    toast.success("Question sent to candidate");
  };

  const handleEvaluateQuestion = (
    questionContent: string,
    evaluation: "ACCEPT" | "DECLINED"
  ) => {
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
      `Question marked as ${evaluation === "ACCEPT" ? "Accepted" : "Declined"}`
    );
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
              // Check if question is sent (either in questions array or in sentQuestions map)
              const isSentInMessages = questions.some(
                (sentQ) => sentQ.content === q.questionContent
              );
              const isSentInState = sentQuestions.has(q.questionContent);
              const isSent = isSentInMessages || isSentInState;
              const questionStatus = sentQuestions.get(q.questionContent);
              const isEvaluated = questionStatus?.evaluation !== undefined;

              return (
                <div
                  key={q.id}
                  className={`border rounded-lg p-3 ${
                    isSent
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200 hover:border-blue-300 cursor-pointer"
                  }`}
                  onClick={() =>
                    !isSent &&
                    !disabled &&
                    handleQuestionClick(q.questionContent)
                  }
                >
                  <p className="text-sm text-gray-800">{q.questionContent}</p>

                  {/* Show evaluation buttons only after question is sent */}
                  {isSent && (
                    <>
                      <span className="text-xs text-gray-500 mt-1 block">
                        Sent
                      </span>
                      {/* Accept/Declined Buttons - Only show after sent */}
                      {!isEvaluated && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEvaluateQuestion(
                                q.questionContent,
                                "ACCEPT"
                              );
                            }}
                            disabled={disabled}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEvaluateQuestion(
                                q.questionContent,
                                "DECLINED"
                              );
                            }}
                            disabled={disabled}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Declined
                          </Button>
                        </div>
                      )}
                      {/* Evaluation Status */}
                      {isEvaluated && (
                        <div
                          className={`mt-2 text-xs font-medium ${
                            questionStatus.evaluation === "ACCEPT"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {questionStatus.evaluation === "ACCEPT"
                            ? "✓ Accepted"
                            : "✗ Declined"}
                        </div>
                      )}
                    </>
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
