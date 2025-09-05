import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import Container from "./components/Container";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f9" }}>
      <NavBar />
      <main style={{ padding: "24px 0" }}>
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
