import React from "react";

const DocumentItem = ({ doc, onDelete }) => {
    return (
    <div className="card">
        <span>{doc.name}</span>
        <button onClick={() => onDelete(doc.id)}>Delete</button>
    </div>
);
};

export default DocumentItem;