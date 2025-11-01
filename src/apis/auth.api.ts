import { axiosClient } from "@/lib/axios";
import type { UserProfile } from "@/types/Auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const signIn = async (signInData: {
  email: string;
  password: string;
}) => {
  const res = await axiosClient.post(`${BASE_URL}/api/auth/login`, signInData);

  return res.data;
};

export const signOut = async () => {
  const res = await axiosClient.post(`${BASE_URL}/api/auth/logout`);

  return res.data;
};

export const sendActivation = async (email: string) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/auth/send-activation?email=${email}`
  );

  return res.data;
};

export const activateAccount = async (email: string) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/auth/send-activation?email=${email}`
  );

  return res.data;
};

export const sendPasswordReset = async (email: string) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/auth/send-password-reset?email=${email}`
  );

  return res.data;
};

export const resetPassword = async (resetPasswordData: {
  email: string;
  token: string;
  newPassword: string;
}) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/auth/reset-password?email=${resetPasswordData.email}&token=${resetPasswordData.token}`,
    { newPassword: resetPasswordData.newPassword }
  );

  return res.data;
};

export const getProfile = async (): Promise<UserProfile> => {
  const res = await axiosClient.get(`${BASE_URL}/api/auth/me`);

  return res.data;
};
