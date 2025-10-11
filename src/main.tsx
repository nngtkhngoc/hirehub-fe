import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";

import { UserLayout } from "./components/layout/User/UserLayout.tsx";
import { HomePage } from "./pages/User/HomePage/HomePage.tsx";
import { AuthPage } from "./pages/User/Auth/AuthPage.tsx";
import { AuthLayout } from "./components/layout/User/AuthLayout.tsx";
import { VerifyPage } from "./pages/User/Verify/components/VerifyPage.tsx";

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
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
