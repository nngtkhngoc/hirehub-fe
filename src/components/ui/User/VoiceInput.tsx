import { Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceInput({
  setText,
}: {
  setText: (text: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);
    };

    recognition.onerror = (err: any) => {
      console.error("Voice error:", err);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStart = () => {
    recognitionRef.current?.start();
  };

  return (
    <div className="">
      {!listening ? (
        <Mic className="cursor-pointer" onClick={handleStart} />
      ) : (
        <div> Mời nói</div>
      )}
    </div>
  );
}
