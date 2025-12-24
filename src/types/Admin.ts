import type { UserProfile } from "./Auth";

export type Report = {
    id: number;
    resource: ReportResource | null;
    reason: string;
    status: "pending" | "approved" | "rejected";
    reporter: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    };
};

export type ReportResource = {
    id: number;
    name?: string;
    title?: string;
    email?: string;
    avatar?: string | null;
};

export type PaginatedResponse<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
};

export type AdminUser = UserProfile & {
    isVerified: boolean;
    isBanned: boolean;
    createdAt: string;
};

export type AdminJob = {
    id: string;
    title: string;
    description: string;
    level: string;
    isBanned: boolean | null;
    workspace: string;
    postingDate: string;
    recruiter: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    };
    type: string;
    address: string;
};
