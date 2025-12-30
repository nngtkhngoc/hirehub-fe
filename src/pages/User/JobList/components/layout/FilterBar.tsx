import { useQuery } from "@tanstack/react-query";
import { getAllJobTypes, getAllJobLevels, getAllWorkTypes } from "@/api/systemOptions";
import type { SelectedFilters } from "../../JobListPage";

interface FilterBarProps {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}

export const FilterBar = ({
  selectedFilters,
  setSelectedFilters,
}: FilterBarProps) => {
  // Fetch dynamic data from APIs
  const { data: jobTypesData } = useQuery({
    queryKey: ["jobTypes"],
    queryFn: getAllJobTypes,
  });

  const { data: jobLevelsData } = useQuery({
    queryKey: ["jobLevels"],
    queryFn: getAllJobLevels,
  });

  const { data: workTypesData } = useQuery({
    queryKey: ["workTypes"],
    queryFn: getAllWorkTypes,
  });

  const filterOptions: {
    key: keyof SelectedFilters;
    title: string;
    options: { label: string; value: string }[];
  }[] = [
    {
      key: "jobType",
      title: "Loại hình",
      options: jobTypesData?.map((item: { id: number; type: string }) => ({
        label: item.type,
        value: item.type,
      })) || [],
    },
    {
      key: "level",
      title: "Trình độ",
      options: jobLevelsData?.map((item: { id: number; level: string }) => ({
        label: item.level,
        value: item.level,
      })) || [],
    },
    {
      key: "field",
      title: "Lĩnh vực",
      // Hard-coded temporarily (no backend table yet)
      options: [
        { label: "Software Engineering", value: "software_engineering" },
        { label: "Game Development", value: "game_development" },
        { label: "Artificial Intelligence", value: "ai" },
        { label: "Software Testing", value: "software_testing" },
      ],
    },
    {
      key: "workMode",
      title: "Hình thức làm việc",
      options: workTypesData?.map((item: { id: number; workspace: string }) => ({
        label: item.workspace,
        value: item.workspace,
      })) || [],
    },
  ] as const;

  const handleToggle = (groupKey: keyof SelectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[groupKey];
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
          <h4 className="font-bold text-[20px] mb-[20px] text-left font-title whitespace-nowrap">
            {group.title}
          </h4>

          <div className="flex flex-col gap-[20px] justify-start">
            {group.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-[16px] font-medium whitespace-nowrap"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters[group.key].includes(opt.value)}
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
