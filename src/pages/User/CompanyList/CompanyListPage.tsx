import { Banner } from "@/components/layout/User/Banner";
import { HighlightText } from "@/components/ui/User/HighlightText";
import companylist from "@/assets/illustration/companylist.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter } from "lucide-react";
import { FilterBar } from "./components/layout/FilterBar";
import { recruiters } from "@/mock/recruiter.mock";
import { CompanyCard } from "@/components/ui/User/CompanyCard";

export const CompanyListPage = () => {
  const renderCompanies = () => {
    return recruiters.map((recruiter) => <CompanyCard company={recruiter} />);
  };

  return (
    <div>
      <Banner
        title={
          <h2 className="text-left lg:leading-[60px]">
            <span className="text-[28px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px] font-title">
              KHÁM PHÁ CÁC CÔNG TY{" "}
            </span>
            <HighlightText text="HÀNG ĐẦU" />
          </h2>
        }
        description="Kết nối với những người có cùng chí hướng, khám phá cơ hội mới và xây dựng những mối quan hệ ý nghĩa giúp bạn phát triển bản thân và sự nghiệp."
        illustration={companylist}
        type="công ty"
      />

      <div className="flex flex-col w-full bg-[#F8F9FB] py-12 gap-5 justify-center items-center lg:flex-row lg:items-start lg:pl-5">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-center text-[23px] font-medium whitespace-nowrap">
            Danh sách công ty
          </h3>
          <div className="hidden lg:block">
            <FilterBar />
            <div className="w-full flex items-center justify-center w-full pt-4">
              <OutlineButton
                label="Hủy"
                bgColor="bg-transparent"
                paddingY="py-[7px]"
                paddingX="px-[20px]"
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
                  <FilterBar />
                  <div className="flex flex-row justify-center items-center gap-3 py-2">
                    <PrimaryButton label="Xác nhận" textSize="text-[15px]" />
                    <OutlineButton label="Hủy" textSize="text-[15px]" />
                  </div>
                </>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className=" flex flex-col items-center justify-center gap-10">
          <div className=" flex flex-col lg:grid xl:grid-cols-2 gap-5 items-center md:px-10 md:gap-8 lg:gap-[30px] lg:space-x-[30px]">
            {renderCompanies()}
          </div>{" "}
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
    </div>
  );
};
