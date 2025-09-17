import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { FaUsers, FaStore, FaStar, FaSpinner } from "react-icons/fa";
import { FiShoppingBag, FiMail, FiMapPin } from "react-icons/fi"; // New icons for the form

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });

  useEffect(() => {
    // Adding a slight delay to better visualize the skeleton loader
    const timer = setTimeout(() => {
      axios
        .get("/admin/stats")
        .then((res) => setStats(res.data))
        .catch((err) =>
          setMessage({
            type: "error",
            content: err.response?.data?.message || "Error loading stats",
          })
        )
        .finally(() => setIsLoading(false));
    }, 500); // 0.5-second delay
    return () => clearTimeout(timer);
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (!storeName || !storeEmail || !storeAddress) {
      setMessage({ type: "error", content: "All fields are required." });
      return;
    }
    setIsSubmitting(true);
    setMessage({ type: "", content: "" });
    try {
      await axios.post("/admin/stores", {
        name: storeName,
        email: storeEmail,
        address: storeAddress,
      });
      setMessage({ type: "success", content: "Store added successfully!" });
      setStoreName("");
      setStoreEmail("");
      setStoreAddress("");
    } catch (err) {
      setMessage({
        type: "error",
        content: err.response?.data?.message || "Error adding store",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // The StatCard with the new "glassmorphism" style
  const StatCard = ({ icon, title, value, isLoading }) => (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
      {isLoading ? (
        <div className="animate-pulse flex items-center space-x-4">
            <div className="rounded-full bg-gray-300/50 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300/50 rounded w-1/2"></div>
            </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="bg-white/50 p-3 rounded-full">{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back! Here's an overview of your platform's activity.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Stats Section taking 3 columns */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6">
            <StatCard
              icon={<FaUsers className="h-6 w-6 text-blue-600" />}
              title="Total Users"
              value={stats?.total_users}
              isLoading={isLoading}
            />
            <StatCard
              icon={<FaStore className="h-6 w-6 text-green-600" />}
              title="Total Stores"
              value={stats?.total_stores}
              isLoading={isLoading}
            />
            <StatCard
              icon={<FaStar className="h-6 w-6 text-yellow-500" />}
              title="Total Ratings"
              value={stats?.total_ratings}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Add Store Section taking 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a New Store</h2>
            
            {message.content && (
              <div className={`p-3 mb-4 rounded-lg text-sm font-medium border ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/30 text-green-700' 
                    : 'bg-red-500/10 border-red-500/30 text-red-700'
                }`}
              >
                {message.content}
              </div>
            )}
            
            <form onSubmit={handleAddStore} className="space-y-6">
              {/* Store Name Input */}
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiShoppingBag className="h-5 w-5 text-gray-400" /></span>
                  <input id="storeName" type="text" placeholder="e.g., The Grand Market" value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              {/* Store Email Input */}
              <div>
                <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">Store Owner Email</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiMail className="h-5 w-5 text-gray-400" /></span>
                    <input id="storeEmail" type="email" placeholder="owner@example.com" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Store Address Input */}
              <div>
                <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiMapPin className="h-5 w-5 text-gray-400" /></span>
                    <input id="storeAddress" type="text" placeholder="123 Main St, New Delhi" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <button
                type="submit" disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 disabled:bg-blue-400"
              >
                {isSubmitting ? <FaSpinner className="animate-spin h-5 w-5" /> : 'Add Store'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}