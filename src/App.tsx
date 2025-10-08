import { Outlet } from "react-router";
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
