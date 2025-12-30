import { axiosClient, axiosClientFormData } from "@/lib/axios";
import type {
  ApplyJobFormData,
  CreateJobData,
  Job,
  SaveJobData,
  UpdateJobData,
} from "@/types/Job";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllJobs = async (getAllJobQueries: {
  keyword?: string;
  province?: string;
  page?: number;
  size?: number;
  levels?: string[];
  workspaces?: string[];
  types?: string[];
  fields?: string[];
}): Promise<{
  content: Job[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page
}> => {
  // Remove undefined values to prevent sending empty query params
  const cleanParams = Object.fromEntries(
    Object.entries(getAllJobQueries).filter(([_, value]) => value !== undefined && value !== "")
  );

  const res = await axiosClient.get(`${BASE_URL}/api/jobs`, {
    params: cleanParams,
    paramsSerializer: {
      indexes: null, // to produce levels=A&levels=B instead of levels[0]=A
    },
  });

  return res.data;
};

export const getJobById = async (id?: string) => {
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

export const saveJob = async (data: SaveJobData) => {
  const res = await axiosClient.post(`${BASE_URL}/api/job-interactions`, data);

  return res.data;
};

export const getSavedJobsByUserId = async (getSavedJobsParams: {
  userId?: string | undefined;
}) => {
  const res = await axiosClient.get(`${BASE_URL}/api/job-interactions`, {
    params: getSavedJobsParams,
  });

  return res.data.content;
};

export const applyJob = async (data: FormData) => {
  const res = await axiosClientFormData.post(`${BASE_URL}/api/resumes`, data);

  return res.data;
};

export const getAppliedJobsByUserId = async (getAppliedJobsParams: {
  userId?: string | undefined;
}) => {
  const res = await axiosClient.get(`${BASE_URL}/api/resumes`, {
    params: getAppliedJobsParams,
  });

  return res.data;
};
