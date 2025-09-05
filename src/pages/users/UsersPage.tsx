import { useEffect, useMemo, useState } from "react";
import type { User } from "../../types";
import { createUser, deleteUser, getUsers, updateUser } from "../../api/users";
import { useNavigate } from "react-router-dom";

type Draft = Omit<User, "id">;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Draft>({ name: "", username: "", email: "" });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (e) {
        setError("Beklenmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const title = useMemo(
    () => (editingId ? "Kullanıcıyı Güncelle" : "Yeni Kullanıcı"),
    [editingId]
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateUser(editingId, form);
        setUsers(prev => prev.map(u => (u.id === editingId ? { ...u, ...updated } : u)));
        setEditingId(null);
      } else {
        const created = await createUser(form);
        setUsers(prev => [created, ...prev]);
      }
      setForm({ name: "", username: "", email: "" });
    } catch {
      alert("İşlem sırasında hata oluştu.");
    }
  };

  const onEdit = (u: User) => {
    setEditingId(u.id);
    setForm({ name: u.name, username: u.username, email: u.email });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: number) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert("Silme sırasında hata oluştu.");
    }
  };

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p style={{ color: "crimson" }}>Hata: {error}</p>;

  return (
    <section>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Users</h1>

      {/* Form */}
      <form onSubmit={onSubmit} style={formStyle}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <div style={grid}>
          <label>
            <span>Ad Soyad</span>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label>
            <span>Kullanıcı Adı</span>
            <input
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            />
          </label>
          <label>
            <span>E-posta</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={btnPrimary}>
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button
              type="button"
              style={btnGhost}
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", username: "", email: "" });
              }}
            >
              İptal
            </button>
          )}
        </div>
      </form>

      {/* Liste */}
      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th>Username</th>
              <th>Email</th>
              <th style={{ width: 220 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => onEdit(u)} style={btnSmall}>Düzenle</button>
                    <button onClick={() => onDelete(u.id)} style={btnSmallDanger}>Sil</button>
                    <button
                      onClick={() => navigate(`/posts?userId=${u.id}`)}
                      style={btnSmallGhost}
                    >
                      Postlarını Gör
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                  Kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const formStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
};
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  marginBottom: 12,
};
const table: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  borderCollapse: "collapse",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};
const btnPrimary: React.CSSProperties = {
  background: "#111827",
  color: "#fff",
  border: "1px solid #111827",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  background: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};
const btnSmall: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};
const btnSmallDanger: React.CSSProperties = {
  ...btnSmall,
  border: "1px solid #ef4444",
  color: "#b91c1c",
};
const btnSmallGhost: React.CSSProperties = { ...btnSmall, opacity: 0.9 };
