import { Building } from "lucide-react";
import { Link } from "react-router";
import type { Recruiter } from "@/types/Recruiter";

export const RecommendedCompanyCard = ({
    company,
}: {
    company: Recruiter | undefined;
}) => {
    return (
        <Link
            to={`/company-details/${company?.id}`}
            className="w-full flex flex-row gap-4 items-center justify-start py-4 border-b border-[#f2f2f2] hover:bg-zinc-50 transition-colors px-2"
        >
            <div className="w-[60px] h-[60px] rounded-lg shadow-sm flex items-center justify-center bg-white shrink-0 border border-zinc-100">
                {company?.logo || company?.avatar ? (
                    <img
                        src={company.logo || company.avatar}
                        alt={company?.name}
                        className="w-full h-full object-contain rounded-lg"
                    />
                ) : (
                    <Building className="text-zinc-400 w-8 h-8" />
                )}
            </div>
            <div className="flex flex-col items-start justify-center gap-1 min-w-0">
                <div className="w-full text-[14px] font-bold text-zinc-800 line-clamp-1">
                    {company?.name}
                </div>
                <div className="text-zinc-500 text-[12px] line-clamp-1">
                    {company?.field || company?.address}
                </div>
                <div className="text-primary text-[11px] font-medium">
                    Xem chi tiết →
                </div>
            </div>
        </Link>
    );
};

export const RecommendedCompanyCardSkeleton = () => {
    return (
        <div className="w-full flex flex-row gap-4 items-center justify-start py-4 border-b border-[#f2f2f2] px-2">
            <div className="w-[60px] h-[60px] rounded-lg bg-zinc-100 animate-pulse shrink-0" />
            <div className="flex flex-col flex-1 gap-2">
                <div className="h-4 w-3/4 bg-zinc-100 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-zinc-100 animate-pulse rounded" />
                <div className="h-3 w-1/4 bg-zinc-50 animate-pulse rounded" />
            </div>
        </div>
    );
};
