/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef, useMemo } from "react";
import type { UserProfile } from "@/types/Auth";
import { useStomp } from "@/hooks/useStomp";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChat, useChatList } from "@/hooks/useChat";
import type { Message } from "@/types/Chat";
import profile from "@/assets/illustration/profile.png";
import { Images, Send, SmilePlus } from "lucide-react";
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
    subscribeReactMessage,
    sendReact,
  } = useStomp();
  const { user } = useAuthStore();

  const { data: history, refetch } = useChat(
    parseInt(receiver?.id!),
    parseInt(user?.id!)
  );

  const { refetch: refetchChatList } = useChatList(
    user?.id ? parseInt(user.id) : null
  );
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  // SEND MSG
  useEffect(() => {
    if (!connected) return;
    const sub = subscribePrivateMessage(() => {
      refetch();
      refetchChatList();
    });
    return () => sub && sub.unsubscribe();
  }, [connected, receiver?.email, user?.email]);

  const handleSend = () => {
    const content = inputRef.current.value.trim();
    if (!content || !user?.email || !receiver?.email) return;

    sendPrivate({
      senderEmail: user?.email,
      receiverEmail: receiver?.email,
      content: content,
      type: "text",
    });
    inputRef.current.value = "";
    refetchChatList();
  };

  // REACT MSG
  useEffect(() => {
    if (!connected) return;

    const sub = subscribeReactMessage(() => {
      refetch();
      refetchChatList();
    });

    return () => sub?.unsubscribe();
  }, [connected]);

  const handleEmojiPicked = (emoji: string, msgId: string | undefined) => {
    if (!emoji || !user?.email || !receiver?.email) return;

    sendReact({
      userId: parseInt(user?.id!),
      messageId: msgId && parseInt(msgId),
      emoji,
    });
    setOpenPickerFor("");
  };

  useEffect(() => {
    if (!connected) return;

    const sub = subscribeSeenMessage(() => {
      refetch();
      refetchChatList();
    });

    return () => sub?.unsubscribe();
  }, [connected]);

  const isSeen = useMemo(() => {
    const seenUsers = messages[messages?.length - 1]?.seenUsers;

    if (seenUsers && seenUsers.length >= 0) {
      return seenUsers.some((user) => user?.id == receiver?.id);
    }

    return false;
  }, [receiver, user, messages]);

  const lastMsgRef = useRef<string | null>(null);

  useEffect(() => {
    if (!messages.length || !connected) return;

    const lastMsg = messages[messages.length - 1];

    if (
      lastMsg.sender?.email === receiver?.email &&
      lastMsg.id !== lastMsgRef.current
    ) {
      lastMsgRef.current = lastMsg.id ?? null;

      sendSeen({
        userId: parseInt(user?.id!),
        messageId: parseInt(lastMsg.id!),
      });
    }
  }, [messages, connected]);

  const [openPickerFor, setOpenPickerFor] = useState<string | null>(null);

  const togglePicker = (msgId?: string) => {
    if (openPickerFor === msgId) {
      setOpenPickerFor(null);
    } else {
      setOpenPickerFor(msgId || null);
    }
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    const isMine = lastMsg?.sender?.id === user?.id;

    if (isMine) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div className="w-full h-[580px] flex flex-col border border-zinc-300 rounded-xl bg-white overflow-hidden ">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm flex flex-col">
        {messages?.map((m, idx) => {
          const isMine = m?.sender?.email === user?.email;

          return (
            <div
              key={m?.id}
              className="flex flex-row items-start justify-start group relative"
            >
              <div
                className={`flex flex-col relative gap-2 ${
                  isMine ? "text-right ml-auto" : "text-left mr-auto"
                }`}
              >
                {/* Message bubble */}
                <div
                  className={`flex items-end gap-2 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMine && (
                    <img
                      src={receiver?.avatar || profile}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  {isMine && (
                    <button
                      onClick={() => togglePicker(m.id)}
                      className=" w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-100 transition hidden group-hover:flex cursor-pointer absolute -left-8"
                    >
                      <SmilePlus className="w-4 h-4" />
                    </button>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap break-words max-w-xs md:max-w-md ${
                      isMine
                        ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-br-none shadow-md"
                        : "bg-zinc-200 text-zinc-800 rounded-bl-none"
                    }`}
                  >
                    {m?.content}
                  </div>{" "}
                  {/* Hover emoji button */}
                  {!isMine && (
                    <button
                      onClick={() => togglePicker(m.id)}
                      className=" w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-100 transition hidden  group-hover:flex hover:cursor-pointer absolute -right-8"
                    >
                      <SmilePlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Seen emojis */}
                {m?.seenUsers?.length > 0 && (
                  <div
                    className={`flex flex-wrap gap-1 -mt-3  justify-end
                    }`}
                  >
                    {m.seenUsers.map((e, i) =>
                      e?.emoji ? (
                        <span
                          key={i}
                          className="w-6 h-6 text-lg bg-white border rounded-full shadow-sm flex items-center justify-center"
                        >
                          {e.emoji}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
                {/* Emoji picker */}
                {openPickerFor === m.id && (
                  <div
                    className={`absolute z-50 bottom-10 ${
                      isMine ? "right-0" : "left-0"
                    }`}
                  >
                    <Picker
                      onEmojiClick={(e) => handleEmojiPicked(e.emoji, m?.id)}
                      reactionsDefaultOpen={true}
                      style={{
                        transform: "scale(0.8)",
                        transformOrigin: "bottom right",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        borderRadius: "12px",
                      }}
                    />
                  </div>
                )}
                {/* Seen / Sent indicator */}
                <div className="absolute -bottom-5 right-0 text-[10px] text-zinc-400 flex items-end justify-end">
                  {idx === messages.length - 1 && isMine && (
                    <span>{isSeen ? "Đã xem" : "Đã gửi"}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-4 border-t border-zinc-200 flex items-center gap-3 bg-zinc-50 rounded-b-xl text-sm">
        <button className="p-2 border-zinc-200 border-1 hover:border-zinc-400 text-black rounded-full transition-all duration-500 cursor-pointer">
          <Images />
        </button>
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
