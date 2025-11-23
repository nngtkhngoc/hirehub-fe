/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = BASE_URL + "/ws";

export const useStomp = () => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  // INIT STOMP CLIENT
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log("[STOMP]", msg),

      onConnect: () => {
        setConnected(true);
        console.log("STOMP Connected");
      },

      onDisconnect: () => {
        setConnected(false);
        console.log("STOMP Disconnected");
      },
    });

    stompClient.onStompError = (frame) => console.error("[STOMP ERROR]", frame);

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // GENERIC SEND
  const safeSend = useCallback((destination: string, payload: any) => {
    const client = clientRef.current;

    if (!client || !client.connected) {
      console.warn("STOMP not connected → cannot send.");
      return;
    }

    client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }, []);

  // SEND MESSAGE
  const sendPrivate = useCallback(
    (payload: any) => safeSend("/app/chat/private", payload),
    [safeSend]
  );

  // SEND SEEN EVENT
  const sendSeen = useCallback(
    (payload: { userId: number; messageId: number | "" | undefined }) =>
      safeSend("/app/message/seen", payload),
    [safeSend]
  );

  // SEND REACT EVENT
  const sendReact = useCallback(
    (payload: {
      userId: number;
      messageId: number | "" | undefined;
      emoji: string;
    }) => safeSend("/app/message/react", payload),
    [safeSend]
  );

  // SUBSCRIBE TO PRIVATE MESSAGES
  const subscribePrivateMessage = useCallback(
    (callback: (msg: any) => void) => {
      const client = clientRef.current;
      if (!client || !client.connected) return;

      return client.subscribe("/user/queue/messages", (frame) => {
        const body = JSON.parse(frame.body);
        callback(body);
      });
    },
    []
  );

  // SUBSCRIBE TO SEEN EVENT
  const subscribeSeenMessage = useCallback(
    (callback: (messageId: number | undefined) => void) => {
      const client = clientRef.current;
      if (!client || !client.connected) return;

      return client.subscribe("/user/queue/message-seen", (frame) => {
        const msgId = JSON.parse(frame.body);
        callback(msgId);
      });
    },
    []
  );

  // SUBSCRIBE TO REACT EVENT
  const subscribeReactMessage = useCallback(
    (callback: (messageData: any) => void) => {
      const client = clientRef.current;
      if (!client || !client.connected) return;

      return client.subscribe("/user/queue/message-react", (frame) => {
        try {
          const data = JSON.parse(frame.body);
          console.log("Raw frame.body:", frame.body);
          console.log("Parsed data:", data);
          callback(data);
        } catch (err) {
          console.error("Failed to parse react message:", err, frame.body);
        }
      });
    },
    []
  );

  return {
    connected,
    sendPrivate,
    sendSeen,
    sendReact,
    subscribePrivateMessage,
    subscribeSeenMessage,
    subscribeReactMessage,
  };
};
