import { Outlet } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../ScrollToTop";
import { useProfile } from "@/hooks/useAuth";
import { Suspense } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Spinner } from "@/components/ui/spinner";

export const UserLayout = () => {
  const { data: user, isPending } = useProfile();
  const logout = useAuthStore((state) => state.logout);

  if (isPending)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner className="size-15 text-primary" />
      </div>
    );

  if (!user) {
    logout();
  }

  return (
    <Suspense fallback={<Spinner />}>
      <div className="relative">
        <Navbar />
        <Outlet />
        <Footer />
        <Toaster position="top-center" />
        <ScrollToTop />
      </div>
    </Suspense>
  );
};
