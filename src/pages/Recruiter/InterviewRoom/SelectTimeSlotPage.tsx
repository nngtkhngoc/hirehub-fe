import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getScheduleRequestByCode, selectTimeSlot } from "@/apis/interview.api";
import type {
  InterviewScheduleRequest,
  InterviewTimeSlotInfo,
} from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Briefcase,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export const SelectTimeSlotPage = () => {
  const { requestCode } = useParams<{ requestCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [scheduleRequest, setScheduleRequest] =
    useState<InterviewScheduleRequest | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (requestCode) {
      loadScheduleRequest();
    }
  }, [requestCode]);

  const loadScheduleRequest = async () => {
    try {
      setLoading(true);
      const data = await getScheduleRequestByCode(requestCode!);
      setScheduleRequest(data);

      // Check if already selected
      if (data.status !== "PENDING") {
        if (data.status === "SELECTED") {
          toast.info(
            "Bạn đã chọn khung giờ cho buổi phỏng vấn này"
          );
        } else if (data.status === "EXPIRED") {
          toast.error("Yêu cầu đặt lịch này đã hết hạn");
        } else if (data.status === "CANCELLED") {
          toast.error("Yêu cầu đặt lịch này đã bị hủy");
        }
      }
    } catch (error) {
      console.error("Error loading schedule request:", error);
      toast.error("Tải thông tin yêu cầu đặt lịch thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = async () => {
    if (!selectedSlotId || !scheduleRequest || !user) {
      return;
    }

    // Verify user is the applicant
    if (Number(user.id) !== scheduleRequest.applicantId) {
      toast.error(
        "Bạn không có quyền chọn khung giờ cho buổi phỏng vấn này"
      );
      return;
    }

    setSubmitting(true);
    try {
      const room = await selectTimeSlot({
        scheduleRequestId: scheduleRequest.id,
        timeSlotId: selectedSlotId,
        applicantId: Number(user.id),
      });

      toast.success(
        "Đã chọn khung giờ! Phòng phỏng vấn đã được tạo. Bạn sẽ nhận được email xác nhận."
      );

      // Navigate to the interview room
      setTimeout(() => {
        navigate(`/interview-room/${room.roomCode}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error selecting time slot:", error);
      const errorMessage =
        error.response?.data?.message === "All proposed time slots are no longer available"
          ? "Tất cả các khung giờ đề xuất không còn khả dụng"
          : "Chọn khung giờ thất bại";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          Chờ xác nhận
        </span>
      ),
      SELECTED: (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Đã chọn khung giờ
        </span>
      ),
      EXPIRED: (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Đã hết hạn
        </span>
      ),
      CANCELLED: (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          Đã hủy
        </span>
      ),
    };
    return badges[status as keyof typeof badges] || null;
  };

  const getAvailableSlots = () => {
    return scheduleRequest?.timeSlots.filter((slot) => slot.isAvailable) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải yêu cầu lịch hẹn...</p>
        </div>
      </div>
    );
  }

  if (!scheduleRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy yêu cầu</h2>
          <p className="text-gray-600">
            Yêu cầu đặt lịch bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </Card>
      </div>
    );
  }

  const availableSlots = getAvailableSlots();
  const isPending = scheduleRequest.status === "PENDING";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-6 mb-2">
          <div className="flex justify-between items-start ">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Chọn khung giờ phỏng vấn
              </h1>
              <p className="text-gray-600">
                Chọn thời gian bạn muốn cho buổi phỏng vấn
              </p>
            </div>
            {getStatusBadge(scheduleRequest.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Vị trí</p>
                <p className="font-semibold">{scheduleRequest.jobTitle}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Người tuyển dụng</p>
                <p className="font-semibold">{scheduleRequest.recruiterName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Loại phỏng vấn</p>
                <p className="font-semibold">
                  {scheduleRequest.interviewType === "CHAT" ? "Chat" : "Video"} -{" "}
                  {scheduleRequest.interviewMode === "LIVE" ? "Trực tiếp" : "Gợi ý câu hỏi"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Vòng</p>
                <p className="font-semibold">
                  Vòng {scheduleRequest.roundNumber}
                </p>
              </div>
            </div>
          </div>

          {scheduleRequest.expiresAt && isPending && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>⏰ Hết hạn lúc:</strong>{" "}
                {new Date(scheduleRequest.expiresAt).toLocaleString("vi-VN")}
              </p>
            </div>
          )}
        </Card>

        {/* Time Slots */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Các khung giờ đề xuất</h2>

          {!isPending && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                {scheduleRequest.status === "SELECTED"
                  ? "Bạn đã chọn khung giờ. Phòng phỏng vấn đã được tạo."
                  : "Yêu cầu đặt lịch này không còn hiệu lực."}
              </p>
            </div>
          )}

          {isPending && availableSlots.length === 0 && (
            <div className="p-6 text-center bg-red-50 border border-red-200 rounded">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Không có khung giờ trống
              </h3>
              <p className="text-red-700">
                Tất cả các khung giờ đề xuất đều trùng với các buổi phỏng vấn khác của bạn.
                Vui lòng liên hệ với người tuyển dụng để đề xuất thời gian khác.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {scheduleRequest.timeSlots.map((slot: InterviewTimeSlotInfo) => {
              const { date, time } = formatDateTime(slot.proposedTime);
              const isSelected = selectedSlotId === slot.id;
              const isAvailable = slot.isAvailable;

              return (
                <div
                  key={slot.id}
                  className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${isSelected
                    ? "border-blue-500 bg-blue-50"
                    : isAvailable
                      ? "border-gray-200 hover:border-blue-300 bg-white"
                      : "border-red-200 bg-red-50 opacity-60 cursor-not-allowed"
                    }`}
                  onClick={() => {
                    if (isAvailable && isPending) {
                      setSelectedSlotId(slot.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <p className="font-semibold">{date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <p className="text-gray-700">{time}</p>
                      </div>
                      {!isAvailable && slot.conflictReason && (
                        <div className="mt-2 flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-700">
                            {slot.conflictReason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      {isAvailable ? (
                        isSelected ? (
                          <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                        )
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isPending && availableSlots.length > 0 && (
            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSelectSlot}
                disabled={!selectedSlotId || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xác nhận...
                  </>
                ) : (
                  "Xác nhận chọn"
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
