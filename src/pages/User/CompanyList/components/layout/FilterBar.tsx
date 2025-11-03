import type { CompanyFilter } from "../../CompanyListPage";

interface FilterBarProps {
  companyFilter: CompanyFilter;
  setCompanyFilter: React.Dispatch<React.SetStateAction<CompanyFilter>>;
}

const filterOptions: {
  key: keyof CompanyFilter;
  title: string;
  options: { label: string; value: string }[];
}[] = [
  {
    key: "field",
    title: "Lĩnh vực",
    options: [
      { label: "Công nghệ thông tin", value: "Công nghệ thông tin" },
      { label: "Tài chính – Ngân hàng", value: "Tài chính – Ngân hàng" },
      { label: "Sản xuất & Chế tạo", value: "Sản xuất & Chế tạo" },
      { label: "Xây dựng & Bất động sản", value: "Xây dựng & Bất động sản" },
      { label: "Vận tải & Logistics", value: "Vận tải & Logistics" },
      { label: "Du lịch & Dịch vụ", value: "Du lịch & Dịch vụ" },
      { label: "Khác", value: "Khác" },
    ],
  },
  {
    key: "employees",
    title: "Số lượng nhân viên",
    options: [
      { label: "0 - 50", value: "small" },
      { label: "50 - 100", value: "medium" },
      { label: "> 100", value: "big" },
    ],
  },
];

export const FilterBar = ({
  companyFilter,
  setCompanyFilter,
}: FilterBarProps) => {
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
