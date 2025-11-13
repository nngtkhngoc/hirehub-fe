/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = BASE_URL + "/ws";

export const useStomp = () => {
  const [connected, setConnected] = useState(false);

  const clientRef = useRef<any>(null); // Tham chiếu tới client STOMP để không bị tạo nhiều client khi component re-render
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("error", str),
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });

    stompClient.onStompError = (frame) => console.error("Broker error", frame);

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [SOCKET_URL]);

  const subscribePrivate = (callback: any) => {
    if (!clientRef.current || !clientRef.current.connected) return;
    // subscribe user destination - server sends to /user/{username}/queue/messages
    const sub = clientRef.current.subscribe(
      "/user/queue/messages",
      (msg: any) => {
        const body = JSON.parse(msg.body);
        console.log("Received:", msg.body);

        callback && callback(body);
      }
    );
    return sub;
  };

  const sendPrivate = (payload: any) => {
    if (!clientRef.current || !clientRef.current.connected) return;
    clientRef.current.publish({
      destination: "/app/chat/private",
      body: JSON.stringify(payload),
    });
  };

  return { connected, subscribePrivate, sendPrivate };
};
