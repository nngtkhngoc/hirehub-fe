import { axiosClient } from "@/lib/axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const findJobs = async (query: string) => {
  const res = await axiosClient.post(`${BASE_URL}/api/chatbot/jobs`, {
    message: query,
  });
  return res.data.data;
};
