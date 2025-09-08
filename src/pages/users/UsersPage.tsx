// src/pages/users/UsersPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users";
import Pagination from "../../components/Pagination";
import styles from "./UsersPage.module.css";

/** UI-only field (not from API) */
type Role = "Admin" | "User";

type UiUser = User & { role: Role };
type Draft = Omit<User, "id"> & { role: Role };

const defaultDraft: Draft = {
  name: "",
  username: "",
  email: "",
  role: "User",
};

export default function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // search
  const [q, setQ] = useState("");

  // form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Draft>(defaultDraft);

  // pagination
  const [page, setPage] = useState(1);        // 1-based
  const [pageSize, setPageSize] = useState(5); // 5 or 10

  useEffect(() => {
    (async () => {
      try {
        const raw = await getUsers();
        const withUi: UiUser[] = raw.map((u) => ({
          ...u,
          role: u.id % 3 === 0 ? "Admin" : "User", // demo role
        }));
        setUsers(withUi);
      } catch {
        setError("An unexpected error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filtering
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users.filter(
      (u) =>
        term.length === 0 ||
        u.id.toString().includes(term) ||
        u.name.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }, [users, q]);

  // reset to first page on filter change
  useEffect(() => {
    setPage(1);
  }, [filtered]);

  // page slice
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const visible = filtered.slice(start, end);

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
      alert("An error occurred while saving.");
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== id);

        // adjust page if we deleted the last item on the last page
        const term = q.trim().toLowerCase();
        const nextFiltered = next.filter(
          (u) =>
            term.length === 0 ||
            u.id.toString().includes(term) ||
            u.name.toLowerCase().includes(term) ||
            u.username.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        );
        const newTotalPages = Math.max(1, Math.ceil(nextFiltered.length / pageSize));
        if (page > newTotalPages) setPage(newTotalPages);

        return next;
      });
    } catch {
      alert("An error occurred while deleting.");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  const badgeClass = (role: Role) =>
    `${styles.badge} ${role === "Admin" ? styles.badgeAdmin : styles.badgeUser}`;

  return (
    <section>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div style={{ opacity: 0.9, fontWeight: 500 }}>Manage users in the system</div>
        <div className={styles.controls}>
          <button type="button" className={styles.btnGhost} onClick={() => navigate("/")}>
            ← Back to Admin Panel
          </button>
          <button type="button" className={styles.btnPrimary} onClick={startCreate}>
            + New User
          </button>
        </div>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h1 style={{ margin: 0 }}>User List</h1>
        </div>

        {/* Search under title */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <input
              placeholder="id, username, email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        {/* Form (create/update) */}
        {showForm && (
          <form onSubmit={onSubmit} className={styles.subCard}>
            <div className={styles.grid}>
              <label className={styles.labelCol}>
                <span>Full name</span>
                <input
                  required
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={styles.input}
                />
              </label>
              <label className={styles.labelCol}>
                <span>Username</span>
                <input
                  required
                  placeholder="e.g. janedoe"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className={styles.input}
                />
              </label>
              <label className={styles.labelCol}>
                <span>Email</span>
                <input
                  required
                  type="email"
                  placeholder="e.g. jane@domain.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={styles.input}
                />
              </label>
              <label className={styles.labelCol}>
                <span>Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                  className={styles.select}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>
            </div>
            <div className={styles.controls}>
              <button type="submit" className={styles.btnPrimary}>
                {editingId ? "Update User" : "Create User"}
              </button>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(defaultDraft);
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
                <th>ID</th>
                <th>Username</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Role</th>
                <th className={styles.actionsCol}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={badgeClass(u.role)}>{u.role}</span></td>
                  <td>
                    <div className={styles.controls}>
                      <button type="button" className={styles.btnSmall} onClick={() => startEdit(u)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.btnSmall} ${styles.btnSmallDanger}`}
                        onClick={() => onDelete(u.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
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
