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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useStomp } from "@/hooks/useStomp";
import type { GroupEventData } from "@/types/Chat";

export const UserLayout = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const { connected, subscribeGroupEvent } = useStomp();

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

  // Global group event subscription - để nhận thông báo khi được mời vào nhóm mới
  // dù đang ở bất kỳ trang nào trong ứng dụng
  useEffect(() => {
    if (!connected) return;

    const sub = subscribeGroupEvent((_eventData: GroupEventData) => {
      // Invalidate chat-list để cập nhật danh sách conversation
      queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    return () => sub?.unsubscribe();
  }, [connected, queryClient, subscribeGroupEvent]);

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
