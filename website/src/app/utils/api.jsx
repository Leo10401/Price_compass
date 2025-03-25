import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const loginUser = async (username, password) => {
    const response = await axios.post(`${API}/api/auth/login`, { username, password });
    return response.data;
};

export const fetchHistory = async (token) => {
    const response = await axios.get(`${API}/api/prices`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
