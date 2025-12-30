import { JobLandingPageCard } from "@/components/ui/User/JobLandingPageCard";
import { HighlightText } from "@/components/ui/User/HighlightText";
import { PrimaryButton } from "@/components/ui/User/Button";
import { NoteCircle } from "../ui/NoteCircle";

import { Search } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useJobs } from "@/hooks/useJob";

export const FeaturedJobs = () => {
  const { data: jobs } = useJobs(undefined, undefined, 0, 10);
  return (
    <section className="flex flex-col items-center justify-center py-10 gap-5 bg-[#F7F6F8]">
      <div className="flex flex-row justify-center items-center">
        <NoteCircle text="Job" />
      </div>

      <h3>
        <HighlightText text="CÔNG VIỆC NỔI BẬT" />
      </h3>

      <div className="flex flex-row justify-around items-center gap-[12px] lg:gap-[20px] lg:justify-between">
        <div className="flex flex-row justify-around items-center bg-white rounded-[30px] w-[210px] h-[40px] shadow-[0_4px_4px_0_#DFD2FA] lg:w-[300px]">
          <div className="text-[12px] lg:text-[14px] text-[#7A7D87] lg:flex lg:flex-row lg:items-center ">
            Tìm kiếm việc làm<span className="hidden lg:block">...</span>
          </div>
          <Search size={18} className="hover:cursor-pointer" />
        </div>
        <PrimaryButton
          label="Tìm kiếm"
          paddingY="py-[11px]"
          textSize="text-[12px] lg:text-[14px]"
          paddingX="lg:px-[30px]"
        />
      </div>

      <Carousel className="w-4/5 flex items-center justify-center pt-5">
        <CarouselContent>
          {jobs?.content?.map((job) => (
            <CarouselItem className="md:basis-1/2 h-[360px]  lg:basis-1/3">
              <JobLandingPageCard job={job} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
