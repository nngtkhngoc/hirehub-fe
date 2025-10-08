import { CallToAction } from "./components/CallToAction";
import { FeaturedJobs } from "./components/FeaturedJobs";
import { HeroSection } from "./components/HeroSection";
import { HowItWorks } from "./components/HowItWorks";
import { Marquee } from "./components/Marquee";
import { PopularCategory } from "./components/PopularCategory";

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
