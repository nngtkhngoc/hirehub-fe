/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef, useMemo } from "react";
import type { UserProfile } from "@/types/Auth";
import { useStomp } from "@/hooks/useStomp";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChat } from "@/hooks/useChat";
import type { Message } from "@/types/Chat";
import profile from "@/assets/illustration/profile.png";
import { Send } from "lucide-react";
import Picker from "emoji-picker-react";

export const Chatbox = ({
  receiver,
}: {
  receiver: UserProfile | undefined;
}) => {
  const inputRef = useRef<any>(null);
  const {
    connected,
    subscribePrivateMessage,
    sendPrivate,
    subscribeSeenMessage,
    sendSeen,
  } = useStomp();
  const { user } = useAuthStore();

  const { data: history } = useChat(
    parseInt(receiver?.id!),
    parseInt(user?.id!)
  );

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  useEffect(() => {
    if (!connected) return;
    const sub = subscribePrivateMessage((msg: any) => {
      let newMsg: Message = {
        receiver,
        sender: user,
        createdAt: new Date().toISOString(),
        message: msg.message,
        seenUsers: [],
      };

      if (
        msg.senderEmail == receiver?.email &&
        msg.receiverEmail == user?.email
      ) {
        newMsg = {
          receiver: user,
          sender: receiver,
          createdAt: new Date().toISOString(),
          message: msg.message,
          seenUsers: [],
        };
      }
      setMessages((prev) => [...prev, newMsg]);
    });
    return () => sub && sub.unsubscribe();
  }, [connected, receiver?.email, user?.email]);

  const isSeen = () => {
    const seenUsers = messages[messages?.length - 1]?.seenUsers;

    if (seenUsers && seenUsers.length >= 0) {
      return seenUsers.some((user) => user.id == receiver?.id);
    }

    return false;
  };

  useEffect(() => {
    if (!connected) return;

    const sub = subscribeSeenMessage((messageId) => {
      setMessages((prev) =>
        prev.map((m) => (m?.id == messageId ? { ...m, seen: true } : m))
      );
    });

    return () => sub?.unsubscribe();
  }, [connected]);

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

  useEffect(() => {
    if (!messages.length || !connected) return;

    const lastMsg = messages[messages.length - 1];

    if (lastMsg?.sender?.email == receiver?.email) {
      sendSeen({
        userId: parseInt(user?.id!),
        messageId: lastMsg?.id && parseInt(lastMsg.id),
      });
    }
  }, [messages, connected]);

  console.log("outside", messages);
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full  h-[550px] flex flex-col border border-zinc-300 rounded-xl bg-white ">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 p-4 bg-zinc-50 rounded-t-xl h-[62px]">
        <img
          src={receiver?.avatar || profile}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-800">{receiver?.name}</span>
          <span className="text-xs text-zinc-500">Đang trò chuyện</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm  overflow-y-scroll flex flex-col">
        {/* Messages */}
        {messages?.map((m, idx) => {
          const isMine = m?.sender?.email == user?.email;

          return (
            <div
              key={m?.id}
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
                  className={`px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap break-words w-fit ${
                    isMine
                      ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-br-none shadow-md"
                      : "bg-zinc-200 text-zinc-800 rounded-bl-none"
                  }`}
                >
                  {m?.message}
                </div>
              </div>
              <div className="text-[10px] text-zinc-400 mt-1 flex-row flex items-end justify-end">
                {idx == messages.length - 1 && isMine && (
                  <span>{isSeen ? "Đã xem" : "Đã gửi"}</span>
                )}
              </div>

              {/* <span className="text-[10px] text-zinc-400 mt-1">
                {new Date(m?.createdAt).toLocaleString()}
              </span> */}
            </div>
          );
        })}
      </div>
      {/* Input */}
      <div
        className="p-4 border-t border-zinc-200 flex items-center gap-3 bg-zinc-50 rounded-b-xl text-sm"
        ref={messageEndRef}
      >
        <input
          ref={inputRef}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 rounded-full border border-zinc-300 focus:outline-none bg-white focus:ring-1 focus:ring-primary focus:border-transparent"
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
