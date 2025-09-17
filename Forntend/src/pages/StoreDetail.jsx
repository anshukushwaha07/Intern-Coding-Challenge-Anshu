import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FaStar, FaSpinner } from "react-icons/fa";

export default function StoreDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]); // individual ratings
  const [myRating, setMyRating] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // fetch store info + ratings
  useEffect(() => {
    fetchStore();
  }, [id]);

  const fetchStore = async () => {
    try {
      // you can make backend return store + ratings in one endpoint
      const [storeRes, ratingsRes] = await Promise.all([
        axios.get(`/stores/${id}`),
        axios.get(`/stores/${id}/ratings`) // <-- endpoint returns all ratings for that store
      ]);
      setStore(storeRes.data);
      setRatings(ratingsRes.data);
    } catch (err) {
      setMessage({
        type: "error",
        content: err.response?.data?.message || "Error loading store"
      });
    }
  };

  const handleRate = async () => {
    if (!myRating || myRating < 1 || myRating > 5) {
      setMessage({ type: "error", content: "Rating must be between 1 and 5." });
      return;
    }
    setSubmitting(true);
    setMessage({ type: "", content: "" });
    try {
      await axios.post(`/stores/${id}/rating`, {
        rating: parseInt(myRating)
      });
      setMessage({ type: "success", content: "Rating saved!" });
      setMyRating("");
      fetchStore(); // reload store & ratings
    } catch (err) {
      setMessage({
        type: "error",
        content: err.response?.data?.message || "Error saving rating"
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    }
  };

  if (!store) return <p className="p-4">Loading store...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
      <p className="mt-1 text-gray-600">{store.address}</p>
      <p className="mt-1 text-gray-600">{store.email}</p>

      {/* Average rating */}
      <div className="flex items-center gap-2 mt-3 text-lg">
        <FaStar className="text-yellow-400" />
        <span className="font-bold text-gray-700">
          {Number(store.average_rating).toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          ({store.rating_count} ratings)
        </span>
      </div>

      {/* Rate this store */}
      <div className="mt-6">
        {user ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="5"
              value={myRating}
              onChange={(e) => setMyRating(e.target.value)}
              placeholder="1-5"
              className="w-20 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            />
            <button
              onClick={handleRate}
              className="w-24 flex justify-center items-center px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-blue-400"
              disabled={submitting}
            >
              {submitting ? (
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

      {message.content && (
        <p
          className={`mt-3 text-sm font-medium ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.content}
        </p>
      )}

      {/* List of individual ratings */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Customer Ratings</h2>
        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings yet.</p>
        ) : (
          <ul className="space-y-3">
            {ratings.map((r) => (
              <li
                key={r.id}
                className="p-3 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold text-gray-700">
                    {r.rating}/5
                  </span>
                  <span className="text-sm text-gray-500">
                    by {r.user_name}
                  </span>
                </div>
                {r.comment && (
                  <p className="mt-1 text-gray-600 text-sm">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
