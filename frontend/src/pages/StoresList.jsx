import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FaStar, FaSpinner } from "react-icons/fa";

// A skeleton loader component for a better initial loading experience
const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="w-full sm:w-1/3">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-24"></div>
      <div className="w-full sm:w-auto h-10 bg-gray-200 rounded-md mt-2 sm:mt-0"></div>
    </div>
  </div>
);

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [message, setMessage] = useState({ id: null, type: "", content: "" });
  const { user } = useAuth();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    axios.get("/stores").then((res) => {
      setStores(res.data);
      const initialRatings = {};
      res.data.forEach((s) => (initialRatings[s.id] = ""));
      setRatings(initialRatings);
      setIsLoading(false);
    });
  };

  const handleChange = (storeId, value) => {
    setRatings((prev) => ({ ...prev, [storeId]: value }));
  };

  const handleRate = async (storeId) => {
    const ratingValue = ratings[storeId];
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      setMessage({
        id: storeId,
        type: "error",
        content: "Rating must be between 1 and 5.",
      });
      return;
    }

    setSubmittingId(storeId);
    setMessage({ id: null, type: "", content: "" }); // Clear old messages

    try {
      await axios.post(`/stores/${storeId}/rating`, {
        rating: parseInt(ratingValue),
      });
      setMessage({ id: storeId, type: "success", content: "Rating saved!" });
      fetchStores(); // Reload stores to refresh average ratings
    } catch (err) {
      setMessage({
        id: storeId,
        type: "error",
        content: err.response?.data?.message || "Error saving rating.",
      });
    } finally {
      setSubmittingId(null);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ id: null, type: "", content: "" }), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Stores</h1>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Stores</h1>
      <div className="space-y-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Store Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  <Link
                    to={`/stores/${store.id}`}
                    className="hover:underline text-blue-600"
                  >
                    {store.name}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500">{store.address}</p>
              </div>

              {/* Average Rating */}
              <div className="flex items-center gap-2 text-lg shrink-0">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-gray-700">
                  {Number(store.average_rating).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({store.rating_count} ratings)
                </span>
              </div>

              {/* Rating Form */}
              <div className="w-full sm:w-auto shrink-0">
                {user ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={ratings[store.id] || ""}
                      onChange={(e) => handleChange(store.id, e.target.value)}
                      placeholder="1-5"
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={submittingId === store.id}
                    />
                    <button
                      onClick={() => handleRate(store.id)}
                      className="w-24 flex justify-center items-center px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-blue-400"
                      disabled={submittingId === store.id}
                    >
                      {submittingId === store.id ? (
                        <FaSpinner className="animate-spin h-5 w-5" />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Login to rate this store
                  </p>
                )}
              </div>
            </div>
            {/* Feedback Message */}
            {message.id === store.id && (
              <p
                className={`mt-3 text-sm font-medium ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
