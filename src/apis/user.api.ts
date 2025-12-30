/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient, axiosClientFormData } from "@/lib/axios";
import type { UserProfile } from "@/types/Auth";
import type { Recruiter } from "@/types/Recruiter";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllRecruiters = async (
  getAllJobQueries: {
    keyword?: string;
    province?: string;
    role?: string;
    page?: number;
    size?: number;
  } = {}
): Promise<any> => {
  const finalParams = {
    role: "recruiter",
    ...getAllJobQueries,
  };

  // Remove undefined values to prevent sending empty query params
  const cleanParams = Object.fromEntries(
    Object.entries(finalParams).filter(([_, value]) => value !== undefined)
  );

  const res = await axiosClient.get(`${BASE_URL}/api/users`, {
    params: cleanParams,
  });

  return res.data;
};

export const getAllUsers = async (
  getAllJobQueries: {
    keyword?: string;
    province?: string;
    role?: string;
    page?: number;
    size?: number;
  } = {}
): Promise<any> => {
  const finalParams = {
    role: "user",
    ...getAllJobQueries,
  };

  // Remove undefined values to prevent sending empty query params
  const cleanParams = Object.fromEntries(
    Object.entries(finalParams).filter(([_, value]) => value !== undefined)
  );

  const res = await axiosClient.get(`${BASE_URL}/api/users`, {
    params: cleanParams,
  });

  return res.data;
};

export const updateUser = async (data: FormData): Promise<UserProfile> => {
  const id = data.get("id");
  if (!id) throw new Error("Missing user id!");

  const res = await axiosClientFormData.put(
    `${BASE_URL}/api/users/${id}`,
    data
  );

  return res.data.data;
};

export const getUserById = async (userId: number): Promise<UserProfile> => {
  const res = await axiosClient.get(`${BASE_URL}/api/users/${userId}`);
  console.log(res.data, "!");
  return res.data;
};
