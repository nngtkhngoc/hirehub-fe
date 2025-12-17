import profile from "@/assets/illustration/profile.png";
import type { Conversation } from "@/types/Chat";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useParams } from "react-router";
import { Users } from "lucide-react";
import { useMemo } from "react";

export const ChatContainer = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { user } = useAuthStore();
  const { conversationId } = useParams();

  // For DIRECT conversation, find the other user
  const otherUser = useMemo(() => {
    if (conversation.type === "DIRECT") {
      return conversation.participants.find((p) => p.id !== user?.id);
    }
    return null;
  }, [conversation, user?.id]);

  // Get display name and avatar
  const displayName = useMemo(() => {
    if (conversation.type === "GROUP") {
      return conversation.name || "Nhóm chat";
    }
    return otherUser?.name || "Người dùng";
  }, [conversation, otherUser]);

  const displayAvatar = useMemo(() => {
    if (conversation.type === "GROUP") {
      // For group, show first participant's avatar or default
      const firstParticipant = conversation.participants.find(
        (p) => p.id !== user?.id
      );
      return firstParticipant?.avatar || profile;
    }
    return otherUser?.avatar || profile;
  }, [conversation, otherUser, user?.id]);

  const isActive = conversationId === conversation.id.toString();

  const getPreviewMessage = () => {
    if (!conversation.lastMessage) return "Chưa có tin nhắn";

    const lastMsg = conversation.lastMessage;
    const isMine = lastMsg.sender?.id === user?.id;

    switch (lastMsg.type) {
      case "image":
        return isMine
          ? "Bạn đã gửi một ảnh"
          : `${lastMsg.sender?.name || "Ai đó"} đã gửi một ảnh`;
      case "file":
        return isMine
          ? "Bạn đã gửi một file"
          : `${lastMsg.sender?.name || "Ai đó"} đã gửi một file`;
      default:
        return lastMsg.content || "";
    }
  };

  return (
    <Link
      to={`/chat/conversation/${conversation.id}`}
      className={`w-full hover:bg-zinc-100 py-2 rounded-xl cursor-pointer relative ${
        isActive && "bg-zinc-100"
      }`}
    >
      <div className="flex flex-row gap-3 px-3 overflow-hidden">
        <div className="relative">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-[40px] h-[40px] rounded-full object-center object-cover"
          />
          {conversation.type === "GROUP" && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
          <div className="font-medium text-sm text-ellipsis truncate">
            {displayName}
          </div>
          <div className="text-xs text-zinc-500 truncate">
            {getPreviewMessage()}
          </div>
        </div>
      </div>

      {/* {conversation.type !== "DIRECT" &&
        conversation.unreadCount &&
        conversation.unreadCount > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </div>
          </div>
        )} */}
    </Link>
  );
};
