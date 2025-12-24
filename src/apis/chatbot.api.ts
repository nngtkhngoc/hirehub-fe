import { axiosClient, axiosClientFormData } from "@/lib/axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Types for SSE chat
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// ============ Existing APIs ============

export const findJobs = async (query: string) => {
  const res = await axiosClient.post(`${BASE_URL}/api/chatbot/jobs`, {
    message: query,
  });
  return res.data.data;
};

export const analyzeResume = async (data: any) => {
  const res = await axiosClientFormData.post(
    `${BASE_URL}/api/chatbot/resumes`,
    data
  );
  return res.data.data;
};

// ============ New SSE Streaming APIs ============

/**
 * Stream chat với Gemini - gửi message và history, nhận response từng token
 */
export const streamChat = async (
  message: string,
  history: ChatMessage[],
  onToken: (token: string) => void,
  onComplete: () => void,
  onError?: (error: Error) => void,
  messageType?: string // ANALYZE_CV, FIND_JOBS, APPLY_JOB
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/api/chatbot/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history, messageType }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");

      for (const line of lines) {
        console.log("Received line:", line);
        if (line.startsWith("data:")) {
          const token = line.slice(5);
          if (token) {
            // Decode escaped newlines to preserve markdown formatting
            onToken(token.replace(/\\n/g, "\n"));
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      console.error("Stream chat error:", error);
    }
  }
};

/**
 * Stream chat với file upload (PDF)
 */
export const streamChatWithFile = async (
  message: string,
  history: ChatMessage[],
  file: File,
  onToken: (token: string) => void,
  onComplete: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("history", JSON.stringify(history));
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/api/chatbot/chat/stream/file`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const token = line.slice(5);
          if (token) {
            // Decode escaped newlines to preserve markdown formatting
            onToken(token.replace(/\\n/g, "\n"));
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      console.error("Stream chat with file error:", error);
    }
  }
};
