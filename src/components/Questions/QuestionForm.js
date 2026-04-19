import React, { useState } from "react";
import { generateQuestions } from "../../services/questionService";

const QuestionForm = () => {
    const [form, setForm] = useState({
        num_questions: 5,
        difficulty: "easy",
        topic: "",
    });

    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        try {
            const res = await generateQuestions(form);
            setResult(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
    <div className="card">
        <h2>Generate Questions</h2>
        ...
    </div>
);
};

export default QuestionForm;