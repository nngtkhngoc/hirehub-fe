import { axiosClient } from "@/lib/axios";
import type { Job } from "@/types/Job";

const getAllJobs = async (): Promise<Job[]> => {
  try {
    const res = await axiosClient.get("/jobs");
    console.log(res);
    return res?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
};

export { getAllJobs };
