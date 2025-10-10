import { PopularCategory } from "@/pages/User/HomePage/components/layout/PopularCategory";
import { FeaturedJobs } from "@/pages/User/HomePage/components/layout/FeaturedJobs";
import { CallToAction } from "@/pages/User/HomePage/components/layout/CallToAction";
import { HeroSection } from "@/pages/User/HomePage/components/layout/HeroSection";
import { HowItWorks } from "@/pages/User/HomePage/components/layout/HowItWorks";
import { Marquee } from "@/pages/User/HomePage/components/layout/Marquee";

export const HomePage = () => {
  return (
    <div className="">
      <HeroSection />
      <Marquee />
      <HowItWorks />
      <PopularCategory />
      <FeaturedJobs />
      <CallToAction />
    </div>
  );
};
