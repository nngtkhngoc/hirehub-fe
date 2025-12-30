import { ChartArea, CircleArrowRight, Database, Palette } from "lucide-react";

import { HighlightText } from "@/components/ui/User/HighlightText";
import { CategoryCard, type Category } from "../ui/CategoryCard";
import { OutlineButton } from "@/components/ui/User/Button";
import { NoteCircle } from "../ui/NoteCircle";

import { motion } from "framer-motion";

export const PopularCategory = () => {
  const mobileCategories: Category[] = [
    { icon: Palette, title: "UI/UX DESIGN", positions: "49" },
    { icon: Database, title: "DATA ENGINEER", positions: "30" },
    { icon: ChartArea, title: "DATA ANALYST", positions: "50" },
    { icon: Database, title: "WEB DEVELOPER", positions: "49" },
  ];

  const tabletCategories: Category[] = [
    { icon: Palette, title: "UI/UX DESIGN", positions: "49" },
    { icon: Database, title: "DATA ENGINEER", positions: "30" },
    { icon: ChartArea, title: "DATA ANALYST", positions: "50" },
    { icon: Database, title: "WEB DEVELOPER", positions: "49" },
    { icon: Palette, title: "UI/UX DESIGN", positions: "49" },
    { icon: Database, title: "DATA ENGINEER", positions: "30" },
  ];

  const desktopCategories: Category[] = [
    { icon: Palette, title: "UI/UX DESIGN", positions: "49" },
    { icon: Database, title: "DATA ENGINEER", positions: "30" },
    { icon: ChartArea, title: "DATA ANALYST", positions: "50" },
    { icon: Database, title: "WEB DEVELOPER", positions: "49" },
    { icon: Palette, title: "UI/UX DESIGN", positions: "49" },
    { icon: Database, title: "DATA ENGINEER", positions: "30" },
    { icon: ChartArea, title: "DATA ANALYST", positions: "50" },
    { icon: Database, title: "WEB DEVELOPER", positions: "49" },
    { icon: Palette, title: "UI/UX DESIGN", positions: "49" },
  ];

  const renderCategories = (categories: Category[]) => {
    return categories.map((category, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      >
        <CategoryCard category={category} />
      </motion.div>
    ));
  };

  return (
    <section className="flex flex-col gap-6 items-center bg-gradient-to-b from-[#FEFEFE] to-[#E0D5F7] py-10 lg:gap-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-fit"
      >
        <NoteCircle text="Category" />
      </motion.div>
      <section className="flex flex-col items-center justify-center gap-10 lg:gap-13">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <HighlightText text="LĨNH VỰC PHỔ BIẾN" />
        </motion.h3>

        <div className="grid grid-cols-2 gap-[23px] justify-self-center block md:hidden">
          {renderCategories(mobileCategories)}
        </div>

        <div className="md:grid md:grid-cols-3 gap-[40px] justify-self-center hidden md:block lg:hidden">
          {renderCategories(tabletCategories)}
        </div>

        <div className="lg:grid lg:grid-cols-3 gap-[40px] justify-self-center hidden lg:block">
          {renderCategories(desktopCategories)}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <OutlineButton
            label={
              <div className="flex flex-row gap-2 items-center">
                <span className="text-[14px] font-medium">Tìm hiểu thêm</span>
                <CircleArrowRight />
              </div>
            }
          />
        </motion.div>
      </section>
    </section>
  );
};
