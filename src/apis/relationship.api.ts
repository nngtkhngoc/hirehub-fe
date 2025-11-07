import { axiosClient } from "@/lib/axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const connect = async (data: {
  senderId: number;
  receiverId: number;
}) => {
  const res = await axiosClient.post(`${BASE_URL}/api/relationships`, data);
  return res.data.data;
};
export const updateRelationshipStatus = async (data: {
  id: {
    receiverId: number;
    senderId: number;
  };
  status: "connected" | "rejected";
}) => {
  const res = await axiosClient.put(
    `${BASE_URL}/api/relationships/${data.id.senderId}/${data.id.receiverId}`,
    {
      status: data.status,
    }
  );
  return res.data.data;
};
export const disconnect = async ({
  receiverId,
  senderId,
}: {
  receiverId: number;
  senderId: number;
}) => {
  const res = await axiosClient.delete(
    `${BASE_URL}/api/relationships/${senderId}/${receiverId}`
  );
  return res.data.data;
};
export const getFriends = async (userId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/relationships/friends?userId=${userId}`
  );
  return res.data.data;
};

export const getRelationshipsByUserId = async (userId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/relationships/user/${userId}`
  );
  return res.data.data;
};
