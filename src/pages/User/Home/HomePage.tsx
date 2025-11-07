import { PopularCategory } from "@/pages/User/Home/components/layout/PopularCategory";
import { FeaturedJobs } from "@/pages/User/Home/components/layout/FeaturedJobs";
import { CallToAction } from "@/pages/User/Home/components/layout/CallToAction";
import { HeroSection } from "@/pages/User/Home/components/layout/HeroSection";
import { HowItWorks } from "@/pages/User/Home/components/layout/HowItWorks";
import { Marquee } from "@/pages/User/Home/components/layout/Marquee";

export const HomePage = () => {
  return (
    <div className="">
      <HeroSection />
      {/* <Marquee /> */}
      <HowItWorks />
      <PopularCategory />
      <FeaturedJobs />
      <CallToAction />
    </div>
  );
};
