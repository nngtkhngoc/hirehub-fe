import { useParams } from "react-router";
import { Chatbox } from "./components/layout/Chatbox";
import { UserDetail } from "./components/layout/UserDetail";
import { ChatList } from "./components/layout/ChatList";
import { useUserById } from "@/hooks/useUser";

export const ChatboxPage = () => {
  const { id } = useParams();
  const { data: receiver, isLoading } = useUserById(parseInt(id!));

  return (
    <div className="bg-white">
      <div className=" px-4 mt-[75px]  bg-[#F2F4F7] pb-[50px]   h-screen">
        <div className="flex flex-row gap-8 py-5 px-8">
          <div className="w-1/4">
            <ChatList />
          </div>
          <div className="w-1/2">
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
