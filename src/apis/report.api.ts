import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface CreateReportRequest {
    resourceId: number;
    resourceName: string;
    reason: string;
    reporterId: number;
}

export const createReport = async (data: CreateReportRequest) => {
    const res = await axiosClient.post(`${BASE_URL}/api/reports`, data);
    return res.data;
};
