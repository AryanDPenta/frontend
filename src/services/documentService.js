import axiosInstance from "../api/axiosInstance";

export const uploadDocument = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post("/documents/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getDocuments = () => {
    return axiosInstance.get("/documents/");
};

export const deleteDocument = (id) => {
    return axiosInstance.delete(`/documents/${id}/`);
};