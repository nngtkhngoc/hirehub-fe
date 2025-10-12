import { useState } from "react";

export const FilterBar = () => {
  const filterOptions = [
    {
      key: "field",
      title: "Lĩnh vực",
      options: [
        { label: "Công nghệ thông tin", value: "cong_nghe_thong_tin" },
        { label: "Tài chính – Ngân hàng", value: "tai_chinh_ngan_hang" },
        { label: "Sản xuất & Chế tạo", value: "san_xuat_che_tao" },
        { label: "Xây dựng & Bất động sản", value: "xay_dung_bat_dong_san" },
        { label: "Vận tải & Logistics", value: "van_tai_logistics" },
        { label: "Du lịch & Dịch vụ", value: "du_lich_dich_vu" },
        { label: "Khác", value: "khac" },
      ],
    },
    {
      key: "workspace",
      title: "Hình thức làm việc",
      options: [
        { label: "Remote", value: "remote" },
        { label: "Hybrid", value: "hybrid" },
        { label: "Onsite", value: "onsite" },
      ],
    },
    {
      key: "size",
      title: "Số lượng nhân viên",
      options: [
        { label: "0 - 50", value: "small" },
        { label: "50 - 100", value: "medium" },
        { label: "> 100", value: "big" },
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
    <div className="flex flex-col gap-[30px] w-[200px] p-4 text-black">
      {filterOptions.map((group) => (
        <div key={group.key}>
          <h4 className="font-bold text-[20px] mb-[20px] text-left font-title whitespace-nowrap">
            {group.title}
          </h4>

          <div className="flex flex-col gap-[20px]  justify-start">
            {group.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-[16px] font-medium whitespace-nowrap"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters[group.key]?.includes(opt.value)}
                  onChange={() => handleToggle(group.key, opt.value)}
                  className="accent-primary cursor-pointer w-4 h-4 rounded-[4px] "
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
