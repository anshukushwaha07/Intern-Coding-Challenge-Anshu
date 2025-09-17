import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { FaSpinner } from "react-icons/fa";
import { FiShoppingBag, FiMail, FiMapPin, FiUserCheck } from "react-icons/fi";

export default function AdminEditStore() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const [owners, setOwners] = useState([]); // NEW: list of owners
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // fetch store details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, ownersRes] = await Promise.all([
          axios.get(`/admin/stores/${id}`),
          axios.get(`/admin/owners`)
        ]);
        const store = storeRes.data;
        setName(store.name || "");
        setEmail(store.email || "");
        setAddress(store.address || "");
        setOwnerId(store.owner_id || "");
        setOwners(ownersRes.data); // fill dropdown
      } catch (err) {
        setMessage({
          type: "error",
          content: err.response?.data?.message || "Error loading store",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", content: "" });

    try {
      await axios.put(`/admin/stores/${id}`, {
        name,
        email,
        address,
        owner_id: ownerId || null,
      });
      setMessage({ type: "success", content: "Store updated successfully!" });
      setTimeout(() => navigate("/admin/stores"), 1000);
    } catch (err) {
      setMessage({
        type: "error",
        content: err.response?.data?.message || "Error updating store",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-4">Loading store...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Edit Store</h1>
          <p className="mt-1 text-gray-600">Update store details or reassign owner.</p>
        </div>

        {message.content && (
          <div
            className={`p-3 mb-6 rounded-lg text-sm font-medium border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-700"
                : "bg-red-500/10 border-red-500/30 text-red-700"
            }`}
          >
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
         
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="storeName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Store Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiShoppingBag className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="storeName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="storeEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Store Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="storeEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
              Owner <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiUserCheck className="h-5 w-5 text-gray-400" />
              </span>
              <select
                id="ownerId"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- No Owner --</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-8 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 disabled:bg-blue-400"
          >
            {isSubmitting ? <FaSpinner className="animate-spin h-5 w-5" /> : "Update Store"}
          </button>
        </form>
      </div>
    </div>
  );
}
