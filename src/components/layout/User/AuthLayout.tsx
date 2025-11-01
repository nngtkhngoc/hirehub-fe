import { Outlet, useNavigate } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import authbg from "@/assets/images/authbg.png";
import { useAuthStore } from "@/stores/useAuthStore";

export const AuthLayout = () => {
  const { user } = useAuthStore();

  const nav = useNavigate();
  if (user) {
    nav("/");
  }

  return (
    <div
      className="w-full bg-cover bg-center flex items-center justify-center lg:py-10 min-h-screen "
      style={{
        backgroundImage: `url(${authbg})`,
      }}
    >
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
};
