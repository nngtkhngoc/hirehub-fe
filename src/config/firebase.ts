// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const firebaseConfig = {
  apiKey: "AIzaSyBV-OBPd9BWLhiKzeioEZ46zgRBtICv2gY",
  authDomain: "hirehub-441e2.firebaseapp.com",
  projectId: "hirehub-441e2",
  storageBucket: "hirehub-441e2.firebasestorage.app",
  messagingSenderId: "795603324392",
  appId: "1:795603324392:web:fbca569c1a3d9f50fae85d",
  measurementId: "G-66DLVFQLRH",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  const permission = await Notification.requestPermission();
  console.log("Permission:", permission);

  if (permission !== "granted") return null;

  const registration = await navigator.serviceWorker.ready;

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  console.log("🔥 FCM TOKEN:", token);
  return token;
};
