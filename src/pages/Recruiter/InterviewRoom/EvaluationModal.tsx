import { useState } from "react";
import type { InterviewRoom } from "@/types/Interview";
import { submitInterviewResult } from "@/apis/interview.api";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface EvaluationModalProps {
  room: InterviewRoom;
  onClose: () => void;
}

export const EvaluationModal = ({ room, onClose }: EvaluationModalProps) => {
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [recommendation, setRecommendation] = useState<"PASS" | "FAIL">("PASS");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    setSubmitting(true);
    try {
      await submitInterviewResult({
        roomId: room.id,
        score,
        comment,
        privateNotes,
        recommendation,
      });

      toast.success("Interview evaluation submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => !submitting && onClose()}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">Interview Evaluation</h2>
            <p className="text-sm text-gray-600 mt-1">
              Provide feedback for {room.applicantName}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Score */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Score (1-10)
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setScore(num)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${
                      score === num
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Recommendation
              </Label>
              <RadioGroup
                value={recommendation}
                onValueChange={(value) => setRecommendation(value as "PASS" | "FAIL")}
              >
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="PASS"
                      checked={recommendation === "PASS"}
                      onChange={(e) => setRecommendation(e.target.value as "PASS" | "FAIL")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      ✓ Pass - Recommend for hiring
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="FAIL"
                      checked={recommendation === "FAIL"}
                      onChange={(e) => setRecommendation(e.target.value as "PASS" | "FAIL")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      ✗ Fail - Do not recommend
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment" className="text-base font-medium mb-2 block">
                Comment (Required) *
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Provide your overall feedback about the candidate..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Private Notes */}
            <div>
              <Label htmlFor="privateNotes" className="text-base font-medium mb-2 block">
                Private Notes (Optional)
              </Label>
              <Textarea
                id="privateNotes"
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Internal notes that won't be shared with the candidate..."
                rows={3}
                className="w-full"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !comment.trim()}
            >
              {submitting ? "Submitting..." : "Submit Evaluation"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

