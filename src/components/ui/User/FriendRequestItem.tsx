import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserById } from "@/hooks/useUser";
import { updateRelationshipStatus, disconnect } from "@/apis/relationship.api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationActions } from "@/hooks/useNotification";
import type { Notification } from "@/types/Notification";
import profile from "@/assets/illustration/auth.png";

export const FriendRequestItem = ({
  notification,
}: {
  notification: Notification;
}) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [isHandled, setIsHandled] = useState(false);
  const [handledAction, setHandledAction] = useState<"accepted" | "declined" | null>(null);
  const { deleteNotification } = useNotificationActions();

  // The sender's user ID is stored in notification.content
  const senderId = Number(notification.content);
  if (Number.isNaN(senderId)) return null;

  const { data: senderUser, isLoading } = useUserById(senderId);

  // Accept friend request mutation
  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.id) throw new Error("User not logged in");
      return await updateRelationshipStatus({
        id: {
          senderId: senderId,
          receiverId: Number(currentUser.id),
        },
        status: "connected",
      });
    },
    onSuccess: () => {
      toast.success(`Đã chấp nhận lời mời kết bạn từ ${senderUser?.name || "người dùng"}`);
      setIsHandled(true);
      setHandledAction("accepted");
      // Delete the notification after accepting
      deleteNotification.mutate(notification.id);
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: () => {
      toast.error("Không thể chấp nhận lời mời kết bạn");
    },
  });

  // Decline/delete friend request mutation
  const declineMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.id) throw new Error("User not logged in");
      return await disconnect({
        senderId: senderId,
        receiverId: Number(currentUser.id),
      });
    },
    onSuccess: () => {
      toast.success("Đã từ chối lời mời kết bạn");
      setIsHandled(true);
      setHandledAction("declined");
      // Delete the notification after declining
      deleteNotification.mutate(notification.id);
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
    },
    onError: () => {
      toast.error("Không thể từ chối lời mời kết bạn");
    },
  });

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    acceptMutation.mutate();
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    declineMutation.mutate();
  };

  const isPending = acceptMutation.isPending || declineMutation.isPending;

  // Calculate time ago
  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return `${diffWeeks} tuần trước`;
  };

  return (
    <div className={`px-4 py-3 border-b flex gap-3 transition-colors ${notification.isRead ? "bg-white" : "bg-blue-50"
      } hover:bg-gray-100`}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {isLoading ? (
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        ) : (
          <img
            src={senderUser?.avatar || profile}
            alt={senderUser?.name || "User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          />
        )}
        {/* Friend request icon badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm">
          <span className="font-semibold text-gray-900">
            {senderUser?.name ?? "Người dùng"}
          </span>{" "}
          <span className="text-gray-600">đã gửi cho bạn lời mời kết bạn.</span>
        </div>

        <div className="text-xs text-blue-500 mt-0.5">
          {getTimeAgo(notification.createdAt)}
        </div>

        {/* Action buttons */}
        {!isHandled ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAccept}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {acceptMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Xác nhận
            </button>

            <button
              onClick={handleDecline}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {declineMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <X size={14} />
              )}
              Xóa
            </button>
          </div>
        ) : (
          <div className={`mt-2 text-sm font-medium ${handledAction === "accepted" ? "text-green-600" : "text-gray-500"
            }`}>
            {handledAction === "accepted"
              ? "✓ Đã chấp nhận lời mời kết bạn"
              : "Đã xóa lời mời kết bạn"}
          </div>
        )}
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="flex-shrink-0 self-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
        </div>
      )}
    </div>
  );
};
