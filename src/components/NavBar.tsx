import { Link, NavLink } from "react-router-dom";
import type { CSSProperties } from "react";
import Container from "./Container";

const LOGO =
  "https://davinciboardgame.com/wp-content/uploads/2023/01/Hy8uge6SCowHNV4QUwQ1_abBLok08iS03jz2W.png";

const headerInner: CSSProperties = {
  padding: "12px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "none",
};

const logoStyle: CSSProperties = { height: 36, width: "auto", display: "block" };
const brandTitle: CSSProperties = { color: "#111827", fontWeight: 800, fontSize: 18, lineHeight: 1.1, whiteSpace: "nowrap" };
const linkStyle: CSSProperties = { marginRight: 16, textDecoration: "none" };
const active: CSSProperties = { fontWeight: 700 };

export default function NavBar() {
  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 0 rgba(17,24,39,0.06)",
      }}
    >
      <Container>
        <div style={headerInner}>
          <Link to="/" style={brandStyle} aria-label="Home">
            <img src={LOGO} alt="Davinci Logo" style={logoStyle} />
            <span style={brandTitle}>Davinci Board Game Cafe Admin Panel</span>
          </Link>
          <nav>
            <NavLink to="/"   style={({ isActive }) => ({ ...linkStyle, ...(isActive ? active : {}) })}>Home</NavLink>
            <NavLink to="/users" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? active : {}) })}>Users</NavLink>
            <NavLink to="/posts" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? active : {}) })}>Posts</NavLink>
          </nav>
        </div>
      </Container>
    </header>
  );
}
