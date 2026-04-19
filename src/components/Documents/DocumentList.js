import React, { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../../services/documentService";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.dl-wrap { min-height: calc(100vh - 60px); padding: 36px 40px 60px; background: var(--bg); }
.dl-inner { max-width: 800px; margin: 0 auto; }

.dl-header {
  display: flex; align-items: flex-end;
  justify-content: space-between; gap: 20px; flex-wrap: wrap;
  margin-bottom: 28px; padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.dl-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent2); margin-bottom: 8px; }
.dl-title { font-size: 32px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; line-height: 1.1; }
.dl-count { font-size: 12px; color: var(--muted); margin-top: 5px; }
.dl-count b { color: var(--accent2); font-weight: 700; font-size: 14px; }

.dl-search-box {
  display: flex; align-items: center; gap: 10px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 9px; padding: 0 14px; height: 40px;
  transition: border-color 0.2s;
}
.dl-search-box:focus-within { border-color: var(--accent); }
.dl-search-box svg { color: var(--muted); flex-shrink: 0; }
.dl-search-input { background: none; border: none; outline: none; font-family: 'Space Grotesk', sans-serif; font-size: 13px; color: var(--ink); width: 220px; }
.dl-search-input::placeholder { color: var(--muted2); }

.dl-list { display: flex; flex-direction: column; gap: 6px; }

.dl-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--card-r);
  transition: all 0.2s; cursor: default;
  animation: fadeUp 0.3s ease both;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.dl-item:hover { border-color: var(--accent); background: var(--surface2); transform: translateY(-1px); }
.dl-item.deleting { opacity: 0; transform: translateX(14px); transition: all 0.3s ease; }

.dl-item-icon {
  width: 42px; height: 42px;
  background: var(--accent-glow); border: 1px solid var(--accent-border);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--accent);
}
.dl-item-body { flex: 1; min-width: 0; }
.dl-item-name { font-size: 14px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
.dl-item-meta { display: flex; align-items: center; gap: 8px; }
.dl-ext {
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  background: var(--surface3); color: var(--accent2);
  padding: 2px 8px; border-radius: 4px;
}
.dl-date { font-size: 11px; color: var(--muted); }

.dl-actions { display: flex; gap: 6px; opacity: 0; transition: opacity 0.2s; flex-shrink: 0; }
.dl-item:hover .dl-actions { opacity: 1; }

.dl-btn-action {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 6px;
  font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600;
  letter-spacing: 0.04em; border: 1px solid var(--border);
  background: var(--surface3); cursor: pointer;
  color: var(--muted); transition: all 0.18s;
}
.dl-btn-action.view:hover { border-color: var(--accent); color: var(--accent2); background: var(--accent-glow); }
.dl-btn-action.delete { color: var(--red); border-color: var(--red-border); background: var(--red-pale); }
.dl-btn-action.delete:hover { background: rgba(239,68,68,0.14); border-color: rgba(239,68,68,0.5); }

.dl-empty { text-align: center; padding: 80px 20px; }
.dl-empty-ico { color: var(--surface3); margin: 0 auto 18px; display: block; }
.dl-empty-title { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
.dl-empty-sub { font-size: 13px; color: var(--muted); }

.dl-loading { display: flex; flex-direction: column; align-items: center; padding: 80px 0; gap: 14px; }
.dl-spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.dl-loading-text { font-size: 12px; color: var(--muted); letter-spacing: 0.05em; }

.dl-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border); font-size: 11px; color: var(--muted2); }

/* Modal */
.dl-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  z-index: 200; display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.dl-modal {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--card-r); width: 90%; max-width: 380px; padding: 36px;
  position: relative; animation: scaleIn 0.22s ease;
  border-top: 3px solid var(--red);
}
@keyframes scaleIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.dl-modal-title { font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.dl-modal-text { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 26px; }
.dl-modal-text strong { color: var(--ink); font-weight: 600; }
.dl-modal-actions { display: flex; gap: 10px; }
.dl-modal-cancel {
  flex: 1; padding: 12px; background: none;
  border: 1px solid var(--border); border-radius: 8px;
  font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--muted); cursor: pointer; transition: all 0.18s;
}
.dl-modal-cancel:hover { border-color: var(--border-2); color: var(--ink); }
.dl-modal-delete {
  flex: 1; padding: 12px;
  background: var(--red); border: 1px solid var(--red); border-radius: 8px;
  font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: #fff; cursor: pointer; transition: all 0.18s;
}
.dl-modal-delete:hover { background: #c53030; border-color: #c53030; }
`;

const getExt = (name = "") => name.split(".").pop()?.toUpperCase() || "FILE";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try { const res = await getDocuments(); setDocuments(res.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setTimeout(async () => {
      await deleteDocument(id);
      setConfirmId(null); setDeletingId(null); fetchDocs();
    }, 300);
  };

  const filtered = documents.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));
  const confirmDoc = documents.find(d => d.id === confirmId);

  return (
    <>
      <style>{styles}</style>
      <div className="dl-wrap">
        <div className="dl-inner">
          <div className="dl-header">
            <div>
              <div className="dl-eyebrow">Document Vault</div>
              <h2 className="dl-title">Your Documents</h2>
              <p className="dl-count"><b>{documents.length}</b> files stored</p>
            </div>
            <div className="dl-search-box">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input className="dl-search-input" type="text" placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="dl-loading">
              <div className="dl-spinner" />
              <span className="dl-loading-text">Loading documents…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="dl-empty">
              <svg className="dl-empty-ico" width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="10" y="8" width="44" height="48" rx="2"/>
                <path d="M22 24h20M22 32h20M22 40h12"/>
              </svg>
              <p className="dl-empty-title">{search ? "No results found" : "No documents yet"}</p>
              <p className="dl-empty-sub">{search ? `Nothing matches "${search}"` : "Upload your first document to get started"}</p>
            </div>
          ) : (
            <div className="dl-list">
              {filtered.map((doc, i) => (
                <div key={doc.id} className={`dl-item${deletingId === doc.id ? " deleting" : ""}`} style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="dl-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="dl-item-body">
                    <div className="dl-item-name">{doc.name}</div>
                    <div className="dl-item-meta">
                      <span className="dl-ext">{getExt(doc.name)}</span>
                      <span className="dl-date">{fmtDate(doc.created_at)}</span>
                    </div>
                  </div>
                  <div className="dl-actions">
                    <button className="dl-btn-action view">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </button>
                    <button className="dl-btn-action delete" onClick={() => setConfirmId(doc.id)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && documents.length > 0 && (
            <div className="dl-footer">
              <span>Showing {filtered.length} of {documents.length} documents</span>
              <span>QuestionForge · v1.0</span>
            </div>
          )}
        </div>
      </div>

      {confirmId && (
        <div className="dl-overlay" onClick={() => setConfirmId(null)}>
          <div className="dl-modal" onClick={e => e.stopPropagation()}>
            <h3 className="dl-modal-title">Delete Document?</h3>
            <p className="dl-modal-text">
              You're about to permanently delete <strong>"{confirmDoc?.name}"</strong>. This action cannot be undone.
            </p>
            <div className="dl-modal-actions">
              <button className="dl-modal-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="dl-modal-delete" onClick={() => handleDelete(confirmId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentList;
