import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseClient.js";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Email and Password are required.");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }

        setSending(true);

        try {
            
           const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            });

            if (error) {
                throw new Error(error.message);
            }

            console.log("Login successful:", data);

            navigate("/home"); // Redirect to home page after successful login
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "An error occurred during login.");
            setTimeout(() => {
                setError("");
            }, 2000);
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="login" className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={sending}
                    >
                        {sending ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register </Link>
                    or login with 
                </p>

                <p className="mt-4 text-center item-center text-sm">
                    <Link to="/auth/google" className="btn btn-danger btn-block item-center flex justify-center gap-2">
                            <FcGoogle size={22} /> 
                    </Link>
                </p>
            </div>
        </section>
    );
}

export default Login;