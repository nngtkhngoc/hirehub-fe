import { Search } from "lucide-react";

import illustration from "../../../../assets/illustration/herosection.png";
import { PrimaryButton } from "../../../../components/ui/User/Button";

export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-[#F1EBFF] to-[#EDE5FF]">
      <div className="px-6 pt-[100px] pb-[50px]  md:flex md:flex-row md:px-20 md:justify-around md:items-center">
        <img
          src={illustration}
          alt="finding jobs"
          className="block md:hidden"
        />
        <div className="flex flex-col gap-3 md:items-start md:max-w-[670px] md:gap-5">
          <div className="hidden md:block bg-gradient-to-r from-[#7E4BEB] via-[#4B18B8] to-[#38128A] text-secondary font-bold font-[16px] px-[20px] py-[4px] rounded-[30px]">
            HireHub
          </div>
          <div className="text-center text-[36px] font-extrabold font-title leading-[40px] md:text-[80px] md:text-left md:leading-[80px]">
            <div className="">
              <span className="text-primary">TÌM VIỆC </span>
              <span className="text-[#8DB82D]">DỄ, </span>
            </div>
            <div>
              <span className="text-primary">CHỌN NGHỀ </span>
              <span className="text-[#8DB82D]">HAY</span>
            </div>
          </div>
          <div className="text-[12px] text-center leading-[26px] px-10 text-[#263238] block md:hidden">
            Khám phá hàng trăm cơ hội việc làm, kết nối trực tiếp với nhà tuyển
            dụng và tìm công việc thật sự phù hợp với kỹ năng, đam mê của bạn.
          </div>
          <div className="text-[14px] text-left leading-[26px] text-[#263238] md:block hidden">
            Ở đây, bạn có thể dễ dàng khám phá hàng trăm cơ hội nghề nghiệp, kết
            nối trực tiếp với nhà tuyển dụng, và quan trọng nhất là tìm được
            công việc thực sự phù hợp với kỹ năng, đam mê và phong cách sống của
            riêng mình.
          </div>
          <div className="flex flex-row justify-around items-center gap-[12px]">
            <div className="flex flex-row justify-around items-center bg-white rounded-[30px] w-[215px] h-[40px] shadow-[0_4px_4px_0_#DFD2FA] md:w-[270px]">
              <div className="text-[12px] md:text-[14px] text-[#7A7D87] md:flex md:flex-row md:items-center ">
                Tìm kiếm việc làm<span className="hidden md:block">...</span>
              </div>
              <Search size={18} className="hover:cursor-pointer" />
            </div>
            <PrimaryButton
              label="Tìm kiếm"
              paddingY="py-[11px]"
              textSize="text-[12px] md:text-[14px]"
            />
          </div>
        </div>
        <img
          src={illustration}
          alt="finding jobs"
          className="md:block hidden"
        />
      </div>
    </div>
  );
};
