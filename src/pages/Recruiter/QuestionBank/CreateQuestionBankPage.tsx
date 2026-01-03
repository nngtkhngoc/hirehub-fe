import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestionBank } from "@/apis/interview.api";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const CreateQuestionBankPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const validQuestions = questions.filter((q) => q.trim());
    if (validQuestions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    setSubmitting(true);
    try {
      await createQuestionBank({
        recruiterId: user.id,
        title,
        description,
        category,
        questions: validQuestions,
      });

      toast.success("Question bank created successfully!");
      navigate("/recruiter/question-banks");
    } catch (error) {
      console.error("Error creating question bank:", error);
      toast.error("Failed to create question bank");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Create Question Bank</h1>

      <Card className="p-6 space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Backend Developer Questions"
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="TECHNICAL">Technical</option>
            <option value="BEHAVIORAL">Behavioral</option>
            <option value="GENERAL">General</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this question bank..."
            rows={3}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <Label>Questions *</Label>
            <Button type="button" size="sm" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  rows={2}
                  className="flex-1"
                />
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Question Bank"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/recruiter/question-banks")}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

