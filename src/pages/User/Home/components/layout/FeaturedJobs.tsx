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

import { motion } from "framer-motion";

export const FeaturedJobs = () => {
  const { data: jobs } = useJobs(undefined, undefined, 0, 10);
  return (
    <section className="flex flex-col items-center justify-center py-10 gap-5 bg-[#F7F6F8] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-row justify-center items-center"
      >
        <NoteCircle text="Job" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <HighlightText text="CÔNG VIỆC NỔI BẬT" />
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex flex-row justify-around items-center gap-[12px] lg:gap-[20px] lg:justify-between"
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full flex items-center justify-center"
      >
        <Carousel className="w-4/5 flex items-center justify-center pt-5">
          <CarouselContent>
            {jobs?.content?.map((job) => (
              <CarouselItem
                key={job.id}
                className="md:basis-1/2 h-[360px]  lg:basis-1/3"
              >
                <JobLandingPageCard job={job} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </motion.div>
    </section>
  );
};
