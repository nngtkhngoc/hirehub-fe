import { Banner } from "@/components/layout/User/Banner";
import { HighlightText } from "@/components/ui/User/HighlightText";
import joblist from "@/assets/illustration/joblist.png";

export const JobListPage = () => {
  return (
    <div>
      <Banner
        title={
          <h2 className="text-left lg:leading-[60px]">
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px] font-title">
              CÁCH
            </span>
            <span> </span>
            <HighlightText text="NHANH NHẤT" />
            <span> </span>
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px] font-title">
              ĐỂ TÌM VIỆC
            </span>
          </h2>
        }
        description="Hàng ngàn công việc mới được cập nhật mỗi ngày trên HireHub. Chỉ cần đăng nhập, bạn có thể dễ dàng khám phá và nắm bắt cơ hội phù hợp ngay lập tức."
        illustration={joblist}
      />
    </div>
  );
};
