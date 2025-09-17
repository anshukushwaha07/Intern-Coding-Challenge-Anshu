import { useState } from "react";
import axios from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors on a new submission

    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      
      // Navigate based on user role after successful login
      const userRole = res.data.user.role;
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "owner") {
        navigate("/owner");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Set a user-friendly error message from the server response
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      // Ensure the loading state is turned off regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    // The main container with the gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      
      <div className="w-full max-w-md space-y-8">
        
        {/* Header Section */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back!</h1>
            <p className="mt-2 text-gray-600">Sign in to continue your journey.</p>
        </div>

        {/* The Form with glassmorphism effect */}
        <form 
          onSubmit={handleSubmit} 
          className="p-8 space-y-6 bg-white/60 backdrop-blur-md rounded-xl shadow-lg"
        >
          {/* Display error message if it exists */}
          {error && (
            <div className="p-3 bg-red-100 border-l-4 border-red-400 text-red-700 rounded-md text-sm">
              <p className="font-bold">Login Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit" disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <FiLogIn />}
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}