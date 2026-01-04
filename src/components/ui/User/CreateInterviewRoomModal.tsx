import { useState, useEffect } from "react";
import {
  createInterviewRoom,
  getQuestionBanksByRecruiterId,
} from "@/apis/interview.api";
import type { QuestionBank, Question } from "@/types/Interview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CreateInterviewRoomModalProps {
  jobId: number;
  jobTitle: string;
  applicantId: number;
  applicantName: string;
  recruiterId: number;
  roundNumber?: number;
  previousRoomId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateInterviewRoomModal = ({
  jobId,
  jobTitle,
  applicantId,
  applicantName,
  recruiterId,
  roundNumber = 1,
  previousRoomId,
  isOpen,
  onClose,
  onSuccess,
}: CreateInterviewRoomModalProps) => {
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [interviewType, setInterviewType] = useState<"CHAT" | "VIDEO">("CHAT");
  const [interviewMode, setInterviewMode] = useState<"LIVE" | "ASYNC">("LIVE");
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [selectedBankIds, setSelectedBankIds] = useState<number[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadQuestionBanks = async () => {
    try {
      const banks = await getQuestionBanksByRecruiterId(recruiterId);
      setQuestionBanks(banks);
    } catch (error) {
      console.error("Error loading question banks:", error);
    }
  };

  useEffect(() => {
    if (isOpen && interviewMode === "ASYNC") {
      loadQuestionBanks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, interviewMode]);

  // Auto-select all questions when question banks are selected
  useEffect(() => {
    if (selectedBankIds.length > 0) {
      // Get all question IDs from all selected banks
      const allQuestionIds: number[] = [];
      selectedBankIds.forEach((bankId) => {
        const bank = questionBanks.find((b) => b.id === bankId);
        if (bank && bank.questions) {
          const questionIds = bank.questions.map((q: Question) => q.id);
          allQuestionIds.push(...questionIds);
        }
      });
      // Remove duplicates
      setSelectedQuestions([...new Set(allQuestionIds)]);
    } else {
      setSelectedQuestions([]);
    }
  }, [selectedBankIds, questionBanks]);

  const toggleBankSelection = (bankId: number) => {
    if (selectedBankIds.includes(bankId)) {
      setSelectedBankIds(selectedBankIds.filter((id) => id !== bankId));
    } else {
      setSelectedBankIds([...selectedBankIds, bankId]);
    }
  };

  const handleSubmit = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select both date and time");
      return;
    }

    if (interviewMode === "ASYNC" && selectedBankIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một BỘ CÂU HỎI cho phỏng vấn async");
      return;
    }

    const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00`;

    setSubmitting(true);
    try {
      const room = await createInterviewRoom({
        jobId,
        applicantId,
        recruiterId,
        scheduledTime: scheduledDateTime,
        durationMinutes: 60,
        interviewType,
        interviewMode,
        roundNumber,
        previousRoomId,
        selectedQuestionIds:
          interviewMode === "ASYNC" ? selectedQuestions : undefined,
      });

      toast.success("Interview room created and invitation sent!");
      onSuccess?.();
      onClose();

      console.log("Created room:", room);
    } catch (error) {
      console.error("Error creating interview room:", error);
      toast.error("Failed to create interview room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Interview Room - Round {roundNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-1 block">
              Job Position
            </Label>
            <p className="text-gray-700">{jobTitle}</p>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">Candidate</Label>
            <p className="text-gray-700">{applicantName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="text-sm font-medium mb-1 block">
                Interview Type *
              </Label>
              <select
                id="type"
                value={interviewType}
                onChange={(e) =>
                  setInterviewType(e.target.value as "CHAT" | "VIDEO")
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="CHAT">Chat</option>
                <option value="VIDEO">Video (Coming Soon)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="mode" className="text-sm font-medium mb-1 block">
                Interview Mode *
              </Label>
              <select
                id="mode"
                value={interviewMode}
                onChange={(e) =>
                  setInterviewMode(e.target.value as "LIVE" | "ASYNC")
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="LIVE">Live (Real-time)</option>
                <option value="ASYNC">Async (Automated)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium mb-1 block">
                Interview Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-sm font-medium mb-1 block">
                Interview Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          {interviewMode === "ASYNC" && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">
                Chọn BỘ CÂU HỎI * (có thể chọn nhiều)
              </Label>

              <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-3 mb-3">
                {questionBanks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có bộ câu hỏi nào. Vui lòng tạo bộ câu hỏi trước.
                  </p>
                ) : (
                  questionBanks.map((bank) => (
                    <label
                      key={bank.id}
                      className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBankIds.includes(bank.id)}
                        onChange={() => toggleBankSelection(bank.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {bank.title}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({bank.questions?.length || 0} câu hỏi)
                        </span>
                      </div>
                    </label>
                  ))
                )}
              </div>

              {selectedBankIds.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Đã chọn {selectedBankIds.length} bộ câu hỏi, tổng cộng{" "}
                    {selectedQuestions.length} câu hỏi
                  </p>
                  <div className="max-h-60 overflow-y-auto border rounded p-3 bg-gray-50">
                    {selectedBankIds.map((bankId) => {
                      const bank = questionBanks.find((b) => b.id === bankId);
                      if (!bank || !bank.questions) return null;
                      return (
                        <div key={bankId} className="mb-4 last:mb-0">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            {bank.title}:
                          </p>
                          <div className="space-y-1 pl-4">
                            {bank.questions.map(
                              (q: Question, index: number) => (
                                <div
                                  key={q.id || index}
                                  className="flex items-start gap-2 py-1"
                                >
                                  <span className="text-sm font-medium text-gray-500 min-w-[20px]">
                                    {index + 1}.
                                  </span>
                                  <span className="text-sm text-gray-700">
                                    {q.content}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-800">
              <strong>📧 Automatic Notification:</strong>{" "}
              {interviewMode === "LIVE"
                ? "The candidate will receive an email and notification with the interview link."
                : "The candidate will receive an email with questions to answer at their own pace."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !scheduledDate || !scheduledTime}
          >
            {submitting ? "Creating..." : "Create & Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
