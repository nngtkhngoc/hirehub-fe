import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Navbar = () => {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile sidebar */}
      <div className="block md:hidden">
        <Sidebar />
      </div>
    </>
  );
};
