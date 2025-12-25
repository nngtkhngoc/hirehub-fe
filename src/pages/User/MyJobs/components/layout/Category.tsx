import { Shapes } from "lucide-react";

export const Category = ({
  categoryTab,
  setCategoryTab,
}: {
  categoryTab: string;
  setCategoryTab: React.Dispatch<React.SetStateAction<"applied" | "saved">>;
}) => {
  const tabs: { key: "applied" | "saved"; label: string }[] = [
    { key: "applied", label: "Đã ứng tuyển" },
    { key: "saved", label: "Đã lưu" },
  ];

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col px-4 py-4 md:px-10">
      <div className="w-full text-left text-lg font-bold text-primary pb-4 border-b-2 border-[#f2f2f2] flex flex-row justify-start items-center gap-2">
        <Shapes />
        Phân loại
      </div>

      <div className="flex flex-col">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`cursor-pointer flex-1 py-3 px-2 text-left transition-all duration-300 flex items-center text-sm
              ${categoryTab === tab.key
                ? "border-l-4 border-[#5E1EE6] text-primary bg-[#F0E8FF] "
                : "border-l-4 border-transparent text-black hover:bg-[#F7F6F8]"
              }`}
            onClick={() => setCategoryTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
