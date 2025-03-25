'use client';
import { useEffect, useState } from "react";
import { fetchHistory } from "../app/utils/api"; // Updated Path

const HistoryList = ({ token }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchHistory(token);
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
            setLoading(false);
        };
        loadHistory();
    }, [token]);

    if (loading) return <p>Loading history...</p>;

    return (
        <div className="mt-6 p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Price History</h2>
            <ul>
                {history.length === 0 ? <p>No history available.</p> : history.map((item) => (
                    <li key={item._id} className="mb-2 p-2 border-b">
                        <strong>{item.productName}</strong> ({item.currentSite}): ₹{item.currentPrice}
                        <p>Comparisons:</p>
                        <ul className="ml-4 text-sm">
                            {item.comparisons.map((comp, index) => (
                                <li key={index}>🔹 {comp.site}: ₹{comp.price}</li>
                            ))}
                        </ul>
                        <p className="text-gray-500 text-xs">{new Date(item.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HistoryList;
