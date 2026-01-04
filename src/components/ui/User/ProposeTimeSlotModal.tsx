import { useState } from "react";
import { createScheduleRequest } from "@/apis/interview.api";
import type { CreateScheduleRequestDTO } from "@/types/Interview";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    X,
    Plus,
    Video,
    MessageSquare,
    Laptop,
    UserCheck,
    Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProposeTimeSlotModalProps {
    jobId: number;
    jobTitle: string;
    applicantId: number;
    applicantName: string;
    recruiterId: number;
    roundNumber?: number;
    previousRoomId?: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface TimeSlotInput {
    id: string;
    date: string;
    time: string;
}

export const ProposeTimeSlotModal = ({
    jobId,
    jobTitle,
    applicantId,
    applicantName,
    recruiterId,
    roundNumber = 1,
    previousRoomId,
    isOpen,
    onClose,
    onSuccess,
}: ProposeTimeSlotModalProps) => {
    const [interviewType, setInterviewType] = useState<"CHAT" | "VIDEO">("CHAT");
    const [interviewMode, setInterviewMode] = useState<"LIVE" | "ASYNC">("LIVE");
    const [expirationHours, setExpirationHours] = useState<number>(48);
    const [timeSlots, setTimeSlots] = useState<TimeSlotInput[]>([
        { id: "1", date: "", time: "" },
        { id: "2", date: "", time: "" },
        { id: "3", date: "", time: "" },
    ]);
    const [submitting, setSubmitting] = useState(false);

    const addTimeSlot = () => {
        if (timeSlots.length >= 10) {
            toast.error("Tối đa 10 khung giờ");
            return;
        }
        setTimeSlots([
            ...timeSlots,
            { id: Date.now().toString(), date: "", time: "" },
        ]);
    };

    const removeTimeSlot = (id: string) => {
        if (timeSlots.length <= 1) {
            toast.error("Cần ít nhất một khung giờ");
            return;
        }
        setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    };

    const updateTimeSlot = (
        id: string,
        field: "date" | "time",
        value: string
    ) => {
        setTimeSlots(
            timeSlots.map((slot) =>
                slot.id === id ? { ...slot, [field]: value } : slot
            )
        );
    };

    const handleSubmit = async () => {
        // Validate all slots have both date and time
        const validSlots = timeSlots.filter((slot) => slot.date && slot.time);

        if (validSlots.length === 0) {
            toast.error("Vui lòng thêm ít nhất một khung giờ đầy đủ");
            return;
        }

        if (validSlots.length < timeSlots.length) {
            toast.error("Vui lòng hoàn thành tất cả các khung giờ hoặc xóa các khung giờ trống");
            return;
        }

        // Convert to ISO datetime strings
        const proposedTimeSlots = validSlots.map(
            (slot) => `${slot.date}T${slot.time}:00`
        );

        const requestData: CreateScheduleRequestDTO = {
            jobId,
            applicantId,
            recruiterId,
            proposedTimeSlots,
            interviewType,
            interviewMode,
            roundNumber,
            previousRoomId,
            expirationHours,
        };

        setSubmitting(true);
        try {
            await createScheduleRequest(requestData);
            toast.success(
                "Đã gửi đề xuất khung giờ! Ứng viên sẽ nhận được email để chọn thời gian họ muốn."
            );
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error creating schedule request:", error);
            toast.error("Gửi đề xuất khung giờ thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Đề xuất các khung giờ phỏng vấn - Vòng {roundNumber}
                    </DialogTitle>
                    <p className="text-sm text-gray-600 mt-1">
                        Đề xuất nhiều lựa chọn thời gian để {applicantName} chọn
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label className="text-sm font-semibold mb-1 block text-gray-700">
                                Vị trí công việc
                            </Label>
                            <p className="text-gray-900 font-medium">{jobTitle}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold mb-1 block text-gray-700">
                                Ứng viên
                            </Label>
                            <p className="text-gray-900 font-medium">{applicantName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="type"
                                className="text-sm font-medium block text-gray-700"
                            >
                                Loại phỏng vấn *
                            </Label>
                            <Select
                                value={interviewType}
                                onValueChange={(value) => setInterviewType(value as "CHAT" | "VIDEO")}
                            >
                                <SelectTrigger id="type" className="w-full h-10 bg-white">
                                    <SelectValue placeholder="Chọn loại phỏng vấn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CHAT">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-blue-500" />
                                            <span>Chat</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="VIDEO">
                                        <div className="flex items-center gap-2">
                                            <Video className="w-4 h-4 text-purple-500" />
                                            <span>Video (Sắp ra mắt)</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="mode"
                                className="text-sm font-medium block text-gray-700"
                            >
                                Chế độ phỏng vấn *
                            </Label>
                            <Select
                                value={interviewMode}
                                onValueChange={(value) => setInterviewMode(value as "LIVE" | "ASYNC")}
                            >
                                <SelectTrigger id="mode" className="w-full h-10 bg-white">
                                    <SelectValue placeholder="Chọn chế độ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LIVE">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-green-500" />
                                            <span>Phỏng vấn trực tiếp</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="ASYNC">
                                        <div className="flex items-center gap-2">
                                            <Laptop className="w-4 h-4 text-orange-500" />
                                            <span>Gợi ý câu hỏi</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label
                            htmlFor="expiration"
                            className="text-sm font-medium mb-1 block"
                        >
                            Thời gian hết hạn (giờ) *
                        </Label>
                        <Input
                            id="expiration"
                            type="number"
                            min="1"
                            max="168"
                            value={expirationHours}
                            onChange={(e) => setExpirationHours(Number(e.target.value))}
                            placeholder="48"
                            className="focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Ứng viên phải phản hồi trong khoảng thời gian này (mặc định: 48 giờ)
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <Label className="text-sm font-medium">
                                Các khung giờ đề xuất *
                            </Label>
                            <Button
                                type="button"
                                onClick={addTimeSlot}
                                variant="outline"
                                size="sm"
                                disabled={timeSlots.length >= 10}
                                className="border-primary text-primary hover:bg-primary/5"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Thêm khung giờ
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {timeSlots.map((slot, index) => (
                                <div
                                    key={slot.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-white transition-colors duration-200"
                                >
                                    <span className="text-sm font-bold text-primary w-8">
                                        #{index + 1}
                                    </span>
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal h-10 bg-white",
                                                            !slot.date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {slot.date ? (
                                                            format(new Date(slot.date), "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Chọn ngày</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={slot.date ? new Date(slot.date) : undefined}
                                                        onSelect={(date) =>
                                                            updateTimeSlot(
                                                                slot.id,
                                                                "date",
                                                                date ? format(date, "yyyy-MM-dd") : ""
                                                            )
                                                        }
                                                        disabled={(date) =>
                                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div>
                                            <Input
                                                type="time"
                                                value={slot.time}
                                                onChange={(e) =>
                                                    updateTimeSlot(slot.id, "time", e.target.value)
                                                }
                                                className="focus:ring-2 focus:ring-primary h-10 bg-white"
                                            />
                                        </div>
                                    </div>
                                    {timeSlots.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => removeTimeSlot(slot.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Thêm 3-10 lựa chọn khung giờ. Hệ thống sẽ tự động kiểm tra xung đột với các buổi phỏng vấn khác của ứng viên.
                        </p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="p-1 bg-primary/10 rounded-full h-fit">
                                <Plus className="w-4 h-4 text-primary" />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                <strong className="text-primary">📧 Bước tiếp theo:</strong> Ứng viên sẽ nhận được email với tất cả các khung giờ đề xuất. Họ có thể chọn thời gian phù hợp và phòng phỏng vấn sẽ được tạo tự động.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4 flex gap-3">
                    <Button onClick={onClose} variant="outline" disabled={submitting}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="min-w-[120px]"
                    >
                        {submitting ? "Đang gửi..." : "Gửi đề xuất"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
