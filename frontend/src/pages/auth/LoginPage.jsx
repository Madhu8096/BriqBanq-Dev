import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }
        setLoading(true);
        try {
            const response = await API.post("/login", { email: email.trim(), password });

            // Expected backend response structure
            const user = response.data?.user;
            const token = response.data?.token || "mock-token-from-backend";

            if (user && user.role) {
                login(token, user);
                // Redirect based on role
                if (user.role === "borrower") navigate("/borrower", { replace: true });
                else if (user.role === "investor") navigate("/investor", { replace: true });
                else if (user.role === "lender") navigate("/lender", { replace: true });
                else if (user.role === "admin") navigate("/admin", { replace: true });
                else navigate("/", { replace: true });
            } else {
                throw new Error("Invalid response from server.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>
            <header className="relative z-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link to="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Brickbanq
                    </Link>
                </div>
            </header>
            <main className="relative z-10 flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 p-8 shadow-2xl">
                    <h1 className="text-2xl font-bold text-white mb-1">Log In</h1>
                    <p className="text-white/50 text-sm mb-6">Enter your details to access your dashboard.</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0a0e17] hover:opacity-95 disabled:opacity-50 transition-opacity"
                        >
                            {loading ? "Logging in…" : "Log In"}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-white/50">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Register
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
