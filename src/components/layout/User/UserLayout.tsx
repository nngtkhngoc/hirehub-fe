import { Outlet } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const UserLayout = () => {
  return (
    <div className="relative">
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};
