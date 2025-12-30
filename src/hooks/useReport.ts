import { useMutation } from "@tanstack/react-query";
import { createReport, type CreateReportRequest } from "@/apis/report.api";
import { toast } from "sonner";

export const useCreateReport = () => {
    return useMutation({
        mutationFn: (data: CreateReportRequest) => createReport(data),
        onSuccess: () => {
            toast.success("Báo cáo vi phạm thành công!");
        },
        onError: () => {
            toast.error("Gửi báo cáo thất bại!");
        },
    });
};
