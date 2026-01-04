import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRoomByCode,
  getMessagesByRoomCode,
  validateAccess,
  updateRoomStatus,
} from "@/apis/interview.api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useInterviewSocket } from "@/hooks/useInterviewSocket";
import type { InterviewRoom, InterviewMessage } from "@/types/Interview";
import { ChatPanel } from "./ChatPanel";
import { QuestionPanel } from "./QuestionPanel";
// import { QuestionRecommendedPanel } from "./QuestionRecommendedPanel";
import { InterviewInfo } from "./InterviewInfo";
// import { EvaluationModal } from "./EvaluationModal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lock, ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const InterviewRoomPage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [room, setRoom] = useState<InterviewRoom | null>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [questions, setQuestions] = useState<InterviewMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEndConfirmDialog, setShowEndConfirmDialog] = useState(false);
  const roomRef = useRef<InterviewRoom | null>(null);

  // Sync roomRef with room state
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  const {
    connected,
    sendInterviewMessage,
    sendInterviewQuestion,
    joinInterviewRoom,
    leaveInterviewRoom,
    endInterview,
    subscribeInterviewMessage,
    subscribeInterviewQuestion,
    subscribeInterviewEnd,
  } = useInterviewSocket();

  const hasJoined = useRef(false);

  useEffect(() => {
    if (!roomCode || !user) return;

    const loadRoom = async () => {
      try {
        // Validate access
        const hasAccess = await validateAccess(roomCode, Number(user.id));
        if (!hasAccess) {
          toast.error("Bạn không có quyền truy cập vào phòng phỏng vấn này");
          navigate("/");
          return;
        }

        // Load room details
        const roomData = await getRoomByCode(roomCode);
        setRoom(roomData);

        // Load message history
        const messageHistory = await getMessagesByRoomCode(roomCode);
        const chatMessages = messageHistory.filter(
          (m) => m.type === "TEXT" || m.type === "SYSTEM"
        );
        const questionMessages = messageHistory.filter(
          (m) => m.type === "QUESTION"
        );
        setMessages(chatMessages);
        setQuestions(questionMessages);

        setLoading(false);
      } catch (error) {
        console.error("Error loading room:", error);
        toast.error("Không thể tải phòng phỏng vấn");
        navigate("/");
      }
    };

    loadRoom();
  }, [roomCode, user, navigate]);

  useEffect(() => {
    if (!connected || !roomCode || !user) return;

    // Join room (only once per mount/roomCode change)
    if (!hasJoined.current) {
      joinInterviewRoom(roomCode, Number(user.id));
      hasJoined.current = true;
    }

    // Subscribe to messages
    const messageSub = subscribeInterviewMessage((msg: InterviewMessage) => {
      if (msg.type === "TEXT" || msg.type === "SYSTEM") {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(
            (m) =>
              (m.id && m.id === msg.id) ||
              (!m.id &&
                !msg.id &&
                m.content === msg.content &&
                m.timestamp === msg.timestamp &&
                m.senderId === msg.senderId)
          );
          if (exists) return prev;
          return [...prev, msg];
        });
      }
    });

    const questionSub = subscribeInterviewQuestion((msg: InterviewMessage) => {
      setQuestions((prev) => {
        // Check if question already exists to prevent duplicates
        const exists = prev.some(
          (m) =>
            (m.id && m.id === msg.id) ||
            (!m.id &&
              !msg.id &&
              m.content === msg.content &&
              m.timestamp === msg.timestamp &&
              m.senderId === msg.senderId)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
      toast.info("Đã nhận được câu hỏi phỏng vấn mới");
    });

    const endSub = subscribeInterviewEnd(() => {
      toast.info("Cuộc phỏng vấn đã kết thúc");
      const currentRoom = roomRef.current;
      if (currentRoom && user.id === currentRoom.recruiterId.toString()) {
        // Navigate to evaluation page
        navigate(`/recruiter/interviews/evaluate/${currentRoom.id}`);
      } else {
        setTimeout(() => navigate("/"), 3000);
      }
    });

    return () => {
      if (messageSub) messageSub.unsubscribe();
      if (questionSub) questionSub.unsubscribe();
      if (endSub) endSub.unsubscribe();
      if (roomCode && user) {
        leaveInterviewRoom(roomCode, Number(user.id));
      }
    };
  }, [
    connected,
    roomCode,
    user,
    joinInterviewRoom,
    leaveInterviewRoom,
    subscribeInterviewMessage,
    subscribeInterviewQuestion,
    subscribeInterviewEnd,
    navigate,
  ]);

  const handleSendMessage = (content: string) => {
    if (!roomCode || !user || !room) return;

    // Prevent sending messages if room is expired or finished
    if (isReadOnly || isNotStartedYet) {
      toast.error(
        isNotStartedYet
          ? "Phòng phỏng vấn chưa mở. Vui lòng quay lại sau."
          : "Không thể gửi tin nhắn. Cuộc phỏng vấn này đã kết thúc."
      );
      return;
    }

    const senderRole =
      user.id === room.recruiterId.toString() ? "RECRUITER" : "APPLICANT";

    sendInterviewMessage({
      roomCode,
      senderId: Number(user.id),
      senderRole,
      type: "TEXT",
      content,
    });
  };

  const handleSendQuestion = (content: string) => {
    if (!roomCode || !user || !room) return;

    // Prevent sending questions if room is expired or finished
    if (isReadOnly || isNotStartedYet) {
      toast.error(
        isNotStartedYet
          ? "Phòng phỏng vấn chưa mở. Vui lòng quay lại sau."
          : "Không thể gửi câu hỏi. Cuộc phỏng vấn này đã kết thúc."
      );
      return;
    }

    sendInterviewQuestion({
      roomCode,
      senderId: Number(user.id),
      senderRole: "RECRUITER",
      type: "QUESTION",
      content,
    });
  };

  const handleEndInterview = () => {
    if (!roomCode || !user || !room) return;

    // Prevent ending if already expired or finished
    if (room.isExpired || room.status === "FINISHED") {
      toast.error("Cuộc phỏng vấn này đã kết thúc.");
      return;
    }

    setShowEndConfirmDialog(true);
  };

  const confirmEndInterview = async () => {
    if (!roomCode || !user || !room) return;

    try {
      await updateRoomStatus(roomCode, "FINISHED");
      endInterview(roomCode, Number(user.id));
      setShowEndConfirmDialog(false);
      // Navigate to evaluation page instead of showing modal
      navigate(`/recruiter/interviews/evaluate/${room.id}`);
      toast.success("Kết thúc cuộc phỏng vấn thành công");
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("Không thể kết thúc cuộc phỏng vấn");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 bg-white border-r p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-white">
            <div className="border-b px-6 py-3">
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="flex-1 p-6 space-y-4">
              <Skeleton className="h-12 w-[60%]" />
              <Skeleton className="h-12 w-[60%] self-end" />
              <Skeleton className="h-12 w-[40%]" />
            </div>
            <div className="border-t px-6 py-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-12" />
              </div>
            </div>
          </div>
          <div className="w-96 bg-white border-l p-4 flex flex-col">
            <div className="border-b py-3 mb-4">
              <Skeleton className="h-7 w-48" />
            </div>
            <div className="flex-1 space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="mt-4 pt-4 border-t">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room || !user) {
    return null;
  }

  const isRecruiter = user.id == room.recruiterId.toString();
  const isNotStartedYet = new Date(room.scheduledTime).getTime() > new Date().getTime() && room.status === "SCHEDULED";
  const isReadOnly =
    room.isExpired || room.status == "FINISHED" || room.status == "EXPIRED";

  const getStatusText = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Đã lên lịch";
      case "ONGOING":
        return "Đang diễn ra";
      case "FINISHED":
        return "Đã kết thúc";
      case "CANCELLED":
        return "Đã hủy";
      case "EXPIRED":
        return "Đã hết hạn";
      default:
        return status;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() =>
                navigate(isRecruiter ? "/recruiter/interviews" : "/interviews")
              }
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{room.jobTitle}</h1>
              <p className="text-sm text-gray-600">
                Phòng phỏng vấn • Trạng thái: {getStatusText(room.status)}
                {room.isExpired && " • ĐÃ HẾT HẠN"}
              </p>
            </div>
          </div>
          {isRecruiter && !room.isExpired && room.status !== "FINISHED" && room.status !== "EXPIRED" && (
            <div className="flex gap-2">
              <Button onClick={handleEndInterview} variant="destructive">
                Kết thúc phỏng vấn
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Not Started Warning Banner */}
      {isNotStartedYet && (
        <div className="m-4">
          <Alert className="border-blue-500 bg-blue-50 flex flex-row items-center ">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Cuộc phỏng vấn này được lên lịch vào lúc{" "}
              <strong>
                {new Date(room.scheduledTime).toLocaleString("vi-VN")}
              </strong>
              . Bạn có thể vào phòng sớm nhưng không thể gửi tin nhắn cho đến giờ hẹn.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Expired/Finished Warning Banner */}
      {room.isExpired && (
        <Alert className="m-4 border-orange-500 bg-orange-50 flex flex-row items-center justify-center">
          <Lock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Cuộc phỏng vấn này đã hết hạn. Bạn có thể xem lại lịch sử trò chuyện
            nhưng không thể gửi tin nhắn hoặc câu hỏi mới.
          </AlertDescription>
        </Alert>
      )}

      {room.status === "FINISHED" && !room.isExpired && (
        <Alert className="m-4 border-blue-500 bg-blue-50 flex flex-row items-center justify-start">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Cuộc phỏng vấn này đã hoàn thành. Bạn đang xem lịch sử trò chuyện ở
            chế độ chỉ đọc.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Interview Info */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <InterviewInfo room={room} />
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col">
          <ChatPanel
            messages={(() => {
              // Merge all messages and questions
              const allMessages = [...messages, ...questions];

              // Remove duplicates: prefer messages with id, or use content+timestamp+senderId+type as unique key
              const seen = new Set<string>();
              const uniqueMessages = allMessages.filter((msg) => {
                let key: string;
                if (msg.id) {
                  key = `id-${msg.id}`;
                } else {
                  key = `content-${msg.content}-${msg.timestamp}-${msg.senderId}-${msg.type}`;
                }

                if (seen.has(key)) {
                  return false;
                }
                seen.add(key);
                return true;
              });

              // Sort by timestamp
              return uniqueMessages.sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              );
            })()}
            currentUserId={Number(user.id)}
            onSendMessage={handleSendMessage}
            disabled={isReadOnly}
            isNotStartedYet={isNotStartedYet}
          />
        </div>

        {/* Right Panel - Questions (Only for Recruiter) */}
        {isRecruiter && (
          <div className="w-96 bg-white border-l">
            <QuestionPanel
              questions={questions}
              onSendQuestion={handleSendQuestion}
              roomId={room.id}
              disabled={isReadOnly}
              isNotStartedYet={isNotStartedYet}
            />
          </div>
        )}
      </div>

      {/* End Interview Confirmation Dialog */}
      <AlertDialog
        open={showEndConfirmDialog}
        onOpenChange={setShowEndConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kết thúc phỏng vấn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn kết thúc cuộc phỏng vấn này? Hành động này không
              thể hoàn tác. Bạn sẽ được chuyển hướng đến trang đánh giá.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEndInterview}
              className="bg-red-600 hover:bg-red-700"
            >
              Kết thúc phỏng vấn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
