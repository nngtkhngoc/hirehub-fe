import { axiosClient, axiosClientFormData } from "@/lib/axios";
import type { CreateStudyData } from "@/types/Study";
import type { University } from "@/types/University";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllUniversities = async (): Promise<University[]> => {
  const res = await axiosClient.get(`${BASE_URL}/api/universities`);

  return res.data;
};

export const createStudy = async (data: CreateStudyData) => {
  const formatData = {
    ...data,
    userId: data.userId.toString(),
    universityId: data.universityId.toString(),
  };

  const res = await axiosClient.post(`${BASE_URL}/api/studies`, formatData);

  return res.data;
};

export const deleteStudy = async (id: string) => {
  const res = await axiosClient.delete(`${BASE_URL}/api/studies/${id}`);

  return res.data;
};
