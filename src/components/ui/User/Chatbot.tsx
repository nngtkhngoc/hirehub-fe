import { Button } from "@mui/material";
import { useRef, useState } from "react";
import chatbotIcon from "@/assets/icons/chatbot.png";
import { motion, AnimatePresence } from "framer-motion";
import type { Job } from "@/types/Job";
import { analyzeResume, findJobs } from "@/apis/chatbot.api";
import { ArrowRight, ImageUp, Send, SendHorizonal, X } from "lucide-react";
import { FlexibleJobCard } from "./FlexibleJobCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { classifyMessage } from "@/apis/external.api";
import { ClassificationType } from "@/constants/classification";
import { toast } from "sonner";
import { applyJob } from "@/apis/job.api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface messageInterface {
  sender: "user" | "bot";
  text?: string;
  jobs?: Job[];
  type?: string;
}
const messageList = [
  "Dưới đây là một số công việc phù hợp với bạn:",
  "Mình đã tìm thấy các công việc sau đây:",
  "Những công việc này có thể phù hợp với bạn:",
  "Dưới đây là các lựa chọn công việc mà mình tìm thấy:",
  "Hãy xem qua các công việc sau đây mà mình đã tìm được:",
  "Các công việc sau đây có thể phù hợp với bạn:",
  "Mình đã tổng hợp một số công việc sau đây cho bạn:",
  "Dưới đây là danh sách công việc mà mình đã tìm thấy:",
  "Những công việc này có thể là lựa chọn tốt cho bạn:",
  "Hãy xem các công việc sau đây mà mình đã tìm được cho bạn:",
];
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [userInput, setUserInput] = useState("");
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUserInput = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    setMessages([...messages, { sender: "user", text: userInput, jobs: [] }]);
    setUserInput("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "..." },
    ]);
    console.log("WTF");
    setSelectedFile(null);
    const messageType = await classifyMessage(userInput);
    console.log(messageType);

    console.log("WTF2");
    if (messageType == ClassificationType.ANALYZE_CV) {
      let form = new FormData();

      form.append("message", userInput);
      if (selectedFile) form.append("resume", selectedFile);
      else if (user?.openAiResumeId) {
        form.append("resumeId", user.openAiResumeId);
      } else {
        toast.error("Không thấy CV nào của bạn gởi lên cả");
        return;
      }
      let botResponse = await analyzeResume(form);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop();
        updatedMessages.push({
          sender: "bot",
          text: botResponse,
          type: ClassificationType.ANALYZE_CV,
        });
        console.log(botResponse, "!!");
        return updatedMessages;
      });
    } else if (messageType == ClassificationType.FIND_JOBS) {
      let botResponse = await findJobs(userInput);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop();
        updatedMessages.push({
          sender: "bot",
          jobs: botResponse,
          text: messageList[Math.floor(Math.random() * messageList.length)],
          type: ClassificationType.FIND_JOBS,
        });
        return updatedMessages;
      });
    } else {
      let match = userInput.match(/\d+/);
      let form = new FormData();
      form.append("userId", user!!.id);
      if (selectedFile) {
        form.append("resumeFile", selectedFile);
      }
      for (let id in match) {
        form.set("jobId", id);
        await applyJob(form);
      }
      toast.success("Nộp resume thành công");
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
  };
  return (
    <div className="fixed bottom-2 right-2 z-100 font-primary">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbot-window"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-20 right-5 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col w-[95vw] h-[80vh] md:w-[500px] md:h-[500px]  font-primary"
          >
            <div className="chatbot-header bg-zinc-100 p-3 rounded-t-lg ">
              <div className="flex justify-between items-center ">
                <div className="">
                  <div className="flex items-center gap-2 b">
                    <img src={chatbotIcon} className="w-[30px] h-[30px]" />
                    <h2 className="text-lg font-semibold font-primary">
                      Hubby
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-white rounded-full transition-all duration-300"
                >
                  <X className="w-5" />
                </button>
              </div>
            </div>
            <div className="chatbot-body p-3 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-zinc-500 px-3 text-[14px]">
                  Chưa có tin nhắn nào. Hãy nhắn tin cho{" "}
                  <em className="font-bold text-primary">Hubby</em> để có thể
                  tìm việc nhanh chóng!
                </p>
              ) : (
                <div className="flex flex-col gap-2 text-[14px] prose">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-xl text-[14px] ${
                        msg.sender === "user"
                          ? "bg-primary text-white self-end"
                          : "bg-zinc-200 text-gray-800 self-start"
                      }`}
                    >
                      {/* USER MESSAGE */}
                      {msg.sender === "user" && <div>{msg.text}</div>}

                      {/* BOT ANALYZE_CV -> MARKDOWN */}
                      {msg.sender === "bot" &&
                        msg.type === ClassificationType.ANALYZE_CV &&
                        msg.text && (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        )}

                      {/* BOT JOB LIST */}
                      {msg.sender === "bot" &&
                        msg?.jobs &&
                        msg?.jobs.length > 0 && (
                          <div>
                            {msg.text && <p className="mb-2">{msg.text}</p>}

                            <div>
                              {msg.jobs.map((job, jobIndex) => (
                                <div className="w-full p-4" key={jobIndex}>
                                  <FlexibleJobCard job={job} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-zinc-100 flex items-center border-t-1 rounded-b-lg mt-auto py-2 px-5 justify-between flex-row gap-3">
              <div className="flex-1 w-[100%]">{selectedFile?.name}</div>
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 flex-grow-0 cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload">
                  <ImageUp className="text-gray-500 hover:text-gray-700 w-5 text-primary cursor-pointer" />
                </label>
              </div>
              <input
                type="text"
                className="chatbot-input w-full py-2 px-4 outline-none text-[13px] bg-white rounded-xl "
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                value={userInput}
                placeholder="Nhập tin nhắn của bạn..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUserInput();
                  }
                }}
              />
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 flex-grow-0 cursor-pointer">
                {userInput != "" ? (
                  <SendHorizonal
                    className="text-gray-500 hover:text-gray-700 w-5 text-primary"
                    onClick={handleUserInput}
                  />
                ) : (
                  <Send
                    className="text-gray-500 hover:text-gray-700 w-5 text-primary"
                    // onClick={handleUserInput}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button onClick={() => setIsOpen(!isOpen)}>
        <img src={chatbotIcon} className="w-[40px] h-[40px]" />
      </Button>
    </div>
  );
}
