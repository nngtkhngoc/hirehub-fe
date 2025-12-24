import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatList } from "@/hooks/useChat";

export const ChatRedirectPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const userId = user?.id ? parseInt(user.id) : null;

  const {
    data: conversations,
    isLoading,
  } = useChatList(userId ? userId : null);

  useEffect(() => {
    if (!userId) {
      navigate("/auth", { replace: true });
      return;
    }

    if (isLoading) return;

    if (conversations && conversations.length > 0) {
      const withMessages = conversations.filter(
        (c: any) => c.lastMessage != null
      );
      const target = withMessages[0] ?? conversations[0];
      if (target) {
        navigate(`/chat/conversation/${target.id}`, { replace: true });
      }
    }
  }, [userId, isLoading, conversations, navigate]);

  if (!userId) {
    return (
      <div className="w-full h-[calc(100vh-75px)] flex items-center justify-center bg-[#F8F9FB]">
        <p className="text-zinc-500 text-sm">
          Vui lòng đăng nhập để sử dụng tính năng nhắn tin.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-75px)] flex items-center justify-center bg-[#F8F9FB]">
      <p className="text-zinc-500 text-sm">Đang chuyển tới cuộc trò chuyện...</p>
    </div>
  );
};


