import { useParams } from "react-router";
import { Chatbox } from "./components/layout/Chatbox";
import { UserDetail } from "./components/layout/UserDetail";
import { ChatList } from "./components/layout/ChatList";
import { useUserById } from "@/hooks/useUser";
import { ChevronLeft } from "lucide-react";

export const ChatboxPage = () => {
  const { id } = useParams();
  const { data: receiver, isLoading } = useUserById(parseInt(id!));

  return (
    <div className="bg-white w-full h-screen ">
      {" "}
      <div className=" px-4 bg-[#F2F4F7] pb-[50px] h-full  w-full flex items-center justify-center flex-col">
        <div className="w-full flex items-center px-10 justify-left gap-1 text-md  hover:cursor-pointer hover:text-primary transition-all duration-300 hover:font-bold">
          <ChevronLeft />
          Back
        </div>
        <div className="flex flex-row gap-8 py-5 px-8 w-full">
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
