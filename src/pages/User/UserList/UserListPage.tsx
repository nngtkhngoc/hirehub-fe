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
import type { UserProfile } from "@/types/Auth";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Users, AlertCircle } from "lucide-react";

export const UserListPage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [keyword, setKeyword] = useState<null | string>(null);
  const [province, setProvince] = useState<null | string>(null);
  const [page, setPage] = useState(0);
  const size = 8;
  const {
    data: usersData,
    isPending,
    error,
  } = useUsers(
    keyword || undefined,
    province
      ? province
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim()
      : undefined,
    page,
    size
  );

  const users = usersData?.content;
  const totalPages = usersData?.totalPages || 0;

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [keyword, province]);

  const renderUsers = () => {
    // Filter out current user from the list
    const filteredUsers = users?.filter((user: UserProfile) => user.id !== currentUser?.id);

    return (
      filteredUsers?.map((user: UserProfile) => (
        <UserCard key={user.id} user={user} />
      )) || <></>
    );
  };

  const userListRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // Frontend 1-indexed, Backend 0-indexed
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
        onSearch={(kw, prov) => {
          setKeyword(kw);
          setProvince(prov);
        }}
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
          <div className="h-full w-full flex items-center justify-center pt-10 pb-20">
            <Empty className="border-none">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <AlertCircle className="text-red-500" />
                </EmptyMedia>
                <EmptyTitle>Lỗi khi tải dữ liệu</EmptyTitle>
                <EmptyDescription>
                  Không thể tải danh sách người dùng. Vui lòng thử lại sau.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center pt-10 pb-20">
            <Empty className="border-none">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <Users className="text-primary" />
                </EmptyMedia>
                <EmptyTitle>Không có người dùng nào</EmptyTitle>
                <EmptyDescription>
                  Không tìm thấy người dùng phù hợp với tiêu chí tìm kiếm của bạn.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
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
                  if (page > 0) handlePageChange(page);
                }}
                hidden={totalPages <= 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i}
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
                  if (page < totalPages - 1) handlePageChange(page + 2);
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
