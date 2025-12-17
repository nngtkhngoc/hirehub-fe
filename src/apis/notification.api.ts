import { axiosClient } from "@/lib/axios";
import type { PageResponse } from "@/types/Page";
import type { Notification, CreateNotificationDTO } from "@/types/Notification";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const NOTIFICATION_URL = `${BASE_URL}/api/notifications`;

export const getMyNotifications = async (
  page = 0,
  size = 10
): Promise<PageResponse<Notification>> => {
  const res = await axiosClient.get(NOTIFICATION_URL, {
    params: { page, size },
  });

  return res.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const res = await axiosClient.get(`${NOTIFICATION_URL}/unread-count`);
  return res.data;
};

export const markNotificationAsRead = async (id: number) => {
  await axiosClient.put(`${NOTIFICATION_URL}/${id}/read`);
};

export const markNotificationAsUnread = async (id: number) => {
  await axiosClient.put(`${NOTIFICATION_URL}/${id}/unread`);
};

export const deleteNotification = async (id: number) => {
  await axiosClient.delete(`${NOTIFICATION_URL}/${id}`);
};

export const createNotification = async (data: CreateNotificationDTO) => {
  await axiosClient.post(NOTIFICATION_URL, data);
};
