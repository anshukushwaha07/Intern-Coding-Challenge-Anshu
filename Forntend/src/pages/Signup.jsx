import { useState } from "react";
import axios from "../api/axios.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { FiUser, FiMail, FiLock, FiHome, FiLogIn } from "react-icons/fi"; // Feather Icons

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Sign up the new user
      await axios.post("/auth/signup", { name, email, address, password });

      // Step 2: Automatically log in the user after signup
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);

      // Step 3: Navigate based on user role
      const userRole = res.data.user.role;
      if (userRole === "admin") navigate("/admin");
      else if (userRole === "owner") navigate("/owner");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Create Your Account</h1>
            <p className="mt-2 text-gray-600">Join us and start your journey today.</p>
        </div>

        {/* The Form with soft shadow and rounded corners */}
        <form 
          onSubmit={handleSubmit} 
          className="p-8 space-y-6 bg-white/60 backdrop-blur-md rounded-xl shadow-lg"
        >
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Input fields with icons */}
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiUser className="h-5 w-5 text-gray-400" /></span>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiMail className="h-5 w-5 text-gray-400" /></span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-gray-400">(Optional)</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiHome className="h-5 w-5 text-gray-400" /></span>
                <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Delhi" className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiLock className="h-5 w-5 text-gray-400" /></span>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 disabled:bg-blue-400"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
              {!isLoading && <FiLogIn />}
            </button>
          </div>
        </form>
        
        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}