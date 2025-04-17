import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const redirectToDashboard = () => {
        const storedRole = localStorage.getItem("role");
        if (storedRole === "admin") {
            navigate("/admin");
        } else if (storedRole === "employee") {
            navigate("/employee");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onLogin(username, password);
        if (success) {
            redirectToDashboard();
        } else {
            setError("⚠️ Invalid credentials. Please try again.");
        }
    };

    const handleQuickLogin = async (user: string, pass: string) => {
        const success = await onLogin(user, pass);
        if (success) {
            redirectToDashboard();
        } else {
            setError("⚠️ Quick login failed.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-100">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-blue-700 tracking-tight">
                    🔐 Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <input
                        type="text"
                        placeholder="👤 Username"
                        className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-xl px-4 py-3 sm:px-5 sm:py-3 text-sm shadow placeholder-gray-400 transition-all"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="🔒 Password"
                        className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-xl px-4 py-3 sm:px-5 sm:py-3 text-sm shadow placeholder-gray-400 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        🔑 Log In
                    </button>
                </form>

                <div className="mt-6 sm:mt-8 border-t pt-5 sm:pt-6 text-center">
                    <p className="mb-3 font-medium text-gray-600 text-sm sm:text-base">
                        ✨ Quick Login
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <button
                            className="w-full sm:w-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow transition font-medium text-sm sm:text-base"
                            onClick={() => handleQuickLogin("admin", "admin123")}
                        >
                            🛠 Admin
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow transition font-medium text-sm sm:text-base"
                            onClick={() => handleQuickLogin("employee1", "employee123")}
                        >
                            👷 Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
