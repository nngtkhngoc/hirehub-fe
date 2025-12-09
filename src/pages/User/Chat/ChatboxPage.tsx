import { useParams } from "react-router";
import { Chatbox } from "./components/layout/Chatbox";
import { UserDetail } from "./components/layout/UserDetail";
import { ChatList } from "./components/layout/ChatList";
import { useUserById } from "@/hooks/useUser";
import { Header } from "@/components/layout/User/Header";

export const ChatboxPage = () => {
  const { id } = useParams();
  const { data: receiver, isLoading } = useUserById(parseInt(id!));

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
            <Chatbox receiver={receiver} />
          </div>
          <div className="w-1/4">
            <UserDetail receiver={receiver} />
          </div>
        </div>
      </div>
    </div>
  );
};
