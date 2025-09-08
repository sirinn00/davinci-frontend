import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users";

/** UI’ya özel alan (JSONPlaceholder’dan gelmiyor, local state’te tutulur) */
type Role = "Admin" | "Kullanıcı";

type UiUser = User & { role: Role };
type Draft = Omit<User, "id"> & { role: Role };

const defaultDraft: Draft = {
  name: "",
  username: "",
  email: "",
  role: "Kullanıcı",
};

export default function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState(""); // arama
  const [roleFilter, setRoleFilter] = useState<Role | "Tümü">("Tümü");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Draft>(defaultDraft);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getUsers();
        const withUi: UiUser[] = raw.map((u) => ({
          ...u,
          // deterministik atama (id’ye göre) – sadece UI için
          role: u.id % 3 === 0 ? "Admin" : "Kullanıcı",
        }));
        setUsers(withUi);
      } catch {
        setError("Kullanıcılar alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users.filter((u) => {
      const passQ =
        term.length === 0 ||
        u.id.toString().includes(term) ||               // ← ID de aranır
        u.name.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      const passRole = roleFilter === "Tümü" || u.role === roleFilter;
      return passQ && passRole;
    });
  }, [users, q, roleFilter]);

  const startCreate = () => {
    setShowForm(true);
    setEditingId(null);
    setForm(defaultDraft);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (u: UiUser) => {
    setShowForm(true);
    setEditingId(u.id);
    setForm({ name: u.name, username: u.username, email: u.email, role: u.role });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateUser(editingId, {
          name: form.name,
          username: form.username,
          email: form.email,
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === editingId ? { ...u, ...updated, role: form.role } : u))
        );
      } else {
        const created = await createUser({
          name: form.name,
          username: form.username,
          email: form.email,
        });
        setUsers((prev) => [{ ...created, role: form.role }, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(defaultDraft);
    } catch {
      alert("İşlem sırasında hata oluştu.");
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğine emin misin?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Silme sırasında hata oluştu.");
    }
  };

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section>
      {/* Üst bant */}
      <div style={topBar}>
        <div style={{ opacity: 0.9, fontWeight: 500 }}>Sistemdeki kullanıcıları yönetin</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" style={btnGhost} onClick={() => navigate("/")}>
            ← Yönetim Paneline Dön
          </button>
          <button type="button" style={btnPrimary} onClick={startCreate}>
            + Yeni Kullanıcı
          </button>
        </div>
      </div>

      {/* Başlık + Arama & Filtreler */}
      <div style={card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h1 style={{ margin: 0 }}>Kullanıcı Listesi</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={inputWrap}>
              <input
                placeholder="id, kullanıcı adı, email…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={input}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "Tümü")}
              style={select}
            >
              <option value="Tümü">Tüm Roller</option>
              <option value="Kullanıcı">Kullanıcı</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Form (create/update) */}
        {showForm && (
          <form onSubmit={onSubmit} style={{ ...subCard, marginBottom: 16 }}>
            <div style={grid}>
              <label style={labelCol}>
                <span>Ad Soyad</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={input}
                />
              </label>
              <label style={labelCol}>
                <span>Kullanıcı Adı</span>
                <input
                  required
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  style={input}
                />
              </label>
              <label style={labelCol}>
                <span>E-posta</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={input}
                />
              </label>
              <label style={labelCol}>
                <span>Rol</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                  style={select}
                >
                  <option value="Kullanıcı">Kullanıcı</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={btnPrimary}>
                {editingId ? "Güncelle" : "Ekle"}
              </button>
              <button
                type="button"
                style={btnGhost}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(defaultDraft);
                }}
              >
                İptal
              </button>
            </div>
          </form>
        )}

        {/* Tablo */}
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th>ID</th>                    {/* ← ID sütunu eklendi */}
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Rol</th>
                <th style={{ width: 160 }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>              {/* ← ID gösterimi */}
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge color={roleColor(u.role)}>{u.role}</Badge>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" style={btnSmall} onClick={() => startEdit(u)}>
                        Düzenle
                      </button>
                      <button type="button" style={btnSmallDanger} onClick={() => onDelete(u.id)}>
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---- Küçük UI yardımcıları ---- */
function Badge({
  color,
  children,
}: {
  color: { bg: string; text: string; ring: string };
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.ring}`,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
const roleColor = (r: Role) =>
  r === "Admin"
    ? { bg: "#f3e8ff", text: "#6b21a8", ring: "#e9d5ff" }
    : { bg: "#e0f2fe", text: "#075985", ring: "#bae6fd" };

/* ---- Stiller ---- */
const topBar: CSSProperties = {
  background: "#f5f3ff",
  border: "1px solid #e9e5ff",   // ← tırnak düzeltildi
  padding: "12px 16px",
  borderRadius: 12,
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const card: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  boxShadow: "0 1px 0 rgba(17,24,39,0.06)",
  padding: 16,
};

const subCard: CSSProperties = {
  background: "#fafafa",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
};

const table: CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const labelCol: CSSProperties = { display: "grid", gap: 6 };

const inputWrap: CSSProperties = { position: "relative", minWidth: 240 };
const input: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
};
const select: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
};

const btnPrimary: CSSProperties = {
  background: "#6d28d9",
  color: "#fff",
  border: "1px solid #6d28d9",
  borderRadius: 10,
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 600,
};
const btnGhost: CSSProperties = {
  background: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 600,
};
const btnSmall: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};
const btnSmallDanger: CSSProperties = {
  ...btnSmall,
  border: "1px solid #ef4444",
  color: "#b91c1c",
};
