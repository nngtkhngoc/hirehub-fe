import profile from "@/assets/illustration/profile.png";
import type { Message } from "@/types/Chat";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useParams } from "react-router";

export const ChatContainer = ({
  message,
}: {
  message: Message | undefined;
}) => {
  const { user } = useAuthStore();
  const otherUser =
    user?.email == message?.receiver?.email
      ? message?.sender
      : message?.receiver;

  const { id } = useParams();

  return (
    <Link
      to={`/chat/${otherUser?.id}`}
      className={`w-full hover:bg-zinc-100 py-2 rounded-xl cursor-pointer ${
        id == otherUser?.id && "bg-zinc-100"
      }`}
    >
      <div className="flex flex-row gap-3 px-3 overflow-hidden">
        <img
          src={otherUser?.avatar || profile}
          alt="profile"
          className="w-[40px] h-[40px] rounded-full object-center object-cover"
        />
        <div className="flex flex-col justify-center gap-1 ">
          <div className="font-medium text-sm  text-ellipsis">
            {otherUser?.name}
          </div>
          <div className="font-normal text-sm text-ellipsis">
            {message?.message}
          </div>
        </div>
      </div>
    </Link>
  );
};
