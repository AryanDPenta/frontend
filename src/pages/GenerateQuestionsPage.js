import React, { useEffect, useState } from "react";
import { generateQuestions } from "../services/questionService";
import axiosInstance from "../api/axiosInstance";

const GenerateQuestionsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        num_questions: 5,
        difficulty: "easy",
        topic: "",
    });

    // Fetch documents
    useEffect(() => {
        axiosInstance.get("/documents/")
            .then(res => setDocuments(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleGenerate = async () => {
        if (!selectedDoc) {
            alert("Select a document");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const res = await generateQuestions({
                document_id: selectedDoc,
                ...form
            });

            setResult(res.data.questions);
        } catch (err) {
            console.error(err.response?.data);
            alert("Error generating questions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">

            <div className="card">
                <h2>Generate Questions</h2>

                {/* Document Dropdown */}
                <select onChange={(e) => setSelectedDoc(e.target.value)}>
                    <option value="">Select Document</option>
                    {documents.map(doc => (
                        <option key={doc.id} value={doc.id}>
                            {doc.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    value={form.num_questions}
                    onChange={(e) =>
                        setForm({ ...form, num_questions: e.target.value })
                    }
                />

                <select
                    onChange={(e) =>
                        setForm({ ...form, difficulty: e.target.value })
                    }
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <input
                    type="text"
                    placeholder="Topic"
                    onChange={(e) =>
                        setForm({ ...form, topic: e.target.value })
                    }
                />

                <button onClick={handleGenerate}>
                    Generate
                </button>
            </div>

            {/* Loading */}
            {loading && <p>Generating questions...</p>}

            {/* Results */}
            {result && (
                <div>

                    {/* MCQs */}
                    <div className="card">
                        <h3>MCQs</h3>
                        {result.mcqs.map((q, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <p><b>Q{index + 1}:</b> {q.question}</p>

                                {q.options.map((opt, i) => (
                                    <div key={i}>
                                        <input type="radio" disabled />
                                        <label>{opt}</label>
                                    </div>
                                ))}

                                <p style={{ color: "green" }}>
                                    Answer: {q.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Descriptive */}
                    <div className="card">
                        <h3>Descriptive Questions</h3>
                        {result.descriptive.map((q, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <p><b>Q{index + 1}:</b> {q.question}</p>
                                <p style={{ color: "blue" }}>
                                    {q.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
};

export default GenerateQuestionsPage;