/* eslint-disable react-hooks/rules-of-hooks */
import { Check, X } from "lucide-react";
import { useUserById } from "@/hooks/useUser";
import type { Notification } from "@/types/Notification";
import profile from "@/assets/illustration/auth.png";

export const FriendRequestItem = ({
  notification,
}: {
  notification: Notification;
}) => {
  const userId = Number(notification.content);
  if (Number.isNaN(userId)) return null;

  const { data: user, isLoading } = useUserById(userId);

  return (
    <div className="px-4 py-3 border-b bg-blue-50 flex gap-3">
      {isLoading ? (
        <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
      ) : (
        <img
          src={user?.avatar || profile}
          className="w-9 h-9 rounded-full object-cover"
        />
      )}

      <div className="flex-1">
        <div className="text-sm font-semibold">
          {user?.name ?? "Người dùng"}
        </div>

        <div className="text-xs text-gray-500">đã gửi lời mời kết bạn</div>

        <div className="flex gap-2 mt-2">
          <button className="px-2 py-1 bg-green-500 text-white rounded">
            <Check size={14} />
          </button>

          <button className="px-2 py-1 bg-red-500 text-white rounded">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
