import { ChartArea, CircleArrowRight, Database, Palette } from "lucide-react";

import { HighlightText } from "@/components/ui/User/HighlightText";
import { CategoryCard, type Category } from "../ui/CategoryCard";
import { OutlineButton } from "@/components/ui/User/Button";
import { NoteCircle } from "../ui/NoteCircle";

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
    return categories.map((category) => <CategoryCard category={category} />);
  };

  return (
    <section className="flex flex-col gap-6 items-center bg-gradient-to-b from-[#FEFEFE] to-[#E0D5F7] py-10 lg:gap-5">
      <div className="w-fit">
        <NoteCircle text="Category" />
      </div>
      <section className="flex flex-col items-center justify-center gap-10 lg:gap-13">
        <h3>
          <HighlightText text="LĨNH VỰC PHỔ BIẾN" />
        </h3>

        <div className="grid grid-cols-2 gap-[23px] justify-self-center block md:hidden">
          {renderCategories(mobileCategories)}
        </div>

        <div className="md:grid md:grid-cols-3 gap-[40px] justify-self-center hidden md:block lg:hidden">
          {renderCategories(tabletCategories)}
        </div>

        <div className="lg:grid lg:grid-cols-3 gap-[40px] justify-self-center hidden lg:block">
          {renderCategories(desktopCategories)}
        </div>
        <OutlineButton
          label={
            <div className="flex flex-row gap-2 items-center">
              <span className="text-[14px] font-medium">Tìm hiểu thêm</span>
              <CircleArrowRight />
            </div>
          }
        />
      </section>
    </section>
  );
};
