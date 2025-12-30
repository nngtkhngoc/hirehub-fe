import { Search } from "lucide-react";

import { NoteCircle } from "@/pages/User/Home/components/ui/NoteCircle";
import illustration from "@/assets/illustration/herosection.png";
import { PrimaryButton } from "@/components/ui/User/Button";

import { useState } from "react";
import { useNavigate } from "react-router";

import { motion } from "framer-motion";

export const HeroSection = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/job-list?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate("/job-list");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#F1EBFF] to-[#EDE5FF] overflow-hidden">
      <div className="px-6 pt-[100px] pb-[50px] lg:flex lg:flex-row lg:px-20 lg:justify-around lg:items-center">
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          src={illustration}
          alt="finding jobs"
          className="block lg:hidden"
        />
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-3 lg:items-start lg:max-w-[670px] lg:gap-5"
        >
          <div className="hidden lg:block">
            <NoteCircle text="HireHub" />
          </div>
          <h3 className="text-center text-[36px] font-extrabold font-title leading-[40px] lg:text-[80px] lg:text-left lg:leading-[80px]">
            <div className="">
              <span className="text-primary">TÌM VIỆC </span>
              <span className="text-[#8DB82D]">DỄ, </span>
            </div>
            <div>
              <span className="text-primary">CHỌN NGHỀ </span>
              <span className="text-[#8DB82D]">HAY</span>
            </div>
          </h3>
          <div className="text-[12px] text-center leading-[26px] px-5 text-[#263238] block lg:hidden">
            Khám phá hàng trăm cơ hội việc làm, kết nối trực tiếp với nhà tuyển
            dụng và tìm công việc thật sự phù hợp với kỹ năng, đam mê của bạn.
          </div>
          <div className="text-[14px] text-left leading-[26px] text-[#263238] lg:block hidden">
            Ở đây, bạn có thể dễ dàng khám phá hàng trăm cơ hội nghề nghiệp, kết
            nối trực tiếp với nhà tuyển dụng, và quan trọng nhất là tìm được
            công việc thực sự phù hợp với kỹ năng, đam mê và phong cách sống của
            riêng mình.
          </div>
          <div className="flex flex-row justify-around items-center gap-[12px]">
            <div className="flex flex-row items-center bg-white rounded-[30px] w-full max-w-[300px] h-[45px] shadow-[0_4px_4px_0_#DFD2FA] px-4 lg:w-[400px]">
              <input
                type="text"
                placeholder="Tìm kiếm việc làm..."
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#263238] placeholder:text-[#7A7D87]"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Search
                size={20}
                className="text-primary hover:cursor-pointer hover:scale-110 transition-transform"
                onClick={handleSearch}
              />
            </div>
            <PrimaryButton
              label="Tìm kiếm"
              paddingY="py-[12px]"
              paddingX="px-6"
              textSize="text-[14px]"
              onClick={handleSearch}
            />
          </div>
        </motion.section>
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          src={illustration}
          alt="finding jobs"
          className="lg:block hidden"
        />
      </div>
    </section>
  );
};
