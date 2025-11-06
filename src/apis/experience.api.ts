import { axiosClient } from "@/lib/axios";
import type { CreateExperienceFormData } from "@/types/Experience";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createExperience = async (data: CreateExperienceFormData) => {
  const formatData = {
    ...data,
    userId: data.userId.toString(),
    companyId: data.companyId.toString(),
  };

  const res = await axiosClient.post(
    `${BASE_URL}/api/experiences`,
    formatData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};
