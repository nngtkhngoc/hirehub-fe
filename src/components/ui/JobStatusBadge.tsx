export type JobStatus = "PENDING" | "APPROVED" | "BANNED" | "CLOSED" | "DRAFT" | "ACTIVE" | "UNACTIVE";

interface JobStatusBadgeProps {
  status: JobStatus;
}

export const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const styles: Record<JobStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    BANNED: "bg-red-100 text-red-700",
    CLOSED: "bg-gray-100 text-gray-600",
    DRAFT: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-green-100 text-green-700",
    UNACTIVE: "bg-red-100 text-red-700",
  };

  const labels: Record<JobStatus, string> = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    BANNED: "Bị từ chối",
    CLOSED: "Đã đóng",
    DRAFT: "Bản nháp",
    ACTIVE: "Hoạt động",
    UNACTIVE: "Không hoạt động",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

