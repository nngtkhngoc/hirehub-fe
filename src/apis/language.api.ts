import { axiosClient } from "@/lib/axios";
import type { Language } from "@/types/Language";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllLanguages = async (): Promise<Language[]> => {
  const res = await axiosClient.get(`${BASE_URL}/api/languages`);

  return res.data;
};
