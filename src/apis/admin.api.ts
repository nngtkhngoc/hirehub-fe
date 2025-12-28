import { axiosClient } from "@/lib/axios";
import type { PaginatedResponse, Report, AdminUser, AdminJob, AdminResume } from "@/types/Admin";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// User Management APIs
export const getAllUsersAdmin = async (params: {
    keyword?: string;
    role?: string;
    status?: string;
    page?: number;
    size?: number;
}): Promise<PaginatedResponse<AdminUser>> => {
    const res = await axiosClient.get(`${BASE_URL}/api/users`, { params });
    return res.data;
};

export const verifyUser = async (userId: number): Promise<AdminUser> => {
    const res = await axiosClient.patch(`${BASE_URL}/api/users/${userId}`, {
        isVerified: true,
    });
    return res.data.data;
};

export const banUser = async (userId: number): Promise<AdminUser> => {
    const res = await axiosClient.patch(`${BASE_URL}/api/users/${userId}`, {
        isBanned: true,
    });
    return res.data.data;
};

export const unbanUser = async (userId: number): Promise<AdminUser> => {
    const res = await axiosClient.patch(`${BASE_URL}/api/users/${userId}`, {
        isBanned: false,
    });
    return res.data.data;
};

// Job Management APIs - Admin endpoint shows all jobs including banned
export const getAllJobsAdmin = async (params: {
    keyword?: string;
    page?: number;
    size?: number;
}): Promise<PaginatedResponse<AdminJob>> => {
    const res = await axiosClient.get(`${BASE_URL}/api/jobs/admin`, { params });
    return res.data;
};

export const banJob = async (jobId: string): Promise<AdminJob> => {
    const res = await axiosClient.put(`${BASE_URL}/api/jobs/${jobId}`, {
        is_banned: true,
    });
    return res.data;
};

export const unbanJob = async (jobId: string): Promise<AdminJob> => {
    const res = await axiosClient.put(`${BASE_URL}/api/jobs/${jobId}`, {
        is_banned: false,
    });
    return res.data;
};

export const deleteJobAdmin = async (jobId: string): Promise<void> => {
    await axiosClient.delete(`${BASE_URL}/api/jobs/${jobId}`);
};

// Report/Violation Management APIs
export const getAllReports = async (params: {
    status?: string;
    resourceName?: string;
    page?: number;
    size?: number;
}): Promise<PaginatedResponse<Report>> => {
    const res = await axiosClient.get(`${BASE_URL}/api/reports`, { params });
    return res.data;
};

export const updateReportStatus = async (
    reportId: number,
    status: "approved" | "rejected"
): Promise<Report> => {
    const res = await axiosClient.put(`${BASE_URL}/api/reports/${reportId}`, {
        status,
    });
    return res.data.data;
};

export const deleteReport = async (reportId: number): Promise<void> => {
    await axiosClient.delete(`${BASE_URL}/api/reports/${reportId}`);
};

// Resume Management APIs
export const getAllResumesAdmin = async (params?: {
    user?: number;
    job?: number;
    recruiter?: number;
}): Promise<AdminResume[]> => {
    const res = await axiosClient.get(`${BASE_URL}/api/resumes`, { params });
    return res.data;
};
