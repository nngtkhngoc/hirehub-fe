import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";

import { UserLayout } from "./components/layout/User/UserLayout.tsx";
import { HomePage } from "./pages/User/HomePage/HomePage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
