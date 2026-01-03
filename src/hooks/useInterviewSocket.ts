/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useStomp } from "./useStomp";
import type { CreateInterviewMessageRequest } from "@/types/Interview";

export const useInterviewSocket = () => {
  const { connected, sendMessage, sendSeen, sendReact, subscribePrivateMessage, subscribeSeenMessage, subscribeReactMessage } = useStomp();

  // Send interview message
  const sendInterviewMessage = useCallback(
    (payload: CreateInterviewMessageRequest) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) {
        console.warn("STOMP not connected → cannot send.");
        return;
      }

      client.publish({
        destination: "/app/interview/message",
        body: JSON.stringify(payload),
      });
    },
    []
  );

  // Send interview question
  const sendInterviewQuestion = useCallback(
    (payload: CreateInterviewMessageRequest) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) {
        console.warn("STOMP not connected → cannot send.");
        return;
      }

      client.publish({
        destination: "/app/interview/question",
        body: JSON.stringify(payload),
      });
    },
    []
  );

  // Join interview room
  const joinInterviewRoom = useCallback(
    (roomCode: string, userId: number) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) {
        console.warn("STOMP not connected → cannot send.");
        return;
      }

      client.publish({
        destination: "/app/interview/join",
        body: JSON.stringify({ roomCode, userId }),
      });
    },
    []
  );

  // Leave interview room
  const leaveInterviewRoom = useCallback(
    (roomCode: string, userId: number) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) {
        console.warn("STOMP not connected → cannot send.");
        return;
      }

      client.publish({
        destination: "/app/interview/leave",
        body: JSON.stringify({ roomCode, userId }),
      });
    },
    []
  );

  // End interview
  const endInterview = useCallback(
    (roomCode: string, userId: number) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) {
        console.warn("STOMP not connected → cannot send.");
        return;
      }

      client.publish({
        destination: "/app/interview/end",
        body: JSON.stringify({ roomCode, userId }),
      });
    },
    []
  );

  // Subscribe to interview messages
  const subscribeInterviewMessage = useCallback(
    (callback: (msg: any) => void) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) return;

      return client.subscribe("/user/queue/interview-message", (frame: any) => {
        const body = JSON.parse(frame.body);
        callback(body);
      });
    },
    []
  );

  // Subscribe to interview questions
  const subscribeInterviewQuestion = useCallback(
    (callback: (msg: any) => void) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) return;

      return client.subscribe("/user/queue/interview-question", (frame: any) => {
        const body = JSON.parse(frame.body);
        callback(body);
      });
    },
    []
  );

  // Subscribe to join events
  const subscribeInterviewJoin = useCallback(
    (callback: (msg: any) => void) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) return;

      return client.subscribe("/user/queue/interview-join", (frame: any) => {
        const body = JSON.parse(frame.body);
        callback(body);
      });
    },
    []
  );

  // Subscribe to end events
  const subscribeInterviewEnd = useCallback(
    (callback: (msg: any) => void) => {
      const client = (window as any).stompClient;
      if (!client || !client.connected) return;

      return client.subscribe("/user/queue/interview-end", (frame: any) => {
        const body = JSON.parse(frame.body);
        callback(body);
      });
    },
    []
  );

  return {
    connected,
    sendInterviewMessage,
    sendInterviewQuestion,
    joinInterviewRoom,
    leaveInterviewRoom,
    endInterview,
    subscribeInterviewMessage,
    subscribeInterviewQuestion,
    subscribeInterviewJoin,
    subscribeInterviewEnd,
    // Re-export from useStomp for backward compatibility
    sendMessage,
    sendSeen,
    sendReact,
    subscribePrivateMessage,
    subscribeSeenMessage,
    subscribeReactMessage,
  };
};

