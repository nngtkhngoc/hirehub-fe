import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getHistory = async (getHistoryParams: {
  userA: number;
  userB: number;
}) => {
  const res = await axiosClient.get(`${BASE_URL}/api/messages/history`, {
    params: getHistoryParams,
  });
  return res.data;
};

export const getChatList = async (getChatListParams: { userId: number }) => {
  const res = await axiosClient.get(`${BASE_URL}/api/messages/chat-list`, {
    params: getChatListParams,
  });

  return res.data;
};
