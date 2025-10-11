import { useState } from "react";

export const FilterBar = () => {
  const filterOptions = [
    {
      key: "jobType",
      title: "Loại hình",
      options: [
        { label: "Thực tập", value: "internship" },
        { label: "Full time", value: "fulltime" },
        { label: "Part time", value: "parttime" },
        { label: "Tình nguyện", value: "volunteer" },
      ],
    },
    {
      key: "level",
      title: "Trình độ",
      options: [
        { label: "Intern", value: "intern" },
        { label: "Fresher", value: "fresher" },
        { label: "Junior", value: "junior" },
        { label: "Senior", value: "senior" },
      ],
    },
    {
      key: "field",
      title: "Lĩnh vực",
      options: [
        { label: "Software Engineering", value: "software_engineering" },
        { label: "Game Development", value: "game_development" },
        { label: "Artificial Intelligence", value: "ai" },
        { label: "Software Testing", value: "software_testing" },
        { label: "Data Science", value: "data_science" },
        { label: "Information Security", value: "information_security" },
        { label: "Design & User Experience", value: "design_ux" },
        { label: "Embedded Systems", value: "embedded_systems" },
        { label: "Khác", value: "other" },
      ],
    },
    {
      key: "workMode",
      title: "Hình thức làm việc",
      options: [
        { label: "Remote", value: "remote" },
        { label: "Hybrid", value: "hybrid" },
        { label: "Onsite", value: "onsite" },
      ],
    },
  ];
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({
    jobType: [],
    level: [],
    field: [],
    workMode: [],
  });

  const handleToggle = (groupKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[groupKey] || [];
      const isSelected = currentValues.includes(value);

      return {
        ...prev,
        [groupKey]: isSelected
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };
  return (
    <div className="flex flex-col gap-[30px] w-[260px] p-4 text-black">
      {filterOptions.map((group) => (
        <div key={group.key}>
          <h4 className="font-bold text-[20px] mb-[20px] text-left font-title">
            {group.title}
          </h4>

          <div className="flex flex-col gap-[20px]  justify-start">
            {group.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-[16px]"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters[group.key]?.includes(opt.value)}
                  onChange={() => handleToggle(group.key, opt.value)}
                  className="accent-primary cursor-pointer w-4 h-4 rounded-[4px]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
