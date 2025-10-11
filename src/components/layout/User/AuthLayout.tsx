import authbg from "@/assets/images/authbg.png";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div
      className="w-full bg-cover bg-center flex items-center justify-center lg:py-10 min-h-screen"
      style={{
        backgroundImage: `url(${authbg})`,
      }}
    >
      <Outlet />
    </div>
  );
};
