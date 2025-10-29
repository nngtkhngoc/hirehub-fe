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
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useJobs } from "@/hooks/useJob";
import { JobCardSkeleton } from "@/components/ui/User/JobCardSkeleton";
import { useEffect, useState } from "react";
export interface SelectedFilters {
  jobType: string[];
  level: string[];
  field: string[];
  workMode: string[];
}

export const JobListPage = () => {
  const [keyword, setKeyword] = useState<null | string>(null);
  const [province, setProvince] = useState<null | string>(null);
  const size = 100;
  const [page, setPage] = useState(0);

  const {
    data: jobs,
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
    size
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    jobType: [],
    level: [],
    field: [],
    workMode: [],
  });

  const jobsPerPage = 9;
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const filteredJobs =
    jobs &&
    jobs.length > 0 &&
    jobs?.filter((job) => {
      const matchJobType =
        selectedFilters.jobType.length === 0 ||
        selectedFilters.jobType.includes(job.type.toLowerCase());

      const matchLevel =
        selectedFilters.level.length === 0 ||
        selectedFilters.level.includes(job.level.toLowerCase());

      const matchField =
        selectedFilters.field.length === 0 ||
        selectedFilters.field.includes(job.recruiter.field);

      const matchWorkMode =
        selectedFilters.workMode.length === 0 ||
        selectedFilters.workMode.includes(job.workspace.toLowerCase());

      return matchJobType && matchLevel && matchWorkMode && matchField;
    });

  const currentJobs =
    filteredJobs &&
    filteredJobs.length &&
    filteredJobs?.slice(startIndex, endIndex);

  useEffect(() => {
    const totalLoadedJobs = (page + 1) * size;
    const totalDisplayedJobs = currentPage * jobsPerPage;
    if (totalDisplayedJobs >= totalLoadedJobs - jobsPerPage) {
      setPage((prev) => prev + 1);
    }
  }, [currentPage, page, jobsPerPage, size]);

  const renderJobs = () => {
    return (
      currentJobs &&
      currentJobs.length > 0 &&
      currentJobs?.map((job) => <JobCard key={job.id} job={job} />)
    );
  };

  const totalPages = Math.ceil(
    ((filteredJobs && filteredJobs.length) || 0) / jobsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () =>
    setSelectedFilters({
      jobType: [],
      level: [],
      field: [],
      workMode: [],
    });

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

      <div className="flex flex-col w-full  bg-[#F8F9FB] py-12 gap-5 justify-center items-center lg:flex-row lg:items-start">
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

        <div className=" flex flex-col items-center justify-center gap-10 w-full h-full">
          {isLoading ? (
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 items-center md:px-10 md:gap-8 lg:gap-x-5 lg:gap-y-10 xl:grid-cols-3 lg:pt-15">
              {[...Array(9)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Lỗi khi tải danh sách công việc.
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
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
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
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
