import { axiosClient } from "@/lib/axios";
import type { PageResponse } from "@/types/Page";
import type { Notification, CreateNotificationDTO } from "@/types/Notification";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const NOTIFICATION_URL = `${BASE_URL}/api/notifications`;

export const getMyNotifications = async (
  page = 0,
  size = 10,
  userId: number | undefined
): Promise<PageResponse<Notification>> => {
  const res = await axiosClient.get(NOTIFICATION_URL, {
    params: { page, size, userId },
  });

  return res.data;
};

export const getUnreadNotificationCount = async (userId: number | undefined): Promise<number> => {
  const res = await axiosClient.get(`${NOTIFICATION_URL}/unread-count`, {
    params: { userId },
  });
  return res.data;
};

export const markNotificationAsRead = async (id: number, userId: number) => {
  await axiosClient.put(`${NOTIFICATION_URL}/${id}/read`, null, {
    params: { userId },
  });
};

export const markNotificationAsUnread = async (id: number, userId: number) => {
  await axiosClient.put(`${NOTIFICATION_URL}/${id}/unread`, null, {
    params: { userId },
  });
};

export const deleteNotification = async (id: number, userId: number) => {
  await axiosClient.delete(`${NOTIFICATION_URL}/${id}`, {
    params: { userId },
  });
};

export const markAllNotificationsAsRead = async (userId: number) => {
  await axiosClient.put(`${NOTIFICATION_URL}/mark-all-read`, null, {
    params: { userId },
  });
};

export const createNotification = async (data: CreateNotificationDTO) => {
  await axiosClient.post(NOTIFICATION_URL, data);
};
