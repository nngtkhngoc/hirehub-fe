import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !shadow-md !font-medium !border !px-4 !py-3 !text-[12px] font-primary !flex !items-center !gap-2 ",
          success:
            "!bg-emerald-50 !text-emerald-800 !border-emerald-200 dark:!bg-emerald-950 dark:!text-emerald-100 dark:!border-emerald-900 !text-[12px] font-primary",
          error:
            "!bg-red-100 !text-red-800 !border-red-200 dark:!bg-red-900 dark:!text-red-100 dark:!border-red-900 !text-[12px] font-primary",
          warning:
            "!bg-amber-50 !text-amber-800 !border-amber-200 dark:!bg-amber-950 dark:!text-amber-100 dark:!border-amber-900 !text-[12px] font-primary",
          info: "!bg-blue-50 !text-blue-800 !border-blue-200 dark:!bg-blue-950 dark:!text-blue-100 dark:!border-blue-900 !text-[12px] font-primary",
          loading:
            "!bg-zinc-50 !text-zinc-800 !border-zinc-200 dark:!bg-zinc-900 dark:!text-zinc-100 dark:!border-zinc-800 !text-[12px] font-primary",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="!size-4 !text-emerald-600" />,
        info: <InfoIcon className="!size-4 !text-blue-600" />,
        warning: <TriangleAlertIcon className="!size-4 !text-amber-600" />,
        error: <OctagonXIcon className="!size-4 !text-red-600" />,
        loading: (
          <Loader2Icon className="!size-4 !animate-spin !text-zinc-600" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
