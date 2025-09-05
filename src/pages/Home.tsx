import { Link } from "react-router-dom";


export default function Home() {
  return (
    <section>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Home</h1>
      <p style={{ marginBottom: 16 }}>Users ve Posts sayfalarına geçerek CRUD işlemleri yapabilirsin.</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Link to="/users" style={card}>👥 Users</Link>
        <Link to="/posts" style={card}>📝 Posts</Link>
      </div>
    </section>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  textDecoration: "none",
  color: "#111827",
  fontWeight: 600,
};
