import { Outlet } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../ScrollToTop";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import Chatbot from "@/components/ui/User/Chatbot";
import { useAuthStore } from "@/stores/useAuthStore";
import { signIn } from "@/apis/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const UserLayout = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate } = useMutation({
    mutationFn: signIn,
    onSuccess: (data: any) => {
      console.log(data, "@@");
      setUser(data.data);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
  useEffect(() => {
    console.log("TRI LOGIN");
    mutate({ email: "", password: "" });
  }, []);
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
