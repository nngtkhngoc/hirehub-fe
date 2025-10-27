import { Outlet } from "react-router";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../ScrollToTop";

export const UserLayout = () => {
  return (
    <div className="relative">
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </div>
  );
};
