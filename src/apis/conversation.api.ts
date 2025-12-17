import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export type CreateConversationRequest = {
  type: "DIRECT" | "GROUP";
  name?: string;
  creatorId: number;
  participantIds: number[];
};

export const getUserConversations = async (userId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/conversations/user/${userId}`
  );
  return res.data;
};

export const getConversationDetail = async (
  conversationId: number,
  userId: number
) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/conversations/${conversationId}`,
    {
      params: { userId },
    }
  );

  return res.data;
};

export const createConversation = async (
  payload: CreateConversationRequest
) => {
  const res = await axiosClient.post(`${BASE_URL}/api/conversations`, payload);
  return res.data;
};

export const markConversationAsRead = async (
  conversationId: number,
  userId: number
) => {
  const res = await axiosClient.put(
    `${BASE_URL}/api/conversations/${conversationId}/read`,
    null,
    {
      params: { userId },
    }
  );
  return res.data;
};
