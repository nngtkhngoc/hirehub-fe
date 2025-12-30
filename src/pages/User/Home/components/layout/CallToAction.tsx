import { OutlineButton, PrimaryButton } from "@/components/ui/User/Button";
import { HighlightText } from "@/components/ui/User/HighlightText";
import calltoaction from "@/assets/illustration/calltoaction.png";

import { motion } from "framer-motion";

export const CallToAction = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-5 px-5 md:flex-row lg:px-20 lg:gap-20 py-10 bg-linear-to-b from-[#F6F1FF] via-[#F0EBFA] to-[#E8DDFF] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center gap-5 md:items-end lg:gap-10"
      >
        <h3>
          <HighlightText text="THAM GIA NGAY" />
        </h3>
        <div className="text-[#3F3D56] text-[12px] leading-[24px] text-right">
          Hãy để HireHub đồng hành cùng bạn trong hành trình sự nghiệp. Từ những
          bước khởi đầu, xây dựng hồ sơ, cho đến khi bạn tìm được công việc mơ
          ước – chúng tôi luôn ở bên cạnh, giúp bạn mở ra những cơ hội mới.
        </div>
        <div className="flex flex-row gap-3">
          <PrimaryButton label="Tìm kiếm công việc" textSize="text-[12px]" />
          <OutlineButton
            label="Tìm kiếm ứng viên"
            textSize="text-[12px]"
            bgColor="bg-transparent"
          />
        </div>
      </motion.div>

      <motion.img
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        src={calltoaction}
        alt="finding"
        className="w-[300px] md:w-[400px] lg:w-[500px]"
      />
    </section>
  );
};
