importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBV-OBPd9BWLhiKzeioEZ46zgRBtICv2gY",
  authDomain: "hirehub-441e2.firebaseapp.com",
  projectId: "hirehub-441e2",
  storageBucket: "hirehub-441e2.firebasestorage.app",
  messagingSenderId: "795603324392",
  appId: "1:795603324392:web:fbca569c1a3d9f50fae85d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  self.registration.showNotification(
    payload.notification?.title || "Notification",
    {
      body: payload.notification?.body,
    }
  );
});
