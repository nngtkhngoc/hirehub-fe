import { useState } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  key: string | null;
  direction: SortDirection;
}

export const useTableSort = <T>(initialKey: string | null = null) => {
  const [sortState, setSortState] = useState<SortState>({
    key: initialKey,
    direction: null,
  });

  const handleSort = (key: string) => {
    setSortState((prev) => {
      if (prev.key === key) {
        // Cycle: null -> asc -> desc -> null
        if (prev.direction === null) {
          return { key, direction: "asc" };
        } else if (prev.direction === "asc") {
          return { key, direction: "desc" };
        } else {
          return { key: null, direction: null };
        }
      } else {
        // New column, start with asc
        return { key, direction: "asc" };
      }
    });
  };

  const sortData = <T extends Record<string, any>>(data: T[]): T[] => {
    if (!sortState.key || !sortState.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortState.key!];
      const bValue = b[sortState.key!];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle different types
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortState.direction === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortState.direction === "asc" ? comparison : -comparison;
      }

      // Handle dates (ISO string format)
      if (typeof aValue === "string" && typeof bValue === "string") {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          const comparison = dateA.getTime() - dateB.getTime();
          return sortState.direction === "asc" ? comparison : -comparison;
        }
      }

      // Default comparison
      if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  return {
    sortState,
    handleSort,
    sortData,
  };
};

