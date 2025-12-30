import { HighlightText } from "@/components/ui/User/HighlightText";
import howitworks from "@/assets/illustration/howitworks.png";
import { NumberCircle } from "../ui/NumberCircle";
import { NoteCircle } from "../ui/NoteCircle";

interface Step {
  title: string;
  description: string;
}

import { motion } from "framer-motion";

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
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex flex-row items-start gap-3"
        >
          <NumberCircle number={number} />
          <div className="flex flex-col gap-1 justify-start max-w-[275px]">
            <div className="text-[#8DB82D] font-bold text-[17px]">
              {step.title}
            </div>
            <div className="text-[#A6A6A6] text-[12px] leading-[22px]">
              {step.description}
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-10 lg:flex lg:flex-row lg:justify-center lg:gap-10 flex-col items-center justify-center lg:px-10 overflow-hidden">
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        src={howitworks}
        alt="computer"
        className="lg:block hidden"
      />
      <div className="flex flex-col w-full lg:w-fit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-row justify-center items-center pb-5"
        >
          <NoteCircle text="Steps" />
        </motion.div>
        <section className="flex flex-col items-center lg:items-start lg:gap-3">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <HighlightText text="QUY TRÌNH ĐƠN GIẢN" />
          </motion.h3>

          <div className="flex flex-col gap-5 px-2 py-8 lg:px-0 lg:justify-start lg:items-start ">
            {renderSteps()}
          </div>
        </section>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full flex items-center justify-center block lg:hidden"
      >
        <img src={howitworks} alt="computer" />
      </motion.div>
    </section>
  );
};
