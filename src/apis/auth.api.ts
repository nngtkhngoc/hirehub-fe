import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const signIn = async (signInData: {
  email: string;
  password: string;
}) => {
  const res = await axiosClient.post(`${BASE_URL}/api/auth/login`, signInData, {
    withCredentials: true,
  });

  return res.data;
};
