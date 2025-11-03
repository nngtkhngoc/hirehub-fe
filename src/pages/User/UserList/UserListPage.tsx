import { Banner } from "@/components/layout/User/Banner";
import { HighlightText } from "@/components/ui/User/HighlightText";
import userList from "@/assets/illustration/userlist.png";
import { UserCard } from "@/components/ui/User/UserCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useUsers } from "@/hooks/useUser";
import { useEffect, useRef, useState } from "react";
import { UserCardSkeleton } from "@/components/ui/User/UserCardSkeleton";

export const UserListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(0);
  const usersPerPage = 8;
  const size = 100;
  const { data: users, isPending, error } = useUsers(page, size);

  const totalPages = Math.ceil(((users && users.length) || 0) / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  useEffect(() => {
    const totalLoadedrecruiters = (page + 1) * size;
    const totalDisplayedrecruiters = currentPage * usersPerPage;
    if (totalDisplayedrecruiters >= totalLoadedrecruiters - usersPerPage) {
      setPage((prev) => prev + 1);
    }
  }, [currentPage, page, usersPerPage, size]);

  const currentUsers =
    users && users.length && users?.slice(startIndex, endIndex);
  const renderUsers = () => {
    return currentUsers && currentUsers.map((user) => <UserCard user={user} />);
  };

  const userListRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    userListRef.current?.scrollIntoView({ behavior: "smooth" });
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

      <div
        className="flex flex-col justify-center items-center gap-5 py-15 w-full"
        ref={userListRef}
      >
        {isPending ? (
          <div className="flex flex-col justify-center items-center gap-5  md:grid md:grid-cols-2 md:gap-20 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className=" h-full w-full flex items-center justify-center text-red-500 pt-20">
            Lỗi khi tải danh sách người dùng.
          </div>
        ) : !currentUsers || currentUsers.length === 0 ? (
          <div className="italic h-full w-full flex items-center justify-center pt-20">
            Không có dữ liệu để hiển thị.
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-5  md:grid md:grid-cols-2 md:gap-20 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
            {renderUsers()}
          </div>
        )}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                hidden={totalPages <= 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
                hidden={totalPages <= 1}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
