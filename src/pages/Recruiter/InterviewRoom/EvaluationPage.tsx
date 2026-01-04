import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { InterviewRoom, InterviewResult } from "@/types/Interview";
import {
  getRoomById,
  getResultByRoomId,
  submitInterviewResult,
  saveDraftResult,
} from "@/apis/interview.api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ClipboardList } from "lucide-react";

export const EvaluationPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [room, setRoom] = useState<InterviewRoom | null>(null);
  const [existingResult, setExistingResult] = useState<InterviewResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [recommendation, setRecommendation] = useState<
    "PASS" | "FAIL" | "HIRE" | "REJECT" | "CONSIDER"
  >("PASS");
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const isSubmitted = !!(existingResult && !existingResult.isDraft);
  const isRecruiter = user && room && user.id == room.recruiterId.toString();
  const isUserRecruiter = user?.role?.name?.toLowerCase() === "recruiter";

  useEffect(() => {
    if (!roomId || !user) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const roomData = await getRoomById(Number(roomId));
        setRoom(roomData);

        // Try to load existing result (draft or submitted)
        let result: InterviewResult | null = null;
        try {
          result = await getResultByRoomId(roomData.id);
          setExistingResult(result);
          if (result) {
            setScore(result.score);
            setComment(result.comment || "");
            setPrivateNotes(result.privateNotes || "");
            setRecommendation(result.recommendation);
          }
        } catch (error) {
          console.log("No existing evaluation found");
        }

        // Permission check
        const isRecruiter = user.id == roomData.recruiterId.toString();
        const isApplicant = user.id == roomData.applicantId.toString();

        if (!isRecruiter && !isApplicant) {
          toast.error("Bạn không có quyền xem đánh giá này");
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Error loading room:", error);
        toast.error("Không thể tải thông tin phòng phỏng vấn");
        navigate(isUserRecruiter ? "/recruiter/interviews" : "/interviews");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roomId, user, navigate]);

  const handleSaveDraft = async () => {
    if (!room) return;

    setSavingDraft(true);
    try {
      await saveDraftResult({
        roomId: room.id,
        score,
        comment,
        privateNotes,
        recommendation,
        isDraft: true,
      });
      toast.success("Đã lưu bản nháp thành công");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Lưu bản nháp thất bại");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    if (!room) return;

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }

    setSubmitting(true);
    try {
      await submitInterviewResult({
        roomId: room.id,
        score,
        comment,
        privateNotes,
        recommendation,
        isDraft: false,
      });

      toast.success("Đã gửi đánh giá phỏng vấn thành công");
      navigate(isUserRecruiter ? "/recruiter/interviews" : "/interviews");
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-12 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-8">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${!isRecruiter ? "pt-[100px]" : ""}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(isUserRecruiter ? "/recruiter/interviews" : "/interviews")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Đánh giá phỏng vấn</h1>
          <p className="text-gray-600 mt-2">
            Đánh giá cuộc phỏng vấn cho {room.applicantName} - {room.jobTitle}
          </p>
          {existingResult && existingResult.isDraft && (
            <div className="mt-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded">
              Bạn có một bản nháp đã lưu. Tiếp tục chỉnh sửa hoặc gửi khi sẵn sàng.
            </div>
          )}
          {existingResult && !existingResult.isDraft && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded">
              Đánh giá đã được gửi. Bạn chỉ có thể xem lại thông tin này.
            </div>
          )}
        </div>

        {/* Evaluation Content or Empty State */}
        {!isRecruiter && !isSubmitted ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 flex flex-col items-center justify-center">
            <Empty className="border-none">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <ClipboardList className="text-primary h-12 w-12" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">Chưa có đánh giá</EmptyTitle>
                <EmptyDescription className="text-base max-w-sm">
                  Nhà tuyển dụng chưa gửi đánh giá cho buổi phỏng vấn này.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            {/* Score */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Điểm số (1-10)
              </Label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => !isSubmitted && setScore(num)}
                    disabled={isSubmitted}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${score === num
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      } ${isSubmitted ? "cursor-not-allowed opacity-80" : ""}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Đề xuất
              </Label>
              <RadioGroup
                value={recommendation}
                onValueChange={(value) =>
                  !isSubmitted && setRecommendation(value as any)
                }
                disabled={isSubmitted}
              >
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="PASS"
                      checked={recommendation === "PASS"}
                      onChange={(e) =>
                        !isSubmitted && setRecommendation(e.target.value as any)
                      }
                      className="w-4 h-4"
                      disabled={isSubmitted}
                    />
                    <span className="text-sm font-medium">
                      ✓ Đạt - Đề xuất tuyển dụng
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="FAIL"
                      checked={recommendation === "FAIL"}
                      onChange={(e) =>
                        !isSubmitted && setRecommendation(e.target.value as any)
                      }
                      className="w-4 h-4"
                      disabled={isSubmitted}
                    />
                    <span className="text-sm font-medium">
                      ✗ Không đạt - Không đề xuất tuyển dụng
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Comment */}
            <div>
              <Label
                htmlFor="comment"
                className="text-base font-medium mb-2 block"
              >
                Nhận xét (Bắt buộc) *
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cung cấp nhận xét tổng quan về ứng viên..."
                rows={4}
                className="w-full"
                disabled={isSubmitted}
              />
            </div>

            {/* Private Notes - Only for recruiter */}
            {user?.id == room.recruiterId.toString() && (
              <div>
                <Label
                  htmlFor="privateNotes"
                  className="text-base font-medium mb-2 block"
                >
                  Ghi chú riêng (Tùy chọn)
                </Label>
                <Textarea
                  id="privateNotes"
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="Ghi chú nội bộ không được chia sẻ với ứng viên..."
                  rows={3}
                  className="w-full"
                  disabled={isSubmitted}
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!isSubmitted && (
          <div className="mt-6 flex gap-3 justify-end">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              disabled={savingDraft || submitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {savingDraft ? "Đang lưu..." : "Lưu nháp"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || savingDraft || !comment.trim()}
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
