import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { JobLandingPageCard } from "@/components/ui/User/JobLandingPageCard";
import { JobLandingPageCardSkeleton } from "@/components/ui/User/JobLandingPageCardSkeleton";
import { useJobs } from "@/hooks/useJob";

export const RelatedJobs = () => {
  const { data: jobs, isLoading } = useJobs(undefined, undefined, 0, 10);

  // Nếu đang loading thì render skeleton array
  const skeletons = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex flex-col justify-start gap-3">
      <div className="font-bold text-black text-lg sm:text-2xl md:text-3xl">
        Công việc liên quan
      </div>

      <div className="leading-[24px] text-zinc-800 text-sm">
        <Carousel className="w-full flex items-center justify-center pt-5">
          <CarouselContent>
            {isLoading
              ? skeletons.map((_, idx) => (
                  <CarouselItem
                    key={idx}
                    className="md:basis-1/2 h-[360px] lg:basis-1/3"
                  >
                    <JobLandingPageCardSkeleton />
                  </CarouselItem>
                ))
              : jobs?.map((job) => (
                  <CarouselItem
                    key={job.id}
                    className="md:basis-1/2 h-[360px] lg:basis-1/3"
                  >
                    <JobLandingPageCard job={job} />
                  </CarouselItem>
                ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
