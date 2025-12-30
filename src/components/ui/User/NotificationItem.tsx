import type { Notification } from "@/types/Notification";
import { Check, X, MoreVertical, Eye, EyeOff, Trash2, CheckCheck } from "lucide-react";

import { useUserById } from "@/hooks/useUser";
import { FriendRequestItem } from "./FriendRequestItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationActions } from "@/hooks/useNotification";

interface Props {
  notification: Notification;
  onClick: (n: Notification) => void;
}
export const NotificationItem = ({ notification, onClick }: Props) => {
  const { markAsRead, markAsUnread, deleteNotification } = useNotificationActions();

  if (notification.type === "FRIEND_REQUEST") {
    return <FriendRequestItem notification={notification} />;
  }

  const handleMarkAsRead = () => {
    console.log("handleMarkAsRead clicked", notification.isRead);
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleMarkAsUnread = () => {
    console.log("handleMarkAsUnread clicked", notification.isRead);
    if (notification.isRead) {
      markAsUnread.mutate(notification.id);
    }
  };

  const handleDelete = () => {
    console.log("handleDelete clicked");
    deleteNotification.mutate(notification.id);
  };

  return (
    <div
      className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer flex items-start justify-between gap-3 transition-colors ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div
        onClick={() => onClick(notification)}
        className="flex-1 min-w-0"
      >
        <div className="text-sm font-medium text-gray-900">{notification.title}</div>
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.content}</div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem 
            onSelect={handleMarkAsRead}
            className={notification.isRead ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          >
            <CheckCheck size={16} className="mr-2" />
            Đánh dấu đã đọc
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={handleMarkAsUnread}
            className={!notification.isRead ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          >
            <EyeOff size={16} className="mr-2" />
            Đánh dấu chưa đọc
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete} className="text-red-600 cursor-pointer">
            <Trash2 size={16} className="mr-2" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
