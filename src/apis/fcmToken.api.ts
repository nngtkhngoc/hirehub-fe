import { requestFCMToken } from "@/config/firebase";
import { axiosClient } from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createFcmToken = async (userId: number) => {
  const fcmToken = await requestFCMToken();
  const res = await axiosClient.post(`${BASE_URL}/api/fcm-tokens`, {
    userId: userId,
    token: fcmToken,
  });

  return res.data;
};
