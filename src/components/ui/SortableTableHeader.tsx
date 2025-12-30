import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey: string | null;
  currentSortDirection: SortDirection;
  onSort: (key: string) => void;
  className?: string;
}

export const SortableTableHeader = ({
  label,
  sortKey,
  currentSortKey,
  currentSortDirection,
  onSort,
  className = "",
}: SortableTableHeaderProps) => {
  const isActive = currentSortKey === sortKey;

  return (
    <th
      className={`px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <div className="flex flex-col">
          {!isActive && (
            <ArrowUpDown size={14} className="text-gray-400" />
          )}
          {isActive && currentSortDirection === "asc" && (
            <ArrowUp size={14} className="text-primary" />
          )}
          {isActive && currentSortDirection === "desc" && (
            <ArrowDown size={14} className="text-primary" />
          )}
        </div>
      </div>
    </th>
  );
};

