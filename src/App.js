import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import DocumentsPage from "./pages/DocumentsPage";
import GenerateQuestionsPage from "./pages/GenerateQuestionsPage";
import "./App.css";

const S = `
.nav {
  position: sticky; top: 0; z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  height: 60px;
  display: flex; align-items: center;
  padding: 0 28px;
  justify-content: space-between;
}
.nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.nav-brand-ico {
  width: 30px; height: 30px;
  background: var(--accent);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
}
.nav-brand-name {
  font-size: 16px; font-weight: 700; color: var(--ink); letter-spacing: -0.3px;
}
.nav-brand-name em { color: var(--accent2); font-style: normal; }
.nav-links { display: flex; align-items: center; gap: 2px; }
.nav-link {
  position: relative; text-decoration: none;
  font-size: 13px; font-weight: 600;
  color: var(--muted);
  padding: 7px 16px; border-radius: 7px;
  transition: all 0.18s;
}
.nav-link:hover { color: var(--ink); background: var(--surface2); }
.nav-link.active { color: var(--ink); background: var(--surface3); }
@media (max-width: 600px) {
  .nav { padding: 0 16px; height: 54px; }
  .nav-brand-name { font-size: 14px; }
  .nav-link { font-size: 12px; padding: 6px 10px; }
}
`;

const navItems = [
  { to: "/", label: "Upload" },
  { to: "/documents", label: "Documents" },
  { to: "/generate", label: "Generate" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <>
      <style>{S}</style>
      <nav className="nav">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="nav-brand-name">Question<em>Forge</em></span>
        </Link>
        <div className="nav-links">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link${pathname === item.to ? " active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/generate" element={<GenerateQuestionsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
