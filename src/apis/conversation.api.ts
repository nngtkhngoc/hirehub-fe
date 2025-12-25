import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export type CreateConversationRequest = {
  type: "DIRECT" | "GROUP";
  name?: string;
  creatorId: number;
  participantIds: number[];
};

export type AddParticipantsRequest = {
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

// Mời user vào group (chỉ leader)
export const inviteToGroup = async (
  conversationId: number,
  userId: number,
  participantIds: number[]
) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/conversations/${conversationId}/participants`,
    { participantIds } as AddParticipantsRequest,
    {
      params: { userId },
    }
  );
  return res.data;
};

// Kick user ra khỏi group (chỉ leader)
export const kickFromGroup = async (
  conversationId: number,
  participantId: number,
  userId: number
) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/conversations/${conversationId}/kick/${participantId}`,
    null,
    {
      params: { userId },
    }
  );
  return res.data;
};

// User tự rời khỏi group
export const leaveGroup = async (conversationId: number, userId: number) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/conversations/${conversationId}/leave`,
    null,
    {
      params: { userId },
    }
  );
  return res.data;
};

// Leader giải tán nhóm
export const disbandGroup = async (conversationId: number, userId: number) => {
  const res = await axiosClient.delete(
    `${BASE_URL}/api/conversations/${conversationId}/disband`,
    {
      params: { userId },
    }
  );
  return res.data;
};

// User xóa (ẩn) cuộc trò chuyện - set deletedAt = now
// Dùng cho cả DIRECT và GROUP conversations
export const deleteConversation = async (conversationId: number, userId: number) => {
  const res = await axiosClient.delete(
    `${BASE_URL}/api/conversations/${conversationId}`,
    {
      params: { userId },
    }
  );
  return res.data;
};
