import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/config/firebase";

export const useFCMListener = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔥 FCM message:", payload);
    });

    console.log("🟢 FCM listener registered");

    return () => unsubscribe();
  }, []);
};
