import { axiosClient, axiosClientFormData } from "@/lib/axios";
import type {
  CreateExperienceFormData,
  UpdateExperienceFormData,
} from "@/types/Experience";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createExperience = async (data: CreateExperienceFormData) => {
  const formatData = {
    ...data,
    userId: data.userId.toString(),
    companyId: data.companyId.toString(),
  };

  const res = await axiosClientFormData.post(
    `${BASE_URL}/api/experiences`,
    formatData
  );

  return res.data;
};

export const updateExperience = async (
  data: UpdateExperienceFormData,
  id: string
) => {
  const res = await axiosClientFormData.put(
    `${BASE_URL}/api/experiences/${id}`,
    data
  );

  return res.data;
};

export const deleteExperience = async (id: string) => {
  const res = await axiosClient.delete(`${BASE_URL}/api/experiences/${id}`);

  return res.data;
};
