import { Chatbox } from "./components/layout/Chatbox";
import { UserDetail } from "./components/layout/UserDetail";
import { UserList } from "./components/layout/UserList";

export const ChatboxPage = () => {
  return (
    <div className="flex flex-row">
      <UserList />
      <Chatbox />
      <UserDetail />
    </div>
  );
};
