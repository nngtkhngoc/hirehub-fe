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
    createdAt: string | null;
    lastLogin: string | null;
};

export type AdminJob = {
    id: string;
    title: string;
    description: string;
    level: string;
    is_banned: boolean | null;
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

export type AdminResume = {
    id: number;
    link: string;
    status: string;
    coverLetter: string | null;
    createdAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    };
    job: {
        id: number;
        title: string;
        recruiter: {
            id: number;
            name: string;
        };
    };
};
