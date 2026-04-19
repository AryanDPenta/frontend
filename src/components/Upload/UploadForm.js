import React, { useState, useRef } from "react";
import { uploadDocument } from "../../services/documentService";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.uf-wrap {
  min-height: calc(100vh - 60px);
  display: flex; align-items: center; justify-content: center;
  padding: 40px 20px;
  background: var(--bg);
}
.uf-card {
  width: 100%; max-width: 480px;
}
.uf-eyebrow {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent2); margin-bottom: 10px;
}
.uf-title {
  font-size: 34px; font-weight: 700;
  color: var(--ink); margin-bottom: 8px;
  line-height: 1.1; letter-spacing: -0.5px;
}
.uf-sub {
  font-size: 13px; font-weight: 400;
  color: var(--muted); margin-bottom: 28px; line-height: 1.65;
}
.uf-zone {
  border: 1.5px dashed var(--border-2);
  border-radius: var(--card-r);
  padding: 52px 24px; text-align: center;
  cursor: pointer; background: var(--surface);
  transition: all 0.2s; margin-bottom: 14px;
}
.uf-zone:hover, .uf-zone.drag { border-color: var(--accent); background: var(--accent-glow); }
.uf-zone.has-file { border-style: solid; border-color: var(--accent); background: var(--accent-glow); }
.uf-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.uf-zone-wrap { position: relative; }
.uf-icon-box {
  width: 52px; height: 52px;
  background: var(--accent-glow);
  border: 1px solid var(--accent-border);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 14px; color: var(--accent);
}
.uf-zone-main { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 5px; }
.uf-zone-hint { font-size: 12px; color: var(--muted); }
.uf-zone-hint span { color: var(--accent2); cursor: pointer; }

.uf-file-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 9px; margin-bottom: 14px;
  animation: slideDown 0.25s ease;
}
@keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.uf-file-ico {
  width: 34px; height: 34px;
  background: var(--accent); border-radius: 7px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.uf-file-name { flex: 1; font-size: 12px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.uf-file-size { font-size: 11px; color: var(--muted); flex-shrink: 0; }
.uf-rm { background: none; border: none; cursor: pointer; color: var(--muted); display: flex; align-items: center; padding: 4px; transition: color 0.15s; }
.uf-rm:hover { color: var(--red); }

.uf-btn {
  width: 100%; padding: 15px;
  background: var(--accent); color: #fff; border: none;
  border-radius: var(--btn-r);
  font-size: 13px; font-weight: 700; letter-spacing: 0.04em;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.uf-btn:hover:not(:disabled) { background: #6d4ee0; transform: translateY(-1px); }
.uf-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

.uf-progress { height: 3px; background: var(--border); border-radius: 2px; margin-top: 12px; overflow: hidden; }
.uf-progress-fill { height: 100%; background: var(--accent); border-radius: 2px; animation: prog 1.6s ease-in-out infinite; }
@keyframes prog { 0% { width: 0%; margin-left: 0%; } 50% { width: 70%; margin-left: 15%; } 100% { width: 0%; margin-left: 100%; } }

.uf-success {
  display: flex; align-items: center; gap: 10px;
  margin-top: 14px; padding: 13px 16px;
  border: 1px solid var(--green-border);
  background: var(--green-pale); border-radius: 8px;
  animation: slideDown 0.3s ease;
}
.uf-success-text { font-size: 13px; font-weight: 600; color: var(--green); }

.uf-formats {
  margin-top: 24px; padding-top: 18px;
  border-top: 1px solid var(--border);
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
}
.uf-fmt-label { font-size: 11px; color: var(--muted2); }
.uf-fmt-tag {
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
  color: var(--muted); background: var(--surface2);
  border: 1px solid var(--border); padding: 3px 10px; border-radius: 5px;
}
`;

const fmtSize = (b) =>
  b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const pick = (f) => { if (f) { setFile(f); setSuccess(false); } };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setSuccess(false);
    try {
      await uploadDocument(file);
      setSuccess(true); setFile(null);
    } catch (e) {
      console.error(e); alert("Upload failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="uf-wrap">
        <div className="uf-card">
          <div className="uf-eyebrow">Document Vault</div>
          <h1 className="uf-title">Upload a document</h1>
          <p className="uf-sub">Drop your study material and we'll store it securely for AI-powered question generation.</p>

          <div
            className={`uf-zone${drag ? " drag" : ""}${file ? " has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
            onClick={() => ref.current?.click()}
          >
            <input ref={ref} type="file" style={{ display: "none" }} onChange={(e) => pick(e.target.files[0])} />
            <div className="uf-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="uf-zone-main">{drag ? "Release to upload" : "Drop your file here"}</p>
            <p className="uf-zone-hint">or <span onClick={(e) => { e.stopPropagation(); ref.current?.click(); }}>browse your computer</span></p>
          </div>

          {file && (
            <div className="uf-file-row">
              <div className="uf-file-ico">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                </svg>
              </div>
              <span className="uf-file-name">{file.name}</span>
              <span className="uf-file-size">{fmtSize(file.size)}</span>
              <button className="uf-rm" onClick={() => setFile(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          )}

          <button className="uf-btn" onClick={handleUpload} disabled={!file || loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {loading ? "Uploading…" : "Upload Document"}
          </button>

          {loading && <div className="uf-progress"><div className="uf-progress-fill" /></div>}

          {success && (
            <div className="uf-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="uf-success-text">Document uploaded successfully</span>
            </div>
          )}

          <div className="uf-formats">
            <span className="uf-fmt-label">Supports:</span>
            {["PDF", "DOCX", "TXT", "MD", "CSV"].map(f => (
              <span key={f} className="uf-fmt-tag">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadForm;
