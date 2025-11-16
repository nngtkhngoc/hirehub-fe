import { getChatList, getHistory } from "@/apis/chat.api";
import { useQuery } from "@tanstack/react-query";

export const useChat = (userA: number, userB: number) => {
  return useQuery({
    queryKey: ["chat", userA, userB],
    queryFn: () => getHistory({ userA, userB }),
  });
};

export const useChatList = (userId: number) => {
  return useQuery({
    queryKey: ["chat-list", userId],
    queryFn: () => getChatList({ userId: userId }),
  });
};
