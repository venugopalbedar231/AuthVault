// frontend/src/pages/Login.jsx
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Navigate, Link } from "react-router-dom";
import BACKEND_URL from "../api/url";
import { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext.jsx";
import { BookOpen, Mail, Lock, ArrowRight, Loader } from "lucide-react";

function Login() {
    const { accessToken, login } = useAuth();
    const navigate = useNavigate();
    const { getNotes } = useContext(NoteContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (accessToken) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await BACKEND_URL.post("/login", { email, password });
            login(response.data.accessToken);
            await getNotes();
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-4">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-gray-400 text-sm mt-1">Sign in to your notes</p>
                </div>

                {/* Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Register link */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;