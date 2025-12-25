import {
  deleteNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markNotificationAsUnread,
} from "@/apis/notification.api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications = (page = 0, size = 10) => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["notifications", page, size, user?.id],
    queryFn: () => getMyNotifications(page, size, user?.id ? Number(user.id) : undefined),
    enabled: !!user?.id,
    refetchInterval: 30_000,
  });
};

export const useUnreadNotificationCount = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["notifications", "unread-count", user?.id],
    queryFn: () => getUnreadNotificationCount(user?.id ? Number(user.id) : undefined),
    refetchInterval: 1_000,
    enabled: !!user?.id,
  });
};

export const useNotificationActions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    markAsRead: useMutation({
      mutationFn: (id: number) => markNotificationAsRead(id, Number(user?.id)),
      onSuccess: invalidate,
    }),

    markAsUnread: useMutation({
      mutationFn: (id: number) => markNotificationAsUnread(id, Number(user?.id)),
      onSuccess: invalidate,
    }),

    deleteNotification: useMutation({
      mutationFn: (id: number) => deleteNotification(id, Number(user?.id)),
      onSuccess: invalidate,
    }),
  };
};
