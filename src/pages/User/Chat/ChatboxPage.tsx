import { useParams } from "react-router";
import { Chatbox } from "./components/layout/Chatbox";
import { UserDetail } from "./components/layout/UserDetail";
import { ChatList } from "./components/layout/ChatList";
import { Header } from "@/components/layout/User/Header";
import { useState } from "react";
import MediaDetail from "./components/layout/MediaDetail";
import { useQuery } from "@tanstack/react-query";
import { getConversationDetail } from "@/apis/conversation.api";
import { useAuthStore } from "@/stores/useAuthStore";

export const ChatboxPage = () => {
  const { conversationId } = useParams();
  const { user } = useAuthStore();
  const userId = user?.id ? parseInt(user.id) : 0;

  const { data: conversation, isLoading } = useQuery({
    queryKey: ["conversation", conversationId, userId],
    queryFn: () =>
      conversationId && userId
        ? getConversationDetail(parseInt(conversationId), userId)
        : null,
    enabled: !!conversationId && !!userId,
  });

  const [view, setView] = useState<"default" | "image" | "file">("default");

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <div>
        <Header />
      </div>
      <div className="px-4  bg-[#F2F4F7]  w-full flex-1 flex items-center justify-center flex-col h-75">
        <div className="flex flex-row gap-8 py-5 px-8 w-full h-full">
          <div className="w-1/4">
            <ChatList />
          </div>
          <div className="w-1/2 h-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center border border-zinc-300 rounded-xl bg-white">
                <p className="text-zinc-500">Đang tải...</p>
              </div>
            ) : (
              <Chatbox conversation={conversation} />
            )}
          </div>
          {view === "default" && conversation && (
            <div className="w-1/4">
              <UserDetail conversation={conversation} setView={setView} />
            </div>
          )}
          {view !== "default" && (
            <div className="w-1/4">
              <MediaDetail view={view} setView={setView} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
