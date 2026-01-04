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
import { EvaluationModal } from "./EvaluationModal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export const InterviewRoomPage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [room, setRoom] = useState<InterviewRoom | null>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [questions, setQuestions] = useState<InterviewMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);

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
          toast.error("You don't have access to this interview room");
          navigate("/");
          return;
        }

        // Load room details
        const roomData = await getRoomByCode(roomCode);
        setRoom(roomData);

        // Load message history
        const messageHistory = await getMessagesByRoomCode(roomCode);
        const chatMessages = messageHistory.filter(
          (m) => m.type === "CHAT" || m.type === "SYSTEM"
        );
        const questionMessages = messageHistory.filter(
          (m) => m.type === "QUESTION"
        );
        setMessages(chatMessages);
        setQuestions(questionMessages);

        setLoading(false);
      } catch (error) {
        console.error("Error loading room:", error);
        toast.error("Failed to load interview room");
        navigate("/");
      }
    };

    loadRoom();
  }, [roomCode, user, navigate]);

  useEffect(() => {
    if (!connected || !roomCode || !user || hasJoined.current) return;

    // Join room
    joinInterviewRoom(roomCode, Number(user.id));
    hasJoined.current = true;

    // Subscribe to messages
    const messageSub = subscribeInterviewMessage((msg: InterviewMessage) => {
      if (msg.type === "CHAT" || msg.type === "SYSTEM") {
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
      toast.info("New interview question received");
    });

    const endSub = subscribeInterviewEnd(() => {
      toast.info("Interview has ended");
      if (room && user.id === room.recruiterId.toString()) {
        setShowEvaluation(true);
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
    room,
  ]);

  const handleSendMessage = (content: string) => {
    if (!roomCode || !user || !room) return;

    // Prevent sending messages if room is expired or finished
    if (isReadOnly) {
      toast.error("Cannot send messages. This interview has ended.");
      return;
    }

    const senderRole =
      user.id === room.recruiterId.toString() ? "RECRUITER" : "APPLICANT";

    sendInterviewMessage({
      roomCode,
      senderId: Number(user.id),
      senderRole,
      type: "CHAT",
      content,
    });
  };

  const handleSendQuestion = (content: string) => {
    if (!roomCode || !user || !room) return;

    // Prevent sending questions if room is expired or finished
    if (isReadOnly) {
      toast.error("Cannot send questions. This interview has ended.");
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

  const handleEndInterview = async () => {
    if (!roomCode || !user) return;

    // Prevent ending if already expired
    if (room && room.isExpired) {
      toast.error("This interview has already expired.");
      return;
    }

    try {
      await updateRoomStatus(roomCode, "FINISHED");
      endInterview(roomCode, Number(user.id));
      setShowEvaluation(true);
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("Failed to end interview");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading interview room...</div>
      </div>
    );
  }

  if (!room || !user) {
    return null;
  }

  const isRecruiter = user.id == room.recruiterId.toString();
  const isReadOnly =
    room.isExpired || room.status == "FINISHED" || room.status == "EXPIRED";

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{room.jobTitle}</h1>
            <p className="text-sm text-gray-600">
              Interview Room • Status: {room.status}
              {room.isExpired && " • EXPIRED"}
            </p>
          </div>
          {isRecruiter && room.status === "ONGOING" && !room.isExpired && (
            <Button onClick={handleEndInterview} variant="destructive">
              End Interview
            </Button>
          )}
        </div>
      </div>

      {/* Expired/Finished Warning Banner */}
      {room.isExpired && (
        <Alert className="m-4 border-orange-500 bg-orange-50">
          <Lock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            This interview has expired. You can view the conversation history
            but cannot send new messages or questions.
          </AlertDescription>
        </Alert>
      )}

      {room.status === "FINISHED" && !room.isExpired && (
        <Alert className="m-4 border-blue-500 bg-blue-50">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This interview has been completed. You are viewing the conversation
            history in read-only mode.
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
          />
        </div>

        {/* Right Panel - Questions (Only for Recruiter) */}
        {isRecruiter && (
          <div className="w-96 bg-white border-l">
            {room.interviewMode == "ASYNC" ? (
              // <QuestionRecommendedPanel
              //   roomId={room.id}
              //   disabled={isReadOnly}
              // />
              <QuestionPanel
                questions={questions}
                onSendQuestion={handleSendQuestion}
                roomId={room.id}
                disabled={isReadOnly}
              />
            ) : (
              <QuestionPanel
                questions={questions}
                onSendQuestion={handleSendQuestion}
                roomId={room.id}
                disabled={isReadOnly}
              />
            )}
          </div>
        )}
      </div>

      {/* Evaluation Modal */}
      {showEvaluation && (
        <EvaluationModal
          room={room}
          onClose={() => {
            setShowEvaluation(false);
            navigate("/recruiter/interviews");
          }}
        />
      )}
    </div>
  );
};
