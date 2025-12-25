import type { Notification } from "@/types/Notification";
import { Check, X } from "lucide-react";

import { useUserById } from "@/hooks/useUser";
import { FriendRequestItem } from "./FriendRequestItem";

interface Props {
  notification: Notification;
  onClick: (n: Notification) => void;
}
export const NotificationItem = ({ notification, onClick }: Props) => {
  if (notification.type === "FRIEND_REQUEST") {
    return <FriendRequestItem notification={notification} />;
  }

  return (
    <div
      onClick={() => onClick(notification)}
      className="px-4 py-3 border-b hover:bg-gray-100"
    >
      <div className="text-sm">{notification.title}</div>
      <div className="text-xs text-gray-500">{notification.content}</div>
    </div>
  );
};
