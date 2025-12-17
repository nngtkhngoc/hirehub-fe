import {
  deleteNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markNotificationAsUnread,
} from "@/apis/notification.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["notifications", page, size],
    queryFn: () => getMyNotifications(page, size),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30_000,
  });
};

export const useNotificationActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    markAsRead: useMutation({
      mutationFn: (id: number) => markNotificationAsRead(id),
      onSuccess: invalidate,
    }),

    markAsUnread: useMutation({
      mutationFn: (id: number) => markNotificationAsUnread(id),
      onSuccess: invalidate,
    }),

    deleteNotification: useMutation({
      mutationFn: (id: number) => deleteNotification(id),
      onSuccess: invalidate,
    }),
  };
};
