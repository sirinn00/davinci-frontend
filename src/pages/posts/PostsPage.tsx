import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Post, User } from "../../types";
import { getPosts, createPost, deletePost, updatePost } from "../../api/posts";
import { getUsers } from "../../api/users";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";

type Draft = Omit<Post, "id">;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Draft>({ userId: 1, title: "", body: "" });

  // Pagination
  const [page, setPage] = useState(1);         // 1-based
  const [pageSize, setPageSize] = useState(10); // 10 veya 15

  const [params] = useSearchParams();
  const userIdParam = Number(params.get("userId"));

  useEffect(() => {
    (async () => {
      try {
        const [p, u] = await Promise.all([getPosts(), getUsers()]);
        setUsers(u);
        setPosts(p);
        if (userIdParam && !Number.isNaN(userIdParam)) {
          setForm(f => ({ ...f, userId: userIdParam }));
        }
      } catch {
        setError("Beklenmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdParam]);

  // Users sayfasından “Postlarını Gör” ile gelindiyse filtre uygula
  const filtered = useMemo(
    () => (userIdParam ? posts.filter(p => p.userId === userIdParam) : posts),
    [posts, userIdParam]
  );

  // Filtre değişince sayfayı başa al
  useEffect(() => {
    setPage(1);
  }, [filtered]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const visible = filtered.slice(start, end);

  const userName = (uid: number) =>
    users.find(u => u.id === uid)?.name ?? `User #${uid}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updatePost(editingId, form);
        setPosts(prev =>
          prev.map(p => (p.id === editingId ? { ...p, ...updated } : p))
        );
        setEditingId(null);
      } else {
        const created = await createPost(form);
        setPosts(prev => [created, ...prev]);
      }
      setForm({ userId: userIdParam || 1, title: "", body: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("İşlem sırasında hata oluştu.");
    }
  };

  const onEdit = (p: Post) => {
    setEditingId(p.id);
    setForm({ userId: p.userId, title: p.title, body: p.body });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: number) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    try {
      await deletePost(id);
      setPosts(prev => {
        const next = prev.filter(p => p.id !== id);
        // Sayfa dışına düşmeyi engelle
        const newTotal = (userIdParam ? next.filter(p => p.userId === userIdParam) : next).length;
        const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
        if (page > newTotalPages) setPage(newTotalPages);
        return next;
      });
    } catch {
      alert("Silme sırasında hata oluştu.");
    }
  };

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p style={{ color: "crimson" }}>Hata: {error}</p>;

  return (
    <section>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Posts</h1>

      {/* Form */}
      <form onSubmit={onSubmit} style={formStyle}>
        <h2 style={{ marginTop: 0 }}>{editingId ? "Postu Güncelle" : "Yeni Post"}</h2>
        <div style={grid}>
          <label>
            <span>Kullanıcı</span>
            <select
              value={form.userId}
              onChange={e => setForm(f => ({ ...f, userId: Number(e.target.value) }))}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Başlık</span>
            <input
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </label>
          <label>
            <span>İçerik</span>
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              rows={3}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={btnPrimary}>{editingId ? "Güncelle" : "Ekle"}</button>
          {editingId && (
            <button
              type="button"
              style={btnGhost}
              onClick={() => {
                setEditingId(null);
                setForm({ userId: userIdParam || 1, title: "", body: "" });
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
              <th>User</th>
              <th>Title</th>
              <th style={{ width: 200 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{userName(p.userId)} (#{p.userId})</td>
                <td>{p.title}</td>
                <td>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => onEdit(p)} style={btnSmall}>Düzenle</button>
                    <button type="button" onClick={() => onDelete(p.id)} style={btnSmallDanger}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 16 }}>
                  Kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 12 }}>
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[10, 15]}
        />
      </div>
    </section>
  );
}

const formStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
};
const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  marginBottom: 12,
};
const table: CSSProperties = {
  width: "100%",
  background: "#fff",
  borderCollapse: "collapse",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};
const btnPrimary: CSSProperties = {
  background: "#111827",
  color: "#fff",
  border: "1px solid #111827",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};
const btnGhost: CSSProperties = {
  background: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};
const btnSmall: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};
const btnSmallDanger: CSSProperties = {
  ...btnSmall,
  border: "1px solid #ef4444",
  color: "#b91c1c",
};
