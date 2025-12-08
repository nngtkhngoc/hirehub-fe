import { axiosClient, axiosClientFormData } from "@/lib/axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const findJobs = async (query: string) => {
  const res = await axiosClient.post(`${BASE_URL}/api/chatbot/jobs`, {
    message: query,
  });
  return res.data.data;
};

export const analyzeResume = async (data: any) => {
  const res = await axiosClientFormData.post(
    `${BASE_URL}/api/chatbot/resumes`,
    data
  );
  return res.data.data;
};
