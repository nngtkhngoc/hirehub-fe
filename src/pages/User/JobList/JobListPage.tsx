import { Banner } from "@/components/layout/User/Banner";
import { HighlightText } from "@/components/ui/User/HighlightText";
import joblist from "@/assets/illustration/joblist.png";
import { JobCard } from "@/components/ui/User/JobCard";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterBar } from "./components/layout/FilterBar";
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useJobs } from "@/hooks/useJob";
import { JobCardSkeleton } from "@/components/ui/User/JobCardSkeleton";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
export interface SelectedFilters {
  jobType: string[];
  level: string[];
  field: string[];
  workMode: string[];
}

export const JobListPage = () => {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword");
  const [keyword, setKeyword] = useState<null | string>(initialKeyword);
  const [province, setProvince] = useState<null | string>(null);
  const size = 9; // Set appropriate page size for backend pagination
  const [page, setPage] = useState(0);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    jobType: [],
    level: [],
    field: [],
    workMode: [],
  });

  // Reset page to 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [keyword, province, selectedFilters]);

  const {
    data: jobsData,
    isLoading,
    error,
  } = useJobs(
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
    size,
    selectedFilters.level.length > 0 ? selectedFilters.level : undefined,
    selectedFilters.workMode.length > 0 ? selectedFilters.workMode : undefined,
    selectedFilters.jobType.length > 0 ? selectedFilters.jobType : undefined,
    selectedFilters.field.length > 0 ? selectedFilters.field : undefined
  );

  const jobs = jobsData?.content;
  const totalPages = jobsData?.totalPages || 0;

  useEffect(() => {
    jobListRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedFilters, page]); // Scroll on filter or page change

  const renderJobs = () => {
    return (
      jobs &&
      jobs.length > 0 &&
      jobs?.map((job) => <JobCard key={job?.id} job={job} />)
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // Frontend is 1-based, Backend is 0-based
    jobListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilters = () =>
    setSelectedFilters({
      jobType: [],
      level: [],
      field: [],
      workMode: [],
    });

  const jobListRef = useRef<HTMLDivElement>(null);
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
        onSearch={(kw, prov) => {
          setKeyword(kw);
          setProvince(prov);
        }}
      />
      <div
        ref={jobListRef}
        className="flex flex-col w-full  bg-[#F8F9FB] py-12 gap-5 justify-center items-center lg:flex-row lg:items-start"
      >
        <div className="flex flex-col justify-center items-center pl-5">
          <h3 className="text-center text-[23px] font-medium">
            Danh sách công việc
          </h3>
          <div className="hidden lg:block">
            <FilterBar
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />

            <div className="w-full flex items-center justify-center w-full pt-4">
              <OutlineButton
                label="Hủy"
                bgColor="bg-transparent"
                paddingY="py-[7px]"
                paddingX="px-[20px]"
                onClick={clearFilters}
              />
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger>
            <div className="w-[310px] h-[47px] bg-white shadow-[0px_4px_4px_0px_#E6E6E6] rounded-[10px] text-[#A6A6A6] flex flex-row items-center justify-center gap-3 block lg:hidden ">
              <Filter size={23} />
              <span>Bộ lọc</span>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div className="flex flex-row items-center justify-start gap-3 block md:hidden text-black  border-b-2 border-[#DBDBDB] pb-[20px]  pl-4">
                  <Filter size={23} />
                  <span className="font-bold text-[20px]">Bộ lọc</span>
                </div>
              </DialogTitle>
              <DialogDescription className="overflow-y-auto">
                <>
                  <FilterBar
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                  />
                  <div className="flex flex-row justify-center items-center gap-3 py-2">
                    <PrimaryButton label="Xác nhận" textSize="text-[15px]" />
                    <OutlineButton
                      label="Hủy"
                      textSize="text-[15px]"
                      onClick={clearFilters}
                    />
                  </div>
                </>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col items-center justify-center gap-10 w-full ">
          {isLoading ? (
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 items-center md:px-10 md:gap-8 lg:gap-x-5 lg:gap-y-10 xl:grid-cols-3 lg:pt-15">
              {[...Array(9)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className=" h-full w-full flex items-center justify-center text-red-500 pt-20">
              Lỗi khi tải danh sách công việc.
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div className="italic h-full w-full flex items-center justify-center pt-20">
              Không có dữ liệu để hiển thị.
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 items-center md:px-10 md:gap-8 lg:gap-x-5 lg:gap-y-10 xl:grid-cols-3 lg:pt-15">
              {renderJobs()}
            </div>
          )}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 0) handlePageChange(page); // pass currentPage (1-based) doing page (0-based) means prev page 1-based.
                    // Wait, handlePageChange takes newPage (1-based).
                    // If current page index is 'page' (0), then current page number is page+1.
                    // To go to prev, we want page.
                    // Example: page=1 (2nd page). Previs page=0 (1st page). handlePageChange(1).
                    if (page > 0) handlePageChange(page);
                  }}
                  hidden={totalPages <= 1}
                />
              </PaginationItem>

              {/* Show simple pagination: 1 ... 4 5 6 ... 10? Or just all pages?
                  Code originally showed all pages. Let's keep simpler logic for now unless requested.
                  Actually let's limit if too many pages? Original code: Array.from({ length: totalPages }).
                  If totalPages is huge, this is bad. But let's stick to original behavior for consistency.
               */}
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
                    // current page index 'page'. Next index page+1.
                    // handlePageChange takes 1-based. So page+2.
                    if (page < totalPages - 1)
                      handlePageChange(page + 2);
                  }}
                  hidden={totalPages <= 1}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
