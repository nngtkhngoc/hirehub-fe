import { axiosClient } from "@/lib/axios";
import type { CreateJobData, UpdateJobData } from "@/types/Job";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllJobs = async (getAllJobQueries: { keyword: string }) => {
  const res = await axiosClient.get(`${BASE_URL}/api/jobs`, {
    params: getAllJobQueries,
  });

  return res.data;
};

export const getJobById = async (id: string) => {
  const res = await axiosClient.get(`${BASE_URL}/api/jobs/${id}`);

  return res.data;
};

export const createJob = async (data: CreateJobData) => {
  const res = await axiosClient.post(`${BASE_URL}/api/jobs`, data);

  return res.data;
};

export const updateJob = async (data: UpdateJobData, id: string) => {
  const res = await axiosClient.put(`${BASE_URL}/api/jobs/${id}`, data);

  return res.data;
};

export const deleteJob = async (id: string) => {
  const res = await axiosClient.delete(`${BASE_URL}/api/jobs/${id}`);

  return res.data;
};
