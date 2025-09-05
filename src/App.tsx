import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f9" }}>
      <NavBar />
      <main style={{ width: "100%", padding: "24px 16px" }}>
        <Outlet />
      </main>
    </div>
  );
}

