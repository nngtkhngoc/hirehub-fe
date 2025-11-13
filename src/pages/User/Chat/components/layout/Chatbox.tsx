/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserProfile } from "@/types/Auth";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = BASE_URL + "/ws-chat";

export const Chatbox = ({
  receiver,
}: {
  receiver: UserProfile | undefined;
}) => {
  const [message, setMessage] = useState([]);
  const [text, setText] = useState("");

  return <div>Chatbox</div>;
};
