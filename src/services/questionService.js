import axiosInstance from "../api/axiosInstance";

export const generateQuestions = (data) => {
    return axiosInstance.post("/questions/generate/", data);
};