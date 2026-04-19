import React, { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../../services/documentService";
import DocumentItem from "./DocumentItem";

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);

    const fetchDocs = async () => {
        const res = await getDocuments();
        setDocuments(res.data);
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleDelete = async (id) => {
        await deleteDocument(id);
        fetchDocs();
    };

    return (
        <div>
            <h2>Documents</h2>
            {documents.map((doc) => (
                <DocumentItem key={doc.id} doc={doc} onDelete={handleDelete} />
            ))}
        </div>
    );
};

export default DocumentList;