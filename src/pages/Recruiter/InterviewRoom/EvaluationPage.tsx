import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { InterviewRoom, InterviewResult } from "@/types/Interview";
import {
  getRoomById,
  getResultByRoomId,
  submitInterviewResult,
  saveDraftResult,
} from "@/apis/interview.api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

export const EvaluationPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [room, setRoom] = useState<InterviewRoom | null>(null);
  const [existingResult, setExistingResult] = useState<InterviewResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [recommendation, setRecommendation] = useState<"PASS" | "FAIL">("PASS");
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    if (!roomId || !user) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const roomData = await getRoomById(Number(roomId));
        setRoom(roomData);

        // Check if user is recruiter
        if (user.id != roomData.recruiterId.toString()) {
          toast.error("You don't have permission to evaluate this interview");
          navigate("/recruiter/interviews");
          return;
        }

        // Try to load existing result (draft or submitted)
        try {
          const result = await getResultByRoomId(roomData.id);
          setExistingResult(result);
          if (result) {
            setScore(result.score);
            setComment(result.comment || "");
            setPrivateNotes(result.privateNotes || "");
            setRecommendation(result.recommendation);
          }
        } catch (error) {
          // No existing result, that's fine
          console.log("No existing evaluation found");
        }
      } catch (error) {
        console.error("Error loading room:", error);
        toast.error("Failed to load interview room");
        navigate("/recruiter/interviews");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roomId, user, navigate]);

  const handleSaveDraft = async () => {
    if (!room) return;

    setSavingDraft(true);
    try {
      await saveDraftResult({
        roomId: room.id,
        score,
        comment,
        privateNotes,
        recommendation,
        isDraft: true,
      });
      toast.success("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    if (!room) return;

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
        isDraft: false,
      });

      toast.success("Interview evaluation submitted successfully");
      navigate("/recruiter/interviews");
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/recruiter/interviews")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interviews
          </Button>
          <h1 className="text-3xl font-bold">Interview Evaluation</h1>
          <p className="text-gray-600 mt-2">
            Evaluate interview for {room.applicantName} - {room.jobTitle}
          </p>
          {existingResult && existingResult.isDraft && (
            <div className="mt-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded">
              You have a saved draft. Continue editing or submit when ready.
            </div>
          )}
          {existingResult && !existingResult.isDraft && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded">
              Evaluation already submitted. You can update it below.
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          {/* Score */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Score (1-10)
            </Label>
            <div className="flex gap-2 flex-wrap">
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
              onValueChange={(value) =>
                setRecommendation(value as "PASS" | "FAIL")
              }
            >
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="PASS"
                    checked={recommendation === "PASS"}
                    onChange={(e) =>
                      setRecommendation(e.target.value as "PASS" | "FAIL")
                    }
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
                    onChange={(e) =>
                      setRecommendation(e.target.value as "PASS" | "FAIL")
                    }
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
            <Label
              htmlFor="comment"
              className="text-base font-medium mb-2 block"
            >
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
            <Label
              htmlFor="privateNotes"
              className="text-base font-medium mb-2 block"
            >
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
        <div className="mt-6 flex gap-3 justify-end">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            disabled={savingDraft || submitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {savingDraft ? "Saving..." : "Save for Later"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || savingDraft || !comment.trim()}
          >
            {submitting ? "Submitting..." : "Submit Evaluation"}
          </Button>
        </div>
      </div>
    </div>
  );
};
