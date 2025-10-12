import { Banner } from "@/components/layout/User/Banner";
import { HighlightText } from "@/components/ui/User/HighlightText";
import userList from "@/assets/illustration/userlist.png";
import { UserCard } from "@/components/ui/User/UserCard";
import { users } from "@/mock/uer.mock";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const UserListPage = () => {
  const renderUsers = () => {
    return users.map((user) => <UserCard user={user} />);
  };

  return (
    <div className="bg-[#F8F9FB] flex flex-col items-center justify-center ">
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

      <div className="flex flex-col justify-center items-center gap-5 py-15">
        <div className="flex flex-col justify-center items-center gap-5  md:grid md:grid-cols-2 md:gap-20 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
          {renderUsers()}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
