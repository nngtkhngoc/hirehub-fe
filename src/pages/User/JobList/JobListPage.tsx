import { Banner } from "@/components/layout/User/Banner";
import { HighlightText } from "@/components/ui/User/HighlightText";
import joblist from "@/assets/illustration/joblist.png";
import { jobs } from "@/mock/job.mock";
import { JobCard } from "@/components/ui/User/JobCard";

export const JobListPage = () => {
  const renderJobs = () => {
    return jobs.map((job) => <JobCard job={job} />);
  };

  return (
    <div>
      <Banner
        title={
          <h2 className="text-left lg:leading-[60px]">
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px] font-title">
              CÁCH
            </span>
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px]">
              {" "}
            </span>
            <HighlightText text="NHANH NHẤT" />
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px]">
              {" "}
            </span>
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px] font-title">
              ĐỂ TÌM VIỆC
            </span>
          </h2>
        }
        description="Hàng ngàn công việc mới được cập nhật mỗi ngày trên HireHub. Chỉ cần đăng nhập, bạn có thể dễ dàng khám phá và nắm bắt cơ hội phù hợp ngay lập tức."
        illustration={joblist}
        type="việc làm"
      />

      <div className="bg-[#F8F9FB] flex flex-col md:grid md:grid-cols-2 gap-20 items-center py-20 md:px-10 md:gap-8 md:gap-x-5 lg:grid-cols-3">
        {renderJobs()}
      </div>
    </div>
  );
};
