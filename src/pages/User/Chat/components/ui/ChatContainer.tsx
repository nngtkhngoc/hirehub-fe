import profile from "@/assets/illustration/profile.png";
import type { Message } from "@/types/Chat";
import { useAuthStore } from "@/stores/useAuthStore";

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
  return (
    <div className="w-full ">
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
    </div>
  );
};
