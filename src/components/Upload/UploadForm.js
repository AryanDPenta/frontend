import React, { useState } from "react";
import { uploadDocument } from "../../services/documentService";

const UploadForm = () => {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            alert("Select a file");
            return;
        }

        try {
            await uploadDocument(file);
            alert("Upload successful");
            setFile(null);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        }
    };

    return (
    <div className="card">
        <h2>Upload Document</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
    </div>
);}

export default UploadForm;