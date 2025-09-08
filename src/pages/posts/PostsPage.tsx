import { useEffect, useMemo, useState } from "react";
import type { Post, User } from "../../types";
import { getPosts, createPost, deletePost, updatePost } from "../../api/posts";
import { getUsers } from "../../api/users";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import styles from "./PostsPage.module.css";

type Draft = Omit<Post, "id">;

export default function PostsPage() {
  const navigate = useNavigate();

  // data
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Draft>({ userId: 1, title: "", body: "" });

  // pagination
  const [page, setPage] = useState(1);          // 1-based
  const [pageSize, setPageSize] = useState(5); // 10 or 15

  // optional filter from URL (?userId=...)
  const [params] = useSearchParams();
  const userIdParam = Number(params.get("userId"));

  useEffect(() => {
    (async () => {
      try {
        const [p, u] = await Promise.all([getPosts(), getUsers()]);
        setPosts(p);
        setUsers(u);
        if (userIdParam && !Number.isNaN(userIdParam)) {
          setForm((f) => ({ ...f, userId: userIdParam }));
        }
      } catch {
        setError("Unexpected error while fetching posts.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdParam]);

  // keep list optionally filtered by userId from URL
  const filtered = useMemo(
    () => (userIdParam ? posts.filter((p) => p.userId === userIdParam) : posts),
    [posts, userIdParam]
  );

  // reset page when filtered changes
  useEffect(() => {
    setPage(1);
  }, [filtered]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const visible = filtered.slice(start, end);

  const startCreate = () => {
    setShowForm(true);
    setEditingId(null);
    setForm({ userId: userIdParam || 1, title: "", body: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (p: Post) => {
    setShowForm(true);
    setEditingId(p.id);
    setForm({ userId: p.userId, title: p.title, body: p.body });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updatePost(editingId, form);
        setPosts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...updated } : p)));
        setEditingId(null);
      } else {
        const created = await createPost(form);
        setPosts((prev) => [created, ...prev]);
      }
      setShowForm(false);
      setForm({ userId: userIdParam || 1, title: "", body: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("An error occurred while saving.");
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        const newTotal = (userIdParam ? next.filter((p) => p.userId === userIdParam) : next).length;
        const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
        if (page > newTotalPages) setPage(newTotalPages);
        return next;
      });
    } catch {
      alert("An error occurred while deleting.");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div style={{ opacity: 0.9, fontWeight: 500 }}>Manage posts in the system</div>
        <div className={styles.controls}>
          <button type="button" className={styles.btnGhost} onClick={() => navigate("/")}>
            ← Back to Admin Panel
          </button>
          <button type="button" className={styles.btnPrimary} onClick={startCreate}>
            + New Post
          </button>
        </div>
      </div>

      {/* Card */}
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.headerRow}>
          <h1 style={{ margin: 0 }}>Post List</h1>
        </div>

        {/* Form (create/update) */}
        {showForm && (
          <form onSubmit={onSubmit} className={styles.subCard}>
            <div className={styles.grid}>
              <label className={styles.labelCol}>
                <span>User ID</span>
                <select
                  value={form.userId}
                  onChange={(e) => setForm((f) => ({ ...f, userId: Number(e.target.value) }))}
                  className={styles.select}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      #{u.id} — {u.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.labelCol}>
                <span>Title</span>
                <input
                  required
                  placeholder="Add a clear, short title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className={styles.input}
                />
              </label>

              <label className={styles.labelCol}>
                <span>Content</span>
                <textarea
                  placeholder="Write a short content (optional)"
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  rows={3}
                  className={styles.input}
                  style={{ resize: "vertical" }}
                />
              </label>
            </div>

            <div className={styles.controls}>
              <button type="submit" className={styles.btnPrimary}>
                {editingId ? "Update Post" : "Create Post"}
              </button>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm({ userId: userIdParam || 1, title: "", body: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>ID</th>
                <th>Title</th>
                <th className={styles.actionsCol}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>#{p.userId}</td>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>
                    <div className={styles.controls}>
                      <button type="button" className={styles.btnSmall} onClick={() => startEdit(p)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.btnSmall} ${styles.btnSmallDanger}`}
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 16 }}>
                    No records.
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
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>
    </section>
  );
}
