import { Outlet } from "react-router";

import { Navbar } from "./components/layout/User/Navbar";
import { Footer } from "./components/layout/User/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
