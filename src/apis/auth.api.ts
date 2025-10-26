import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const signIn = async (signInData: {
  email: string;
  password: string;
}) => {
  const res = await axiosClient.post(`${BASE_URL}/api/auth/login`, signInData);

  return res.data;
};

export const sendPasswordReset = async (email: string) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/auth/send-password-reset?email=${email}`
  );

  return res.data;
};
