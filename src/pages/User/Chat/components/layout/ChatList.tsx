import { useChatList } from "@/hooks/useChat";
import { useAuthStore } from "@/stores/useAuthStore";
import { ChatContainer } from "../ui/ChatContainer";
import type { Conversation } from "@/types/Chat";
import { Search, MessageSquare } from "lucide-react";
import { CreateGroupDialog } from "./CreateGroupDialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const ChatList = () => {
  const { user } = useAuthStore();

  const { data: conversations, isLoading } = useChatList(
    user?.id ? parseInt(user.id) : null
  );

  const renderConversations = () => {
    if (isLoading) {
      return (
        <div className="text-center text-sm text-zinc-500 py-4">
          Đang tải...
        </div>
      );
    }

    if (!conversations || conversations.length === 0) {
      return (
        <Empty className="border-none">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <MessageSquare className="text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-base">Chưa có cuộc trò chuyện</EmptyTitle>
            <EmptyDescription className="text-xs">
              Bạn chưa có cuộc trò chuyện nào. Hãy tạo nhóm hoặc bắt đầu trò chuyện mới!
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      );
    }

    // Chỉ hiển thị những conversation đã có tin nhắn (lastMessage khác null)
    // Và không bị ẩn (lastMessage.createdAt sau deletedAt)
    const visibleConversations = conversations.filter((c: Conversation) => {
      if (!c.lastMessage) return false;
      if (!c.deletedAt) return true;
      return new Date(c.lastMessage.createdAt) > new Date(c.deletedAt);
    });

    if (visibleConversations.length === 0) {
      return (
        <Empty className="border-none">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <MessageSquare className="text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-base">Chưa có cuộc trò chuyện</EmptyTitle>
            <EmptyDescription className="text-xs">
              Bạn chưa có cuộc trò chuyện nào. Hãy tạo nhóm hoặc bắt đầu trò chuyện mới!
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      );
    }

    return visibleConversations.map((conversation: Conversation) => (
      <ChatContainer key={conversation.id} conversation={conversation} />
    ));
  };

  return (
    <div className="flex flex-col items-center gap-5 bg-white border border-zinc-300 rounded-xl h-full">
      <div className="font-bold text-2xl pt-5 px-5 text-left w-full flex items-center justify-between">
        <span>Trò chuyện</span>
      </div>
      <div className="w-full px-5">
        <CreateGroupDialog />
      </div>
      <div className="flex flex-row justify-around items-center rounded-[30px] w-9/10 h-[50px] bg-zinc-100">
        <input
          className="text-[12px] lg:text-[14px] text-[#7A7D87] lg:flex lg:flex-row lg:items-center focus:outline-none bg-transparent flex-1 px-3"
          placeholder="Tìm kiếm tin nhắn..."
        />
        <Search size={18} className="hover:cursor-pointer mr-3" />
      </div>
      <div className="overflow-y-scroll flex flex-col items-center w-full px-2 h-full">
        {renderConversations()}
      </div>
    </div>
  );
};
