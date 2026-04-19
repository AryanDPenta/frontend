import React, { useEffect, useState } from "react";
import { generateQuestions } from "../services/questionService";
import axiosInstance from "../api/axiosInstance";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.gq-wrap {
  min-height: calc(100vh - 60px);
  display: flex; background: var(--bg);
}

/* LEFT PANEL */
.gq-panel {
  width: 290px; flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 28px 20px;
  display: flex; flex-direction: column; gap: 18px;
  overflow-y: auto;
}
.gq-panel-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
.gq-field { display: flex; flex-direction: column; gap: 6px; }
.gq-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted2); }
.gq-select, .gq-input {
  width: 100%; padding: 10px 12px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 8px; font-family: 'Space Grotesk', sans-serif;
  font-size: 13px; color: var(--ink); outline: none;
  transition: border-color 0.2s, background 0.2s;
  -webkit-appearance: none; appearance: none;
}
.gq-select:focus, .gq-input:focus { border-color: var(--accent); background: var(--surface3); }
.gq-select option { background: var(--surface2); }
.gq-input::placeholder { color: var(--muted2); }
.gq-diff-group { display: flex; gap: 6px; }
.gq-diff-btn {
  flex: 1; padding: 9px 4px;
  border-radius: 7px; border: 1px solid var(--border);
  background: var(--surface2); font-family: 'Space Grotesk', sans-serif;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  cursor: pointer; color: var(--muted); transition: all 0.18s;
}
.gq-diff-btn:hover { border-color: var(--border-2); color: var(--ink); }
.gq-diff-btn.active.easy { background: #14532d; border-color: #22c55e; color: #4ade80; }
.gq-diff-btn.active.medium { background: #78350f; border-color: #f59e0b; color: #fcd34d; }
.gq-diff-btn.active.hard { background: #450a0a; border-color: #ef4444; color: #f87171; }
.gq-gen-btn {
  width: 100%; padding: 13px;
  background: var(--accent); color: #fff; border: none;
  border-radius: 8px; font-family: 'Space Grotesk', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 0.04em;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 4px;
}
.gq-gen-btn:hover:not(:disabled) { background: #6d4ee0; transform: translateY(-1px); }
.gq-gen-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

/* RIGHT PANEL */
.gq-right { flex: 1; padding: 28px 32px; overflow-y: auto; }
.gq-right-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
.gq-right-title { font-size: 28px; font-weight: 700; color: var(--ink); letter-spacing: -0.4px; }
.gq-stats { display: flex; gap: 12px; }
.gq-stat {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 18px; text-align: center;
}
.gq-stat-num { display: block; font-size: 26px; font-weight: 700; color: var(--accent2); line-height: 1; }
.gq-stat-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }

/* Tabs */
.gq-tabs {
  display: flex; gap: 4px; margin-bottom: 18px;
  background: var(--surface); border-radius: 9px; padding: 4px;
}
.gq-tab {
  flex: 1; padding: 9px 12px;
  border: none; background: none; border-radius: 7px;
  font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  cursor: pointer; color: var(--muted); transition: all 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.gq-tab.active { background: var(--surface3); color: #fff; }
.gq-tab-count {
  background: var(--surface3); color: var(--muted);
  font-size: 10px; padding: 1px 7px; border-radius: 4px; font-weight: 600;
}
.gq-tab.active .gq-tab-count { background: var(--accent); color: #fff; }

/* Q Cards */
.gq-q-list { display: flex; flex-direction: column; gap: 10px; }
.gq-q-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 20px 22px;
  animation: fadeUp 0.3s ease both;
  transition: border-color 0.2s;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.gq-q-card:hover { border-color: var(--border-2); }
.gq-q-card.desc { border-left: 3px solid var(--green); }
.gq-q-card.mcq-card { border-left: 3px solid var(--accent); }

.gq-q-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.gq-q-num { font-size: 10px; font-weight: 600; color: var(--muted2); }
.gq-q-tag {
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 2px 9px; border-radius: 4px; border: 1px solid;
}
.gq-q-tag.mcq { color: var(--accent2); border-color: var(--accent-border); background: var(--accent-glow); }
.gq-q-tag.desc-tag { color: #4ade80; border-color: var(--green-border); background: var(--green-pale); }
.gq-q-text { font-size: 14px; font-weight: 500; color: var(--ink); line-height: 1.55; margin-bottom: 16px; }

/* Options */
.gq-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.gq-option {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 13px;
  border: 1px solid var(--border); border-radius: 7px;
  background: var(--surface2); transition: all 0.18s;
}
.gq-option.correct { border-color: var(--green-border); background: var(--green-pale); }
.gq-option-radio {
  width: 15px; height: 15px; border-radius: 50%;
  border: 1.5px solid var(--muted2); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
}
.gq-option.correct .gq-option-radio { border-color: var(--green); background: var(--green); }
.gq-option-text { font-size: 12px; color: var(--muted); }
.gq-option.correct .gq-option-text { color: #4ade80; font-weight: 600; }

/* Reveal btn */
.gq-reveal-btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid var(--border);
  border-radius: 6px; padding: 7px 14px;
  font-family: 'Space Grotesk', sans-serif; font-size: 11px;
  font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.18s;
}
.gq-reveal-btn:hover { border-color: var(--accent); color: var(--accent2); }

/* Answer box */
.gq-answer-box {
  margin-top: 12px; padding: 14px 16px;
  background: var(--surface2); border: 1px solid var(--border);
  border-left: 3px solid var(--green); border-radius: 0 7px 7px 0;
  animation: fadeUp 0.2s ease;
}
.gq-answer-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted2); margin-bottom: 7px; }
.gq-answer-text { font-size: 13px; color: var(--muted); line-height: 1.75; }

/* Loading */
.gq-loading {
  display: flex; flex-direction: column; align-items: center;
  padding: 80px 0; gap: 16px; animation: fadeUp 0.3s ease;
}
.gq-spinner { width: 30px; height: 30px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.85s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.gq-loading-title { font-size: 18px; font-weight: 700; color: var(--ink); }
.gq-loading-sub { font-size: 12px; color: var(--muted); text-align: center; line-height: 1.7; }

.gq-no-data { text-align: center; padding: 48px 0; font-size: 13px; color: var(--muted2); }

/* Empty state */
.gq-empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 20px; text-align: center;
}
.gq-empty-state-ico {
  width: 60px; height: 60px;
  background: var(--accent-glow); border: 1px solid var(--accent-border);
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px; color: var(--accent);
}
.gq-empty-state h3 { font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.gq-empty-state p { font-size: 13px; color: var(--muted); max-width: 280px; line-height: 1.65; }
`;

const MCQCard = ({ q, index }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="gq-q-card mcq-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="gq-q-meta">
        <span className="gq-q-num">Question {index + 1}</span>
        <span className="gq-q-tag mcq">MCQ</span>
      </div>
      <p className="gq-q-text">{q.question}</p>
      <div className="gq-options">
        {q.options.map((opt, i) => {
          const correct = show && (opt === q.answer || opt.startsWith(q.answer));
          return (
            <div key={i} className={`gq-option${correct ? " correct" : ""}`}>
              <div className="gq-option-radio">
                {correct && (
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                    <polyline points="1 5 4 8 9 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className="gq-option-text">{opt}</span>
            </div>
          );
        })}
      </div>
      <button className="gq-reveal-btn" onClick={() => setShow(v => !v)}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {show
            ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
          }
        </svg>
        {show ? "Hide Answer" : "Reveal Answer"}
      </button>
    </div>
  );
};

const DescCard = ({ q, index }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="gq-q-card desc" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="gq-q-meta">
        <span className="gq-q-num">Question {index + 1}</span>
        <span className="gq-q-tag desc-tag">Descriptive</span>
      </div>
      <p className="gq-q-text">{q.question}</p>
      <button className="gq-reveal-btn" onClick={() => setShow(v => !v)}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {show
            ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
          }
        </svg>
        {show ? "Hide Answer" : "Show Sample Answer"}
      </button>
      {show && (
        <div className="gq-answer-box">
          <div className="gq-answer-label">Sample Answer</div>
          <p className="gq-answer-text">{q.answer}</p>
        </div>
      )}
    </div>
  );
};

const GenerateQuestionsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("mcq");
  const [form, setForm] = useState({ num_questions: 5, difficulty: "easy", topic: "" });

  useEffect(() => {
    axiosInstance.get("/documents/")
      .then(res => setDocuments(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleGenerate = async () => {
    if (!selectedDoc) { alert("Select a document"); return; }
    setLoading(true); setResult(null);
    try {
      const res = await generateQuestions({ document_id: selectedDoc, ...form });
      setResult(res.data.questions); setActiveTab("mcq");
    } catch (err) {
      console.error(err.response?.data); alert("Error generating questions");
    } finally { setLoading(false); }
  };

  const mcqs = result?.mcqs || [];
  const descriptive = result?.descriptive || [];

  return (
    <>
      <style>{styles}</style>
      <div className="gq-wrap">
        {/* LEFT CONFIG PANEL */}
        <div className="gq-panel">
          <div className="gq-panel-title">Configuration</div>
          <div className="gq-field">
            <label className="gq-label">Source Document</label>
            <select className="gq-select" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}>
              <option value="">Select a document…</option>
              {documents.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
            </select>
          </div>
          <div className="gq-field">
            <label className="gq-label">No. of Questions</label>
            <input type="number" className="gq-input" value={form.num_questions} min={1} max={20}
              onChange={e => setForm({ ...form, num_questions: e.target.value })} />
          </div>
          <div className="gq-field">
            <label className="gq-label">Topic Focus <span style={{ color: "var(--muted2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input type="text" className="gq-input" placeholder="e.g. Neural Networks…"
              value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
          </div>
          <div className="gq-field">
            <label className="gq-label">Difficulty</label>
            <div className="gq-diff-group">
              {["easy", "medium", "hard"].map(d => (
                <button key={d}
                  className={`gq-diff-btn ${d}${form.difficulty === d ? " active" : ""}`}
                  onClick={() => setForm({ ...form, difficulty: d })}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button className="gq-gen-btn" onClick={handleGenerate} disabled={loading || !selectedDoc}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            {loading ? "Generating…" : "Generate Now"}
          </button>
        </div>

        {/* RIGHT RESULTS PANEL */}
        <div className="gq-right">
          {loading && (
            <div className="gq-loading">
              <div className="gq-spinner" />
              <p className="gq-loading-title">Crafting Your Questions</p>
              <p className="gq-loading-sub">Analysing document and generating<br />{form.num_questions} {form.difficulty} questions…</p>
            </div>
          )}

          {!result && !loading && (
            <div className="gq-empty-state">
              <div className="gq-empty-state-ico">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <h3>Ready to generate</h3>
              <p>Configure your settings on the left and hit Generate to create AI-powered questions from your document.</p>
            </div>
          )}

          {result && !loading && (
            <>
              <div className="gq-right-header">
                <h2 className="gq-right-title">Results</h2>
                <div className="gq-stats">
                  <div className="gq-stat">
                    <span className="gq-stat-num">{mcqs.length}</span>
                    <span className="gq-stat-lbl">MCQs</span>
                  </div>
                  <div className="gq-stat">
                    <span className="gq-stat-num">{descriptive.length}</span>
                    <span className="gq-stat-lbl">Descriptive</span>
                  </div>
                </div>
              </div>
              <div className="gq-tabs">
                <button className={`gq-tab${activeTab === "mcq" ? " active" : ""}`} onClick={() => setActiveTab("mcq")}>
                  Multiple Choice <span className="gq-tab-count">{mcqs.length}</span>
                </button>
                <button className={`gq-tab${activeTab === "desc" ? " active" : ""}`} onClick={() => setActiveTab("desc")}>
                  Descriptive <span className="gq-tab-count">{descriptive.length}</span>
                </button>
              </div>
              <div className="gq-q-list">
                {activeTab === "mcq" && (
                  mcqs.length > 0
                    ? mcqs.map((q, i) => <MCQCard key={i} q={q} index={i} />)
                    : <p className="gq-no-data">No MCQs were generated.</p>
                )}
                {activeTab === "desc" && (
                  descriptive.length > 0
                    ? descriptive.map((q, i) => <DescCard key={i} q={q} index={i} />)
                    : <p className="gq-no-data">No descriptive questions were generated.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GenerateQuestionsPage;
