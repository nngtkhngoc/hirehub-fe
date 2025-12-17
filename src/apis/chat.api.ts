import { axiosClient, axiosClientFormData } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getHistory = async (params: {
  conversationId: number;
  userId: number;
  messageTypes?: string[];
}) => {
  const res = await axiosClient.get(`${BASE_URL}/api/messages/history`, {
    params,
  });
  return res.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClientFormData.post(
    `${BASE_URL}/api/messages/upload`,
    formData
  );

  return res.data.url;
};
