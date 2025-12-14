import { Outlet } from "react-router";

import { Navbar } from "./components/layout/User/Navbar";
import { Footer } from "./components/layout/User/Footer";

import { useFCMListener } from "./hooks/useFCMListener";

function App() {
  useFCMListener();
  console.log("hello");

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
