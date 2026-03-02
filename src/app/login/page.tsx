"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HODLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [usernameOrEmail, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(usernameOrEmail, password);
            localStorage.removeItem("hod_logged_in");
            router.push("/dashboard");
        } catch (error: any) {
            console.error('Login error:', error);
            setError(
                error.response?.data?.message || 
                "Invalid credentials. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full h-screen bg-white overflow-hidden flex">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 min-h-screen">
                {/* single responsive image that covers the panel */}
                <img
                    src="/img/graduated.jpg"
                    alt="Decorative background"
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-95"
                    loading="lazy"
                    decoding="async"
                />

                {/* subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="relative z-10 p-8 flex flex-col justify-between text-white w-full">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <img src="/img/logo.jpeg" alt="SAMPS UR Logo" className="h-14 w-14  rounded-full" />
                        </div>
                    </div>

                    <div>
                        <p className="text-lg font-bold mb-6 leading-tight">
                            "To be a leading University that develops highly enterprising graduates prepared and dedicated to building a more just and sustainable society locally, nationally and globally, with appropriate innovations that advance quality of life."
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 min-h-screen">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="flex gap-1">
                            <img src="/img/logo.jpeg" alt="SAMPS UR Logo" className="h-8 w-8  rounded-full" />
                        </div>
                        <span className="text-xl font-semibold text-gray-900">SAMPS UR</span>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back to <br/>HOD Portal
                        </h1>
                        <p className="text-gray-500">
                            Student Academic Management Platform
                        </p>
                    </div>

                    {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={usernameOrEmail}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#026892] focus:border-transparent transition"
                                placeholder="hod@ur.ac.rw"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#026892] focus:border-transparent transition"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5 hover:cursor-pointer" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                className="text-sm text-[#026892] hover:text-purple-700 font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Remember sign in details</span>
                            <button
                                type="button"
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:cursor-pointer ${
                                    rememberMe ? 'bg-[#026892]' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        rememberMe ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#026892] text-white py-3 rounded-lg font-medium hover:bg-[#026892]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                        >
                            {isLoading ? "Signing in..." : "Log in"}
                        </button>
                    </form>
                </div>
            </div>
            </div>
        </div>
    );
}
