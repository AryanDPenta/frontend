import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import DocumentsPage from "./pages/DocumentsPage";
import GenerateQuestionsPage from "./pages/GenerateQuestionsPage";

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Upload</Link>
                <Link to="/documents">Documents</Link>
                <Link to="/generate">Generate Questions</Link>
            </nav>

            <div className="container">
                <Routes>
                    <Route path="/" element={<UploadPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/generate" element={<GenerateQuestionsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;