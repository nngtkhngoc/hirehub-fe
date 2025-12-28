import { axiosClient } from "@/lib/axios";
import type { UserProfile } from "@/types/Auth";
import { createFcmToken } from "./fcmToken.api";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const signIn = async (signInData: {
  email: string;
  password: string;
}) => {
  const res = await axiosClient.post(`${BASE_URL}/api/auth/login`, signInData);

  console.log(res);

  // if (res.status === 200 && res.data?.data?.id) {
  //   // const userId = res.data.data.id;
  //   // await createFcmToken(userId);
  // }

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

export const activateAccount = async (data: { email: string; token: string }) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/auth/activate?email=${data.email}&token=${data.token}`
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
  return res.data.data;
};

export const signUpCandidate = async (signUpCandidateData: {
  email: string;
  name?: string;
  password: string;
  roleId?: number;
}) => {
  const res = await axiosClient.post(`${BASE_URL}/api/auth/sign-up`, {
    ...signUpCandidateData,
  });

  return res.data;
};

export const signUpRecruiter = async (signUpCandidateData: {
  email: string;
  name?: string;
  password: string;
  roleId?: number;
  foundedYear: number | undefined;
  numberOfEmployees: string | undefined;
}) => {
  const res = await axiosClient.post(`${BASE_URL}/api/auth/sign-up`, {
    ...signUpCandidateData,
  });

  return res.data;
};
