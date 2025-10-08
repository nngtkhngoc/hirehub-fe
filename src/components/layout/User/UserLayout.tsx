import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const UserLayout = () => {
  return (
    <div className="relative">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
