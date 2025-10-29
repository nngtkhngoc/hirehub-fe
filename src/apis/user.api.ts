import { axiosClient } from "@/lib/axios";
import type { Recruiter } from "@/types/Recruiter";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllRecruiters = async (
  getAllJobQueries: {
    keyword?: string;
    province?: string;
    role?: string;
    page?: number;
    size?: number;
  } = { role: "recruiter" }
): Promise<Recruiter[]> => {
  const res = await axiosClient.get(`${BASE_URL}/api/users`, {
    params: getAllJobQueries,
  });

  return res.data.content;
};
