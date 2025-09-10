import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post} from "../types";
import { getUsers } from "../api/users";
import { getPosts } from "../api/posts";
import styles from "./Home.module.css";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [recent, setRecent] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [users, posts] = await Promise.all([
          getUsers(),
          getPosts(),
        ]);
        setUserCount(users.length);
        setPostCount(posts.length);
        // son eklenenler gibi göstermek için id'ye göre tersten ilk 5
        const lastFive = [...posts].sort((a, b) => b.id - a.id).slice(0, 5);
        setRecent(lastFive);
      } catch {
        setError("Unexpected error while loading dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section>
      <div className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            Manage users and posts using the shortcuts below.
          </p>
        </div>

        {/* Quick shortcuts */}
        <div className={styles.gridCards}>
          <Link to="/users" className={styles.cardLink}>
            👥 Users <span>→</span>
          </Link>
          <Link to="/posts" className={styles.cardLink}>
            📝 Posts <span>→</span>
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Users</div>
            <div className={styles.statValue}>{userCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Posts</div>
            <div className={styles.statValue}>{postCount}</div>
          </div>
        </div>

        {/* Recent posts */}
        <div className={styles.recentCard}>
          <div className={styles.recentHeader}>
            <h2 style={{ margin: 0 }}>Recent Posts</h2>
            <Link to="/posts" className={styles.btnGhost}>View all</Link>
          </div>
          <ul className={styles.recentList}>
            {recent.map((p) => (
              <li key={p.id} className={styles.recentItem}>
                <p className={styles.recentTitle}>{p.title}</p>
                <span className={styles.recentMeta}>ID #{p.id} · userId {p.userId}</span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className={styles.recentItem}>
                <span className={styles.recentMeta}>No posts yet.</span>
              </li>
            )}
          </ul>
          <div className={styles.actions} style={{ marginTop: 8 }}>
            <Link to="/posts" className={styles.btnPrimary}>+ New Post</Link>
            <Link to="/users" className={styles.btnGhost}>+ New User</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
