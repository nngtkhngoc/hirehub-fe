import { Outlet } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../ScrollToTop";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import Chatbot from "@/components/ui/User/Chatbot";

export const UserLayout = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="relative">
        <Navbar />
        <Outlet />
        <Footer />
        <Toaster position="top-center" />
        <ScrollToTop />
        <Chatbot />
      </div>
    </Suspense>
  );
};
