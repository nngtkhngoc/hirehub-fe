/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import type { UserProfile } from "@/types/Auth";
import { useStomp } from "@/hooks/useStomp";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChat } from "@/hooks/useChat";
import type { Message } from "@/types/Chat";

export const Chatbox = ({
  receiver,
}: {
  receiver: UserProfile | undefined;
}) => {
  // user?.email: current user (string), receiver?.email: recipient user?.email
  const inputRef = useRef<any>(null);
  const { connected, subscribePrivate, sendPrivate } = useStomp();
  const { user } = useAuthStore();
  const { data: history, isLoading } = useChat(
    parseInt(receiver?.id!),
    parseInt(user?.id!)
  );
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (history) setMessages(history);
    console.log("chaof", messages);
  }, [history]);

  useEffect(() => {
    if (!connected) return;
    const sub = subscribePrivate((msg: any) => {
      if (
        (msg.senderEmail == receiver?.email &&
          msg.receiverEmail === user?.email) ||
        (msg.senderEmail == user?.email && msg.receiverEmail == receiver?.email)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => sub && sub.unsubscribe();
  }, [connected, receiver?.email, user?.email]);

  const handleSend = () => {
    const content = inputRef.current.value.trim();
    if (!content || !user?.email || !receiver?.email) return;

    if (!content) return;
    const payload = {
      senderEmail: user?.email,
      receiverEmail: receiver?.email,
      message: content,
    };
    sendPrivate(payload);
    inputRef.current.value = "";
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, width: 400 }}>
      <h3>
        Chat: {user?.email} ↔ {receiver?.email} (
        {connected ? "online" : "connecting..."})
      </h3>
      <div
        style={{
          height: 300,
          overflowY: "auto",
          border: "1px solid #eee",
          padding: 8,
        }}
      >
        {messages?.map((m, idx) => (
          <div
            key={idx}
            style={{
              textAlign: m?.sender?.email == user?.email ? "right" : "left",
              margin: "6px 0",
            }}
          >
            <div>
              <small>{m?.sender?.name}</small>
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 8,
                background: "#f1f1f1",
              }}
            >
              {m?.message}
            </div>
            <div>
              <small>{new Date(m?.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <input
          ref={inputRef}
          placeholder="Nhập tin nhắn..."
          style={{ width: "70%" }}
        />
        <button onClick={handleSend} style={{ marginLeft: 8 }}>
          Gửi
        </button>
      </div>
    </div>
  );
};
