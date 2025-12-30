import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Company Domain APIs
export const getAllCompanyDomains = async () => {
  const response = await axiosClient.get(`${BASE_URL}/api/company-domains`);
  return response.data;
};

export const createCompanyDomain = async (domain: string) => {
  const response = await axiosClient.post(`${BASE_URL}/api/company-domains`, {
    domain,
  });
  return response.data;
};

export const updateCompanyDomain = async (id: number, domain: string) => {
  const response = await axiosClient.put(
    `${BASE_URL}/api/company-domains/${id}`,
    { domain }
  );
  return response.data;
};

export const deleteCompanyDomain = async (id: number) => {
  await axiosClient.delete(`${BASE_URL}/api/company-domains/${id}`);
};

// Job Type APIs
export const getAllJobTypes = async () => {
  const response = await axiosClient.get(`${BASE_URL}/api/job-types`);
  return response.data;
};

export const createJobType = async (type: string) => {
  const response = await axiosClient.post(`${BASE_URL}/api/job-types`, {
    type,
  });
  return response.data;
};

export const updateJobType = async (id: number, type: string) => {
  const response = await axiosClient.put(`${BASE_URL}/api/job-types/${id}`, {
    type,
  });
  return response.data;
};

export const deleteJobType = async (id: number) => {
  await axiosClient.delete(`${BASE_URL}/api/job-types/${id}`);
};

// Job Level APIs
export const getAllJobLevels = async () => {
  const response = await axiosClient.get(`${BASE_URL}/api/job-levels`);
  return response.data;
};

export const createJobLevel = async (level: string) => {
  const response = await axiosClient.post(`${BASE_URL}/api/job-levels`, {
    level,
  });
  return response.data;
};

export const updateJobLevel = async (id: number, level: string) => {
  const response = await axiosClient.put(`${BASE_URL}/api/job-levels/${id}`, {
    level,
  });
  return response.data;
};

export const deleteJobLevel = async (id: number) => {
  await axiosClient.delete(`${BASE_URL}/api/job-levels/${id}`);
};

// Work Type APIs
export const getAllWorkTypes = async () => {
  const response = await axiosClient.get(`${BASE_URL}/api/work-types`);
  return response.data;
};

export const createWorkType = async (workspace: string) => {
  const response = await axiosClient.post(`${BASE_URL}/api/work-types`, {
    workspace,
  });
  return response.data;
};

export const updateWorkType = async (id: number, workspace: string) => {
  const response = await axiosClient.put(`${BASE_URL}/api/work-types/${id}`, {
    workspace,
  });
  return response.data;
};

export const deleteWorkType = async (id: number) => {
  await axiosClient.delete(`${BASE_URL}/api/work-types/${id}`);
};
