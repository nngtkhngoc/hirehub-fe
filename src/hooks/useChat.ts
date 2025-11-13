import { getHistory } from "@/apis/chat.api";
import { useQuery } from "@tanstack/react-query";

export const useChat = (userA: number, userB: number) => {
  return useQuery({
    queryKey: ["chat", userA, userB],
    queryFn: () => getHistory({ userA, userB }),
  });
};
