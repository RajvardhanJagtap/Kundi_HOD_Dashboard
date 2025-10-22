"use client";
import { FiEye } from "react-icons/fi";
import { useState } from "react";
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex">
                    {/* Left Side - Image and Branding */}
                    <div className="hidden md:flex md:w-2/5 relative">
                        <div 
                            className="w-full h-full bg-cover bg-center bg-no-repeat min-h-[600px] relative"
                            style={{
                                backgroundImage: "url('/img/ur-headquater.webp')"
                            }}
                        >
                            {/* Dark overlay for better text readability */}
                            <div className="absolute inset-0 bg-black bg-opacity-50" />
                            
                            {/* Content */}
                            <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">
                                {/* Top - Logo and Title */}
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                        <img
                                            src="/img/logo.jpeg"
                                            alt="SAMPS UR Logo"
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <span className="text-xl font-bold">SAMPS UR</span>
                                </div>

                                {/* Bottom - Quote */}
                                <div className="space-y-4">
                                    <blockquote className="text-2xl font-light leading-relaxed">
                                        "Empowering education through innovative technology and seamless academic management."
                                    </blockquote>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full md:w-3/5 flex items-center justify-center p-8 md:p-12">
                        <div className="w-full max-w-lg">
                            {/* Mobile Logo - Only shown on small screens */}
                            <div className="md:hidden text-center mb-8">
                                <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
                                    <img
                                        src="/img/logo.jpeg"
                                        alt="SAMPS UR Logo"
                                        className="w-12 h-12 object-contain"
                                    />
                                </div>
                                <h1 className="text-2xl font-bold text-[#026892]">SAMPS UR</h1>
                            </div>

                            {/* Welcome Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back to SAMPS</h2>
                                <p className="text-gray-600 text-sm">
                                    Student Academic Management Platform
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Login Form */}
                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        autoComplete="email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#026892] focus:border-[#026892] text-gray-900 placeholder-gray-400 transition-colors"
                                        placeholder="example@gmail.com"
                                        value={usernameOrEmail}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#026892] focus:border-[#026892] text-gray-900 placeholder-gray-400 transition-colors pr-12"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <a href="#" className="text-sm text-[#026892] hover:text-[#035a6d] font-medium">
                                        Forgot password?
                                    </a>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-[#026892] focus:ring-[#026892] border-gray-300 rounded"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                                            Remember sign in details
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-[#026892] hover:bg-[#035a6d] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#026892] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Signing in..." : "Log in"}
                                </button>
                            </form>

                            {/* Help Section */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-500">
                                    Don't have an account?{" "}
                                    <a href="#" className="text-[#026892] hover:text-[#035a6d] font-medium">
                                        Contact IT Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
