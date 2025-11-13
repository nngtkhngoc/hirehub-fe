/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { UserProfile } from "@/types/Auth";
import { useStomp } from "@/hooks/useStomp";
import { useAuthStore } from "@/stores/useAuthStore";

export const Chatbox = ({
  receiver,
}: {
  receiver: UserProfile | undefined;
}) => {
  // user?.email: current user (string), receiver?.email: recipient user?.email
  const [messages, setMessages] = useState([]);
  const inputRef = useRef<any>(null);
  const { connected, subscribePrivate, sendPrivate } = useStomp();
  const { user } = useAuthStore();

  useEffect(() => {
    // load history
    axios
      .get(`/api/chat/history?userA=${user?.id}&userB=${receiver?.id}`)
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.error(err));
  }, [user?.isBanned, receiver?.id]);

  useEffect(() => {
    if (!connected) return;
    const sub = subscribePrivate((msg: any) => {
      // msg: { sender, recipient, content, timestamp }
      // push message only if sender==receiver?.email or recipient==receiver?.email
      if (
        (msg.sender === receiver?.email && msg.recipient === user?.email) ||
        (msg.sender === user?.email && msg.recipient === receiver?.email)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => sub && sub.unsubscribe();
  }, [connected, receiver?.email, user?.email]);

  const handleSend = () => {
    const content = inputRef.current.value.trim();
    if (!content) return;
    const payload = {
      sender: user?.email,
      recipient: receiver?.email,
      content,
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
        {/* {messages?.map((m, idx) => (
          <div
            key={idx}
            style={{
              textAlign: m?.sender === user?.email ? "right" : "left",
              margin: "6px 0",
            }}
          >
            <div>
              <small>{m?.sender}</small>
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 8,
                background: "#f1f1f1",
              }}
            >
              {m?.content}
            </div>
            <div>
              <small>{new Date(m?.timestamp).toLocaleString()}</small>
            </div>
          </div>
        ))} */}
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
