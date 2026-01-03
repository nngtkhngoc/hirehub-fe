import { useState } from "react";
import type { InterviewMessage } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus } from "lucide-react";

interface QuestionPanelProps {
  questions: InterviewMessage[];
  onSendQuestion: (content: string) => void;
}

export const QuestionPanel = ({ questions, onSendQuestion }: QuestionPanelProps) => {
  const [questionText, setQuestionText] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleSend = () => {
    if (questionText.trim()) {
      onSendQuestion(questionText);
      setQuestionText("");
      setShowInput(false);
    }
  };

  const commonQuestions = [
    "Tell me about yourself and your background.",
    "What interests you about this position?",
    "What are your key strengths and weaknesses?",
    "Describe a challenging project you worked on.",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Interview Questions</h2>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Sent Questions */}
        {questions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Sent Questions</h3>
            {questions.map((q, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-gray-800">{q.content}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(q.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Common Questions */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium text-gray-600">Quick Questions</h3>
          {commonQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => onSendQuestion(q)}
              className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 transition-colors"
            >
              <p className="text-sm text-gray-700">{q}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Question Input */}
      <div className="bg-white border-t p-4">
        {!showInput ? (
          <Button
            onClick={() => setShowInput(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Question
          </Button>
        ) : (
          <div className="space-y-2">
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Type your question..."
              rows={3}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSend}
                disabled={!questionText.trim()}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button
                onClick={() => {
                  setShowInput(false);
                  setQuestionText("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

