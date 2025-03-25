'use client';
import { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import HistoryList from "../components/HistoryList";

const Home = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Price History Tracker</h1>
            {token ? (
                <>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">Logout</button>
                    <HistoryList token={token} />
                </>
            ) : (
                <LoginForm setToken={setToken} />
            )}
        </div>
    );
};

export default Home;
