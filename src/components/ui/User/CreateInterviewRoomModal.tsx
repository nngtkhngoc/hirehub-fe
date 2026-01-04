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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  MessageSquare,
  Video,
  UserCheck,
  Laptop,
  Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
      toast.error("Vui lòng chọn cả ngày và giờ");
      return;
    }

    if (interviewMode === "ASYNC" && selectedBankIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một BỘ CÂU HỎI cho phỏng vấn tự động");
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

      toast.success("Đã tạo phòng phỏng vấn và gửi lời mời!");
      onSuccess?.();
      onClose();

      console.log("Created room:", room);
    } catch (error) {
      console.error("Error creating interview room:", error);
      toast.error("Tạo phòng phỏng vấn thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-9/10 overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo phòng phỏng vấn - Vòng {roundNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium mb-1 block">
              Vị trí công việc
            </Label>
            <p className="text-gray-700">{jobTitle}</p>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">Ứng viên</Label>
            <p className="text-gray-700">{applicantName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium block">
                Loại phỏng vấn *
              </Label>
              <Select
                value={interviewType}
                onValueChange={(value) => setInterviewType(value as "CHAT" | "VIDEO")}
              >
                <SelectTrigger id="type" className="w-full h-10 bg-white">
                  <SelectValue placeholder="Chọn loại phỏng vấn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHAT">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span>Chat</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="VIDEO">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-500" />
                      <span>Video (Sắp ra mắt)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode" className="text-sm font-medium block">
                Chế độ phỏng vấn *
              </Label>
              <Select
                value={interviewMode}
                onValueChange={(value) => setInterviewMode(value as "LIVE" | "ASYNC")}
              >
                <SelectTrigger id="mode" className="w-full h-10 bg-white">
                  <SelectValue placeholder="Chọn chế độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIVE">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-500" />
                      <span>Phỏng vấn trực tiếp</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ASYNC">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-orange-500" />
                      <span>Gợi ý câu hỏi</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium mb-1 block">
                Ngày phỏng vấn *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 bg-white",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? (
                      format(new Date(scheduledDate), "dd/MM/yyyy")
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate ? new Date(scheduledDate) : undefined}
                    onSelect={(date) =>
                      setScheduledDate(date ? format(date, "yyyy-MM-dd") : "")
                    }
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time" className="text-sm font-medium mb-1 block">
                Giờ phỏng vấn *
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="focus:ring-2 focus:ring-primary h-10 bg-white"
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
              <strong>📧 Thông báo tự động:</strong>{" "}
              {interviewMode === "LIVE"
                ? "Ứng viên sẽ nhận được email và thông báo kèm theo link phỏng vấn."
                : "Ứng viên sẽ nhận được email với các câu hỏi để tự trả lời."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={submitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !scheduledDate || !scheduledTime}
          >
            {submitting ? "Đang tạo..." : "Tạo & Gửi lời mời"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
