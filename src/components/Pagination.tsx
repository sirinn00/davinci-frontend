import React from "react";

type Props = {
  total: number;
  page: number;     
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange?: (s: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 15, 20],
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const go = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    if (clamped !== page) onPageChange(clamped);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btn: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
  };

  const btnActive: React.CSSProperties = {
    ...btn,
    fontWeight: 700,
    borderColor: "#111827",
  };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      {onPageSizeChange && (
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Sayfa boyutu:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button style={btn} onClick={() => go(1)} disabled={page === 1}>« İlk</button>
        <button style={btn} onClick={() => go(page - 1)} disabled={page === 1}>‹ Önceki</button>

        {pages.map((p) => (
          <button
            key={p}
            style={p === page ? btnActive : btn}
            onClick={() => go(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button style={btn} onClick={() => go(page + 1)} disabled={page === totalPages}>Sonraki ›</button>
        <button style={btn} onClick={() => go(totalPages)} disabled={page === totalPages}>Son »</button>
      </div>

      <span style={{ opacity: 0.75 }}>
        Toplam {total} kayıt • {page}/{totalPages}
      </span>
    </div>
  );
}
