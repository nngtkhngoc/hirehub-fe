import { useState, useEffect } from "react";
import type { InterviewMessage, QuestionBank } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { getQuestionBanksByRecruiterId } from "@/apis/interview.api";
import { toast } from "sonner";

interface QuestionPanelProps {
  questions: InterviewMessage[];
  onSendQuestion: (content: string) => void;
  recruiterId: string;
  disabled?: boolean;
}

export const QuestionPanel = ({ questions, onSendQuestion, recruiterId, disabled = false }: QuestionPanelProps) => {
  const [questionText, setQuestionText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [expandedBanks, setExpandedBanks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        setLoading(true);
        const banks = await getQuestionBanksByRecruiterId(Number(recruiterId));
        setQuestionBanks(banks);
        // Expand first bank by default if exists
        if (banks.length > 0) {
          setExpandedBanks(new Set([banks[0].id]));
        }
      } catch (error) {
        console.error("Error fetching question banks:", error);
        toast.error("Failed to load question banks");
      } finally {
        setLoading(false);
      }
    };

    if (recruiterId) {
      fetchQuestionBanks();
    }
  }, [recruiterId]);

  const handleSend = () => {
    if (questionText.trim()) {
      onSendQuestion(questionText);
      setQuestionText("");
      setShowInput(false);
    }
  };

  const toggleBank = (bankId: number) => {
    const newExpanded = new Set(expandedBanks);
    if (newExpanded.has(bankId)) {
      newExpanded.delete(bankId);
    } else {
      newExpanded.add(bankId);
    }
    setExpandedBanks(newExpanded);
  };

  const handleQuestionClick = (questionContent: string) => {
    if (disabled) {
      toast.error("Cannot send questions. This interview has expired.");
      return;
    }
    onSendQuestion(questionContent);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Interview Questions</h2>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Sent Questions */}
        {questions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">
              Sent Questions ({questions.length})
            </h3>
            {questions.map((q, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-gray-800">{q.content}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(q.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Question Banks */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium text-gray-600">Question Banks</h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : questionBanks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <p>No question banks found.</p>
              <p className="mt-1">Create question banks to use them here.</p>
            </div>
          ) : (
            questionBanks.map((bank) => {
              const isExpanded = expandedBanks.has(bank.id);
              return (
                <div key={bank.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Bank Header */}
                  <button
                    onClick={() => toggleBank(bank.id)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                      <div className="text-left">
                        <p className="font-medium text-sm">{bank.title}</p>
                        {bank.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{bank.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {bank.questions.length} questions
                    </span>
                  </button>

                  {/* Bank Questions */}
                  {isExpanded && (
                    <div className="bg-white">
                      {bank.questions.map((question) => (
                        <button
                          key={question.id}
                          onClick={() => handleQuestionClick(question.content)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-t border-gray-100 transition-colors group"
                        >
                          <p className="text-sm text-gray-700 group-hover:text-blue-700">
                            {question.content}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
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
            {disabled ? "Interview Expired" : "Add Custom Question"}
          </Button>
        ) : (
          <div className="space-y-2">
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={disabled ? "Interview has expired" : "Type your question..."}
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

