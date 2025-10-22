import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "@/apis/job.api";
import type { Job } from "@/types/Job";

export default function useJob(query?: string) {
  const getAllJobsQuery = useQuery<Job[]>({
    queryKey: ["jobs", query],
    queryFn: () => getAllJobs(),
  });

  return getAllJobsQuery;
}
