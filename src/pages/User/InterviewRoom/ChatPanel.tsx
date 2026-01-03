import { useState, useRef, useEffect } from "react";
import type { InterviewMessage } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatPanelProps {
  messages: InterviewMessage[];
  currentUserId: number;
  onSendMessage: (content: string) => void;
}

export const ChatPanel = ({ messages, currentUserId, onSendMessage }: ChatPanelProps) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-3">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === currentUserId;
          const isSystem = msg.senderRole === "SYSTEM";

          if (isSystem) {
            return (
              <div key={index} className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full">
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                {!isOwn && (
                  <div className="flex items-center gap-2 mb-1">
                    {msg.senderAvatar && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {msg.senderName}
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!messageText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

