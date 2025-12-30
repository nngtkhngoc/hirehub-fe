import { useQuery } from "@tanstack/react-query";
import { getAllCompanyDomains } from "@/api/systemOptions";
import type { CompanyFilter } from "../../CompanyListPage";

interface FilterBarProps {
  companyFilter: CompanyFilter;
  setCompanyFilter: React.Dispatch<React.SetStateAction<CompanyFilter>>;
}

export const FilterBar = ({
  companyFilter,
  setCompanyFilter,
}: FilterBarProps) => {
  // Fetch dynamic data from API
  const { data: companyDomainsData } = useQuery({
    queryKey: ["companyDomains"],
    queryFn: getAllCompanyDomains,
  });

  const filterOptions: {
    key: keyof CompanyFilter;
    title: string;
    options: { label: string; value: string }[];
  }[] = [
    {
      key: "field",
      title: "Lĩnh vực",
      options: companyDomainsData?.map((item: { id: number; domain: string }) => ({
        label: item.domain,
        value: item.domain,
      })) || [],
    },
    {
      key: "employees",
      title: "Số lượng nhân viên",
      // Hard-coded temporarily (no backend table yet)
      options: [
        { label: "0 - 50", value: "small" },
        { label: "50 - 100", value: "medium" },
        { label: "> 100", value: "big" },
      ],
    },
  ];
  const handleToggle = (groupKey: keyof CompanyFilter, value: string) => {
    setCompanyFilter((prev) => {
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
    <div className="flex flex-col gap-[30px] w-[200px] p-4 text-black">
      {filterOptions.map((group) => (
        <div key={group.key}>
          <h4 className="font-bold text-[20px] mb-[20px] text-left font-title whitespace-nowrap">
            {group.title}
          </h4>

          <div className="flex flex-col gap-[20px] justify-start">
            {group.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-[16px] font-medium whitespace-nowrap cursor-pointer hover:text-primary transition"
              >
                <input
                  type="checkbox"
                  checked={
                    companyFilter[group.key]?.includes(opt.value) || false
                  }
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
