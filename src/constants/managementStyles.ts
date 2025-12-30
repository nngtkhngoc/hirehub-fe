/**
 * Unified Style Constants for Management Pages
 * Use these constants to ensure consistent styling across Admin and Recruiter management pages
 */

export const MANAGEMENT_STYLES = {
  // Button Styles
  buttons: {
    primary: "h-10 px-6",
    action: "h-9 px-4",
    dialogAction: "h-11 px-6",
    icon: "h-9 w-9",
  },

  // Input Styles
  inputs: {
    standard: "h-12 text-base",
    search: "pl-10",
  },

  // Table Styles (Native HTML Tables)
  table: {
    outerContainer: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
    scrollContainer: "overflow-x-auto",
    table: "w-full",
    header: {
      thead: "bg-gray-50 border-b border-gray-100",
      th: "px-6 py-4 text-left text-sm font-semibold text-gray-600",
      thRight: "px-6 py-4 text-right text-sm font-semibold text-gray-600",
      thCenter: "px-6 py-4 text-center text-sm font-semibold text-gray-600",
    },
    body: {
      tbody: "divide-y divide-gray-100",
      tr: "hover:bg-gray-50 transition-colors",
      td: "px-6 py-4",
      tdId: "px-6 py-4 text-gray-600", // For ID columns with # prefix
      tdContent: "px-6 py-4", // Use with <span className="font-medium text-gray-900">
    },
  },

  // Dialog Styles
  dialog: {
    content: "sm:max-w-[550px]",
    title: "text-2xl",
    description: "text-base",
    spacing: "space-y-3",
    input: "h-12 text-base",
  },

  // Card/Container Styles
  container: {
    main: "space-y-6",
    card: "bg-white rounded-xl shadow-sm border border-gray-100",
    filter: "bg-white rounded-xl shadow-sm border border-gray-100 p-4",
  },

  // Header Styles
  header: {
    title: "text-3xl font-bold font-title text-gray-900",
    description: "text-gray-500 mt-1",
  },

  // Empty State
  empty: {
    container: "py-12",
  },
} as const;

export default MANAGEMENT_STYLES;

