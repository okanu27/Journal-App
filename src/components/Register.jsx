import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase} from "../lib/supabaseClient.js";


function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Email and Password are required.");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }

        setSending(true);

        try {

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                throw new Error(error.message);
            }

            console.log("Registration successful:", data);

            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setSuccess("Registration successful! Please check your email to confirm your account.");

        setTimeout(() => {
            setSuccess(false);
            navigate("/login");
        }, 2000);
                  
        } catch (error) {
            console.error("Registration failed:", error);
            setError("An error occurred during registration. Please try again.");
            setTimeout(() => {
                setError("");
            }, 2000);
        } finally {
            setSending(false);
        }   
        
    };

    return (
        <section id="register" className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
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
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={sending || success}

                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {sending ? "Signing up..." : "Sign Up"}
                    </button>

                    {success && <p className="text-green-500 text-sm">Registration successful!</p>}
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
                {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
            </div>
        </section>   
    );
}

export default Register;