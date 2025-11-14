import { useParams } from "react-router";
import { Chatbox } from "./components/layout/Chatbox";
import { UserDetail } from "./components/layout/UserDetail";
import { UserList } from "./components/layout/UserList";
import { useUserById } from "@/hooks/useUser";

export const ChatboxPage = () => {
  const { id } = useParams();
  const { data: receiver, isLoading } = useUserById(parseInt(id!));

  return (
    <div className="flex flex-row  px-4 pt-[100px] bg-white  pb-[50px] ">
      <div className="w-1/4">
        <UserList />
      </div>
      <div className="w-1/2">
        <Chatbox receiver={receiver} />
      </div>
      <div className="w-1/4">
        <UserDetail />
      </div>
    </div>
  );
};
