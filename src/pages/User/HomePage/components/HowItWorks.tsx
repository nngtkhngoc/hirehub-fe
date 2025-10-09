import { NumberCircle } from "./NumberCircle";

import howitworks from "../../../../assets/illustration/howitworks.png";

interface Step {
  title: string;
  description: string;
}

export const HowItWorks = () => {
  const steps: Step[] = [
    {
      title: "Tạo tài khoản",
      description:
        "Tạo hồ sơ cá nhân nhanh chóng bằng email hoặc tạo tài khoản mới.",
    },
    {
      title: "Hoàn thiện hồ sơ & CV",
      description: "Điền thông tin chi tiết về học vấn, kinh nghiệm, kỹ năng.",
    },
    {
      title: "Tìm kiếm & Ứng tuyển việc làm",
      description: "Khám phá hàng trăm công việc từ nhiều công ty.",
    },
    {
      title: "Tạo tài khoản",
      description:
        "Theo dõi trạng thái ứng tuyển, nhận thông báo khi nhà tuyển dụng xem hồ sơ và phản hồi.",
    },
  ];

  const renderSteps = () => {
    return steps.map((step, index) => {
      const number = "0" + (index + 1);
      return (
        <div className="flex flex-row items-start gap-3">
          <NumberCircle number={number} />
          <div className="flex flex-col gap-1 justify-start max-w-[275px]">
            <div className="text-[#8DB82D] font-bold text-[17px]">
              {step.title}
            </div>
            <div className="text-[#A6A6A6] text-[12px] leading-[22px]">
              {step.description}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <section className="py-10 lg:flex lg:flex-row lg:justify-center lg:gap-20 flex-col items-center justify-center lg:px-10">
      <img src={howitworks} alt="computer" className="lg:block hidden" />

      <section>
        <section className="flex flex-col items-center lg:items-start">
          <div className="w-fit text-center">
            <h3 className="relative text-center text-primary text-[30px] font-extrabold  font-title lg:text-[48px] lg:text-left  whitespace-nowrap after:content-[''] after:absolute after:left-0 after:bottom-1 lg:after:bottom-3 after:w-full after:h-[13px] sm:after:h-[20px] after:bg-secondary after:-z-10 ">
              QUY TRÌNH ĐƠN GIẢN
            </h3>
          </div>

          <div className="flex flex-col gap-5 px-2 py-8 lg:px-0 lg:justify-start lg:items-start ">
            {renderSteps()}
          </div>
        </section>
      </section>
      <div className="w-full flex items-center justify-center block lg:hidden">
        <img src={howitworks} alt="computer" />
      </div>
    </section>
  );
};
