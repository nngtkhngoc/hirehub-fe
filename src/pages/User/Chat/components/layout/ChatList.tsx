import { useChatList } from "@/hooks/useChat";
import { useAuthStore } from "@/stores/useAuthStore";
import { ChatContainer } from "../ui/ChatContainer";
import type { Message } from "@/types/Chat";
import { Search } from "lucide-react";

export const ChatList = () => {
  const { user } = useAuthStore();

  const { data: chats, isLoading } = useChatList(
    user?.id ? parseInt(user.id) : null
  );

  const renderChats = () => {
    return chats?.map((chat: Message) => <ChatContainer message={chat} />);
  };

  return (
    <div className="flex flex-col items-center gap-5 bg-white border border-zinc-300 rounded-xl bg-white h-full">
      <div className="font-bold text-2xl pt-5 px-5 text-left w-full">
        {" "}
        Trò chuyện{" "}
      </div>
      <div className="flex flex-row justify-around items-center bg-white rounded-[30px] w-9/10 h-[50px]  bg-zinc-100">
        <input
          className="text-[12px] lg:text-[14px] text-[#7A7D87] lg:flex lg:flex-row lg:items-center focus:outline-none"
          placeholder="Tìm kiếm tin nhắn với..."
        />
        <Search size={18} className="hover:cursor-pointer" />
      </div>
      <div className=" overflow-y-scroll flex flex-col items-center w-full px-2 h-full">
        {renderChats()}
      </div>
    </div>
  );
};
