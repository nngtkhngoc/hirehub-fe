import { useParams } from "react-router";
import { Chatbox } from "./components/layout/Chatbox";
import { UserDetail } from "./components/layout/UserDetail";
import { UserList } from "./components/layout/UserList";
import { useUserById } from "@/hooks/useUser";

export const ChatboxPage = () => {
  const { id } = useParams();
  const { data: receiver, isLoading } = useUserById(parseInt(id!));

  return (
    <div className="flex flex-row">
      <UserList />
      <Chatbox receiver={receiver} />
      <UserDetail />
    </div>
  );
};
