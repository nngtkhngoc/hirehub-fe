import { Outlet } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../ScrollToTop";

export const UserLayout = () => {
  return (
    <div className="relative">
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster position="top-center" />
      <ScrollToTop />
    </div>
  );
};
