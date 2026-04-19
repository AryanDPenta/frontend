import React from "react";

const DocumentItem = ({ doc, onDelete }) => {
  const getExt = (name = "") => name.split(".").pop()?.toUpperCase() || "FILE";
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 18px",
    background: "#fff",
    border: "1px solid #e5e5e2",
    marginBottom: "2px",
    transition: "box-shadow 0.2s, border-color 0.2s",
  };

  const iconStyle = {
    width: "38px",
    height: "38px",
    background: "rgba(255,92,0,0.06)",
    border: "1px solid rgba(255,92,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "#FF5C00",
  };

  const extStyle = {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: "#eeede8",
    border: "1px solid #e5e5e2",
    padding: "2px 7px",
    color: "#0a0a0a",
  };

  const deleteBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    border: "1px solid rgba(197,48,48,0.2)",
    background: "rgba(197,48,48,0.04)",
    cursor: "pointer",
    color: "#c53030",
    transition: "all 0.18s",
  };

  return (
    <div style={itemStyle}>
      <div style={iconStyle}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 500, color: "#0a0a0a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "3px" }}>
          {doc.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={extStyle}>{getExt(doc.name)}</span>
          <span style={{ fontSize: "11px", fontWeight: 300, color: "#777770" }}>{fmtDate(doc.created_at)}</span>
        </div>
      </div>
      <button style={deleteBtnStyle} onClick={() => onDelete(doc.id)}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        </svg>
        Delete
      </button>
    </div>
  );
};

export default DocumentItem;
