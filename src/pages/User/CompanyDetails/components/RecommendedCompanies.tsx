import { RecommendedCompanyCard, RecommendedCompanyCardSkeleton } from "./RecommendedCompanyCard";
import { SideTitle } from "@/pages/User/Profile/components/ui/SideTitle";
import { useRecruiter } from "@/hooks/useUser";
import type { Recruiter } from "@/types/Recruiter";

export const RecommendedCompanies = () => {
    // Fetch recruiters (companies)
    const { data: users, isPending, error } = useRecruiter(undefined, undefined, 0, 8);
    console.log("users", users);

    // Filtr out current page company will be handled at high level or we can just show top 8
    const recruiters = users?.content as Recruiter[] | undefined;

    return (
        <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-8 pt-2 pb-8">
            <div className="flex flex-col w-full">
                <SideTitle text="Công ty đề xuất" />
                {isPending ? (
                    <div className="flex flex-col items-center justify-center w-full">
                        {[...Array(5)].map((_, i) => (
                            <RecommendedCompanyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="h-full w-full flex items-center justify-center text-red-500 pt-10 text-sm">
                        Lỗi khi tải danh sách công ty đề xuất.
                    </div>
                ) : !recruiters || recruiters.length === 0 ? (
                    <div className="italic h-full w-full flex items-center justify-center pt-10 text-zinc-500 text-sm">
                        Không có dữ liệu đề xuất.
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full">
                        {recruiters.map((recruiter) => (
                            <RecommendedCompanyCard key={recruiter.id} company={recruiter} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
