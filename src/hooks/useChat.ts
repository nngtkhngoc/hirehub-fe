import { getHistory } from "@/apis/chat.api";
import { getUserConversations } from "@/apis/conversation.api";
import { useQuery } from "@tanstack/react-query";

export const useChat = (
  conversationId: number,
  userId: number,
  messageTypes?: string[]
) => {
  return useQuery({
    queryKey: ["chat", conversationId, userId, messageTypes],
    queryFn: () => getHistory({ conversationId, userId, messageTypes }),
  });
};

export const useChatList = (userId: number | null) => {
  return useQuery({
    queryKey: ["chat-list", userId],
    queryFn: () =>
      userId ? getUserConversations(userId) : Promise.resolve([]),
  });
};
