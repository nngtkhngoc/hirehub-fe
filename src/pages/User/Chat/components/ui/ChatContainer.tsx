import profile from "@/assets/illustration/profile.png";
import type { Message } from "@/types/Chat";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useParams } from "react-router";
import { Dot } from "lucide-react";
import { useMemo } from "react";

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
  const isSeen = useMemo(() => {
    if (message?.seenUsers && message?.sender?.id == user?.id) {
      return message?.seenUsers.some((u) => u?.id == otherUser?.id);
    }

    return false;
  }, [message?.seenUsers, message?.sender?.id, otherUser?.id, user?.id]);

  return (
    <Link
      to={`/chat/${otherUser?.id}`}
      className={`w-full hover:bg-zinc-100 py-2 rounded-xl cursor-pointer relative ${
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
          <div
            className={`text-xs text-ellipsis ${
              !isSeen ? "font-medium" : "font-light"
            }`}
          >
            {message?.message}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-2">
        {!isSeen && <Dot className="text-primary" size={50} />}
      </div>
    </Link>
  );
};
