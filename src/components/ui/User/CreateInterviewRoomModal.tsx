import { useState, useEffect } from "react";
import {
  createInterviewRoom,
  getQuestionBanksByRecruiterId,
} from "@/apis/interview.api";
import type { QuestionBank } from "@/types/Interview";
import { Dialog } from "@/components/ui/dialog";
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
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
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

  const selectedBank = questionBanks.find((b) => b.id === selectedBankId);

  const toggleQuestion = (qId: number) => {
    if (selectedQuestions.includes(qId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== qId));
    } else {
      setSelectedQuestions([...selectedQuestions, qId]);
    }
  };

  const handleSubmit = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select both date and time");
      return;
    }

    if (interviewMode === "ASYNC" && selectedQuestions.length === 0) {
      toast.error("Please select at least one question for async interview");
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold">
              Create Interview Room - Round {roundNumber}
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Job Position
              </Label>
              <p className="text-gray-700">{jobTitle}</p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">
                Candidate
              </Label>
              <p className="text-gray-700">{applicantName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="type"
                  className="text-sm font-medium mb-1 block"
                >
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
                <Label
                  htmlFor="mode"
                  className="text-sm font-medium mb-1 block"
                >
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
                <Label
                  htmlFor="date"
                  className="text-sm font-medium mb-1 block"
                >
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
                <Label
                  htmlFor="time"
                  className="text-sm font-medium mb-1 block"
                >
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
                  Select Questions *
                </Label>

                <div className="mb-3">
                  <select
                    value={selectedBankId || ""}
                    onChange={(e) =>
                      setSelectedBankId(Number(e.target.value) || null)
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">-- Select Question Bank --</option>
                    {questionBanks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.title} ({bank.questions?.length || 0} questions)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBank && (
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-3">
                    {selectedBank.questions?.map((q) => (
                      <label
                        key={q.id}
                        className="flex items-start gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(q.id)}
                          onChange={() => toggleQuestion(q.id)}
                          className="mt-1"
                        />
                        <span className="text-sm">{q.content}</span>
                      </label>
                    ))}
                  </div>
                )}

                {selectedQuestions.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {selectedQuestions.length} questions selected
                  </p>
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

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end">
            <Button onClick={onClose} variant="outline" disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !scheduledDate || !scheduledTime}
            >
              {submitting ? "Creating..." : "Create & Send Invitation"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
