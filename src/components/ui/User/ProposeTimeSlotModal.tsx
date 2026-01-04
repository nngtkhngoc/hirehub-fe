import { useState } from "react";
import { createScheduleRequest } from "@/apis/interview.api";
import type { CreateScheduleRequestDTO } from "@/types/Interview";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

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
            toast.error("Maximum 10 time slots allowed");
            return;
        }
        setTimeSlots([
            ...timeSlots,
            { id: Date.now().toString(), date: "", time: "" },
        ]);
    };

    const removeTimeSlot = (id: string) => {
        if (timeSlots.length <= 1) {
            toast.error("At least one time slot is required");
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
            toast.error("Please add at least one complete time slot");
            return;
        }

        if (validSlots.length < timeSlots.length) {
            toast.error("Please complete all time slots or remove empty ones");
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
                "Time slot proposal sent! The applicant will receive an email to select their preferred time."
            );
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error creating schedule request:", error);
            toast.error("Failed to send time slot proposal");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-bold">
                            Propose Interview Time Slots - Round {roundNumber}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Propose multiple time options for {applicantName} to choose from
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-1 block">
                                Job Position
                            </Label>
                            <p className="text-gray-700">{jobTitle}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-1 block">
                                Candidate
                            </Label>
                            <p className="text-gray-700">{applicantName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label
                                    htmlFor="type"
                                    className="text-sm font-medium mb-1 block"
                                >
                                    Interview Type *
                                </Label>
                                <select
                                    id="type"
                                    value={interviewType}
                                    onChange={(e) =>
                                        setInterviewType(e.target.value as "CHAT" | "VIDEO")
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="CHAT">Chat</option>
                                    <option value="VIDEO">Video (Coming Soon)</option>
                                </select>
                            </div>

                            <div>
                                <Label
                                    htmlFor="mode"
                                    className="text-sm font-medium mb-1 block"
                                >
                                    Interview Mode *
                                </Label>
                                <select
                                    id="mode"
                                    value={interviewMode}
                                    onChange={(e) =>
                                        setInterviewMode(e.target.value as "LIVE" | "ASYNC")
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="LIVE">Live (Real-time)</option>
                                    <option value="ASYNC">Async (Automated)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="expiration"
                                className="text-sm font-medium mb-1 block"
                            >
                                Expiration Time (hours) *
                            </Label>
                            <Input
                                id="expiration"
                                type="number"
                                min="1"
                                max="168"
                                value={expirationHours}
                                onChange={(e) => setExpirationHours(Number(e.target.value))}
                                placeholder="48"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Applicant must respond within this time (default: 48 hours)
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <Label className="text-sm font-medium">
                                    Proposed Time Slots *
                                </Label>
                                <Button
                                    type="button"
                                    onClick={addTimeSlot}
                                    variant="outline"
                                    size="sm"
                                    disabled={timeSlots.length >= 10}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Slot
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {timeSlots.map((slot, index) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center gap-3 p-3 border rounded bg-gray-50"
                                    >
                                        <span className="text-sm font-medium text-gray-600 w-8">
                                            #{index + 1}
                                        </span>
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <div>
                                                <Input
                                                    type="date"
                                                    value={slot.date}
                                                    onChange={(e) =>
                                                        updateTimeSlot(slot.id, "date", e.target.value)
                                                    }
                                                    min={new Date().toISOString().split("T")[0]}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="time"
                                                    value={slot.time}
                                                    onChange={(e) =>
                                                        updateTimeSlot(slot.id, "time", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {timeSlots.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => removeTimeSlot(slot.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Add 3-10 time slot options. The system will automatically check
                                for conflicts with the applicant's existing interviews.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-sm text-blue-800">
                                <strong>📧 Next Steps:</strong> The applicant will receive an
                                email with all proposed time slots. They can select their
                                preferred available time, and the interview room will be
                                created automatically.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end">
                        <Button onClick={onClose} variant="outline" disabled={submitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Sending..." : "Send Proposal"}
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
