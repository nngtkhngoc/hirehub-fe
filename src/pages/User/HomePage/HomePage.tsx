import { PopularCategory } from "./components/PopularCategory";
import { FeaturedJobs } from "./components/FeaturedJobs";
import { CallToAction } from "./components/CallToAction";
import { HeroSection } from "./components/HeroSection";
import { HowItWorks } from "./components/HowItWorks";
import { Marquee } from "./components/Marquee";

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
