import { Banner } from "@/components/layout/User/Banner";
import { HighlightText } from "@/components/ui/User/HighlightText";
import userList from "@/assets/illustration/userlist.png";

export const UserListPage = () => {
  return (
    <div>
      <Banner
        title={
          <h2 className="text-left lg:leading-[60px]">
            <HighlightText text="KẾT NỐI" />
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px] font-title">
              , CHIA SẺ & CÙNG NHAU PHÁT TRIỂN
            </span>
          </h2>
        }
        description="Kết nối với những người có cùng chí hướng, khám phá cơ hội mới và xây dựng những mối quan hệ ý nghĩa giúp bạn phát triển bản thân và sự nghiệp."
        illustration={userList}
        type="người dùng"
      />
    </div>
  );
};
