import { axiosClient } from "@/lib/axios";
import type { Skill } from "@/types/Skill";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllSkills = async (): Promise<Skill[]> => {
  const res = await axiosClient.get(`${BASE_URL}/api/skills`);

  return res.data;
};
