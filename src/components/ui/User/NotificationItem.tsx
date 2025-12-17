import type { Notification } from "@/types/Notification";

interface Props {
  notification: Notification;
  onClick: (n: Notification) => void;
}

export const NotificationItem = ({ notification, onClick }: Props) => {
  return (
    <div
      onClick={() => onClick(notification)}
      className={`px-4 py-3 border-b cursor-pointer transition
        ${
          notification?.isRead
            ? "bg-white text-gray-600"
            : "bg-blue-50 font-semibold"
        }
        hover:bg-gray-100`}
    >
      <div className="text-sm">{notification?.title}</div>
      <div className="text-xs mt-1 text-gray-500">{notification?.content}</div>
    </div>
  );
};
