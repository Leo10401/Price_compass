import { useState } from "react";
import { loginUser } from "../app/utils/api"; // Updated Path

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(username, password);
            localStorage.setItem("token", data.token);
            setToken(data.token);
        } catch (err) {
            setError("Invalid credentials. Try again.");
        }
    };

    return (
        <div className="flex flex-col items-center p-4 border rounded shadow-lg bg-white w-80">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-2 w-full">
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="p-2 border rounded"
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="p-2 border rounded"
                    required 
                />
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
