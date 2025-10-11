import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";

import { UserLayout } from "./components/layout/User/UserLayout.tsx";
import { HomePage } from "./pages/User/HomePage/HomePage.tsx";
import { AuthPage } from "./pages/User/Auth/AuthPage.tsx";
import { AuthLayout } from "./components/layout/User/AuthLayout.tsx";
import { VerifyPage } from "./pages/User/Verify/VerifyPage.tsx";
import { ForgetPasswordPage } from "./pages/User/ForgetPassword/ForgetPasswordPage.tsx";
import { ResetPasswpordPage } from "./pages/User/ResetPassword/ResetPasswordPage.tsx";
import { MailSentPage } from "./pages/User/MailSent/MailSentPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route
            path="/auth/forget-password"
            element={<ForgetPasswordPage />}
          />
          <Route path="/auth/reset-password" element={<ResetPasswpordPage />} />
          <Route path="/auth/mail-sent" element={<MailSentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
