/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import type { UserProfile } from "@/types/Auth";
import { useStomp } from "@/hooks/useStomp";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChat } from "@/hooks/useChat";
import type { Message } from "@/types/Chat";
import profile from "@/assets/illustration/profile.png";
import { Send } from "lucide-react";

export const Chatbox = ({
  receiver,
}: {
  receiver: UserProfile | undefined;
}) => {
  const inputRef = useRef<any>(null);
  const { connected, subscribePrivate, sendPrivate } = useStomp();
  const { user } = useAuthStore();

  const { data: history } = useChat(
    parseInt(receiver?.id!),
    parseInt(user?.id!)
  );

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (history) setMessages(history);
    console.log(history);
  }, [history]);

  useEffect(() => {
    if (!connected) return;
    const sub = subscribePrivate((msg: any) => {
      console.log("hello", msg);
      if (
        (msg.senderEmail == receiver?.email &&
          msg.receiverEmail == user?.email) ||
        (msg.senderEmail == user?.email && msg.receiverEmail == receiver?.email)
      ) {
        const newMsg = {
          receiver,
          sender: user,
          createdAt: new Date().toISOString(),
          message: msg.message,
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    });
    return () => sub && sub.unsubscribe();
  }, [connected, receiver?.email, user?.email]);

  const handleSend = () => {
    const content = inputRef.current.value.trim();
    if (!content || !user?.email || !receiver?.email) return;

    sendPrivate({
      senderEmail: user?.email,
      receiverEmail: receiver?.email,
      message: content,
    });

    inputRef.current.value = "";
  };

  return (
    <div className="w-full h-full flex flex-col border border-zinc-300 rounded-xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 p-4 bg-zinc-50 rounded-t-xl ">
        <img
          src={receiver?.avatar || profile}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-800">{receiver?.name}</span>
          <span className="text-xs text-zinc-500">Đang trò chuyện</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((m, idx) => {
          const isMine = m?.sender?.email == user?.email;

          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isMine ? "ml-auto text-right" : "mr-auto text-left"
              }`}
            >
              <div
                className={`flex items-end gap-2 ${
                  isMine ? "justify-end flex-row" : "justify-start"
                }`}
              >
                {!isMine && (
                  <img
                    src={receiver?.avatar || profile}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap break-words w-fit max-w-[70%] ${
                    isMine
                      ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-br-none shadow-md"
                      : "bg-zinc-200 text-zinc-800 rounded-bl-none"
                  }`}
                >
                  {m?.message}
                </div>
              </div>

              {/* Thời gian */}
              <span className="text-[10px] text-zinc-400 mt-1">
                {new Date(m?.createdAt).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-200 flex items-center gap-3 bg-zinc-50 rounded-b-xl">
        <input
          ref={inputRef}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 rounded-full border border-zinc-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="p-2 bg-gradient-to-r from-purple-600 to-violet-900  hover:from-purple-800 hover:to-violet-900 text-white rounded-full hover:bg-blue-700 active:scale-95 transition cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
