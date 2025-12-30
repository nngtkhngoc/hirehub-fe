import { SideTitle } from "@/pages/User/Profile/components/ui/SideTitle";
import { RecommendedJobCard } from "@/pages/User/Profile/components/ui/RecommendedJobCard";
import { useJobs } from "@/hooks/useJob";
import { RecommendedJobCardSkeleton } from "@/pages/User/Profile/components/ui/RecommenedJobCardSkeleton";
export const RecommendedJobs = () => {
  const { data: jobs, isPending, error } = useJobs("", "", 0, 6);

  const renderCompanies = () =>
    jobs?.content?.map((job) => <RecommendedJobCard job={job} />);

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 pt-2 pb-8">
      <div className="flex flex-col w-full">
        <SideTitle text="Có thể bạn sẽ biết" />
        {isPending ? (
          <div className="flex flex-col items-center justify-center w-full">
            {[...Array(6)].map((_, i) => (
              <RecommendedJobCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className=" h-full w-full flex items-center justify-center text-red-500 pt-20">
            Lỗi khi tải danh sách công việc.
          </div>
        ) : !jobs || jobs.content.length === 0 ? (
          <div className="italic h-full w-full flex items-center justify-center pt-20">
            Không có dữ liệu để hiển thị.
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            {renderCompanies()}
          </div>
        )}
      </div>
    </div>
  );
};
