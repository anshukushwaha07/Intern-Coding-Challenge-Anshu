import { useState } from "react";
import axios from "../api/axios.js";
import { FaSpinner } from "react-icons/fa";
import { FiUser, FiMail, FiMapPin, FiLock, FiShield, FiChevronDown } from "react-icons/fi";

export default function AdminAddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", content: "" });

    try {
      await axios.post("/admin/users", {
        name,
        email,
        address,
        password,
        role,
      });
      setMessage({ type: "success", content: "User added successfully!" });
      // Reset form fields
      setName("");
      setEmail("");
      setAddress("");
      setPassword("");
      setRole("user");
    } catch (err) {
      setMessage({
        type: "error",
        content: err.response?.data?.message || "Error adding user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
        
        {/* Header */}
        <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Create a New User</h1>
            <p className="mt-1 text-gray-600">Add a new user and assign them a role in the system.</p>
        </div>

        {/* Feedback Message */}
        {message.content && (
          <div className={`p-3 mb-6 rounded-lg text-sm font-medium border ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-700' 
                : 'bg-red-500/10 border-red-500/30 text-red-700'
            }`}
          >
            {message.content}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiUser className="h-5 w-5 text-gray-400" /></span>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiMail className="h-5 w-5 text-gray-400" /></span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-gray-400">(Optional)</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiMapPin className="h-5 w-5 text-gray-400" /></span>
              <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiLock className="h-5 w-5 text-gray-400" /></span>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiShield className="h-5 w-5 text-gray-400" /></span>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full pl-10 pr-10 py-2 bg-gray-50/70 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><FiChevronDown className="h-5 w-5 text-gray-400" /></span>
              </div>
            </div>
          </div>
          
          <button
            type="submit" disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-8 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 disabled:bg-blue-400"
          >
            {isSubmitting ? <FaSpinner className="animate-spin h-5 w-5" /> : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
}