import { Link, NavLink } from "react-router-dom";

const linkStyle: React.CSSProperties = { marginRight: 16, textDecoration: "none" };
const active: React.CSSProperties = { fontWeight: 700 };

export default function NavBar() {
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 18, color: "#111827", textDecoration: "none" }}>
          JSONPlaceholder Admin
        </Link>
        <nav>
          <NavLink to="/" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? active : {}) })}>Home</NavLink>
          <NavLink to="/users" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? active : {}) })}>Users</NavLink>
          <NavLink to="/posts" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? active : {}) })}>Posts</NavLink>
        </nav>
      </div>
    </header>
  );
}
