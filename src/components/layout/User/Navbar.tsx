import { useEffect, useState } from "react";

import { Sidebar } from "./Sidebar";
import { NotificationList } from "./NotificationList";
import { Header } from "./Header";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed w-screen top-0 z-50 transition-all duration-300  ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* Desktop header */}
      <div className="hidden md:block">
        <Header />
      </div>

      <NotificationList />

      {/* Mobile sidebar */}
      <div className="block md:hidden">
        <Sidebar />
      </div>
    </div>
  );
};
